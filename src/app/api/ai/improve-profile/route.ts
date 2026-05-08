const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 10
const MAX_INPUT_CHARS = 1600

const usosPorIp = new Map<string, { count: number; resetAt: number }>()

function obtenerIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || "unknown"
}

function rateLimitOk(ip: string): boolean {
  const ahora = Date.now()
  const actual = usosPorIp.get(ip)
  if (!actual || actual.resetAt <= ahora) {
    usosPorIp.set(ip, { count: 1, resetAt: ahora + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (actual.count >= RATE_LIMIT_MAX) return false
  actual.count += 1
  return true
}

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

  const ip = obtenerIp(request)
  if (!rateLimitOk(ip)) {
    return Response.json({ error: "Demasiadas solicitudes de IA. Intenta mas tarde." }, { status: 429 })
  }

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
        maxOutputTokens: 180,
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

  return Response.json({ texto })
}
