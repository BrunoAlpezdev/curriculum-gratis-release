import { auth } from "@clerk/nextjs/server"
import { verificarRateLimit } from "@/lib/rate-limit"
import { USAGE_LIMITS, USAGE_WINDOW_SECONDS } from "@/lib/usage-limits"

const MAX_INPUT_CHARS = 1600
const MIN_OUTPUT_CHARS = 80

function extraerTextoGemini(valor: unknown): string {
  const raiz = valor as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  return raiz.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join(" ")
    .trim() ?? ""
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"

  if (!apiKey) {
    return Response.json({ error: "IA no configurada." }, { status: 503 })
  }

  const { userId } = await auth()
  const rateLimit = await verificarRateLimit(request, {
    namespace: "ai:profile",
    limit: userId ? USAGE_LIMITS.free.aiProfile : USAGE_LIMITS.anonymous.aiProfile,
    windowSeconds: USAGE_WINDOW_SECONDS,
    message: userId
      ? "Alcanzaste tu limite diario de IA. Intenta nuevamente manana."
      : "Alcanzaste el limite anonimo de IA. Inicia sesion gratis para mas usos diarios.",
    identity: userId ? { type: "user", id: userId } : undefined,
  })
  if (rateLimit) return rateLimit

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Payload invalido." }, { status: 400 })
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Payload invalido." }, { status: 400 })
  }

  const payload = body as Record<string, unknown>
  const perfil = typeof payload.perfil === "string" ? payload.perfil.trim() : ""
  const titulo = typeof payload.titulo === "string" ? payload.titulo.trim() : ""

  if (perfil.length < 20) {
    return Response.json({ error: "Escribe primero un perfil base de al menos 20 caracteres." }, { status: 400 })
  }
  if (perfil.length > MAX_INPUT_CHARS) {
    return Response.json({ error: "El perfil es demasiado largo para mejorar con IA." }, { status: 413 })
  }

  const prompt = [
    "Reescribe el perfil profesional de un CV en español neutro/chileno.",
    "Reglas estrictas:",
    "- No inventes experiencia, años, cargos, empresas, estudios, tecnologias ni logros.",
    "- Conserva solo informacion presente en el texto original.",
    "- Maximo 70 palabras.",
    "- Tono profesional, claro, concreto y sin frases genericas como 'proactivo' o 'con ganas de aprender'.",
    "- Devuelve solo el texto final, sin comillas, listas ni explicaciones.",
    titulo ? `Titulo/cargo declarado por el usuario: ${titulo}` : "",
    `Perfil original: ${perfil}`,
  ].filter(Boolean).join("\n")

  const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 420,
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  })

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => "")
    console.error("Gemini improve-profile failed", respuesta.status, detalle)
    if (respuesta.status === 429) {
      return Response.json({ error: "Gemini no tiene cuota disponible para este proyecto/API key." }, { status: 429 })
    }
    return Response.json({ error: "No se pudo generar la mejora." }, { status: 502 })
  }

  const data = await respuesta.json() as unknown
  const texto = extraerTextoGemini(data)
  if (!texto) {
    return Response.json({ error: "Gemini no devolvio una sugerencia util." }, { status: 502 })
  }
  if (texto.length < MIN_OUTPUT_CHARS) {
    console.error("Gemini improve-profile returned short text", texto)
    return Response.json({ error: "Gemini devolvio una sugerencia incompleta. Intenta nuevamente." }, { status: 502 })
  }

  return Response.json({ texto })
}
