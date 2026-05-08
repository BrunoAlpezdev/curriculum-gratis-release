const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 8
const MAX_INPUT_CHARS = 5000

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
  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash"

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
  const resumenCv = typeof payload.resumenCv === "string" ? payload.resumenCv.trim() : ""
  const empresa = typeof payload.empresa === "string" ? payload.empresa.trim() : ""
  const cargo = typeof payload.cargo === "string" ? payload.cargo.trim() : ""
  const destinatario = typeof payload.destinatario === "string" ? payload.destinatario.trim() : ""
  const oferta = typeof payload.oferta === "string" ? payload.oferta.trim() : ""

  if (!empresa || !cargo) {
    return Response.json({ error: "Indica empresa y cargo antes de generar la carta." }, { status: 400 })
  }
  if (resumenCv.length < 80) {
    return Response.json({ error: "Completa mas datos del CV antes de generar la carta." }, { status: 400 })
  }
  if (`${resumenCv}\n${oferta}`.length > MAX_INPUT_CHARS) {
    return Response.json({ error: "El CV u oferta son demasiado largos para generar la carta." }, { status: 413 })
  }

  const prompt = [
    "Genera el cuerpo de una carta de presentacion laboral en español neutro/chileno.",
    "Reglas estrictas:",
    "- No inventes experiencia, años, estudios, empresas, tecnologias ni logros.",
    "- Usa solo informacion presente en el resumen del CV y la oferta.",
    "- 3 parrafos, maximo 220 palabras en total.",
    "- Tono profesional, directo y humano, sin exageraciones ni frases genericas.",
    "- No incluyas saludo inicial ni firma; solo el cuerpo de la carta.",
    `Empresa: ${empresa}`,
    `Cargo: ${cargo}`,
    destinatario ? `Destinatario: ${destinatario}` : "",
    `Resumen del CV: ${resumenCv}`,
    oferta ? `Oferta laboral: ${oferta}` : "",
  ].filter(Boolean).join("\n")

  const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.45,
        maxOutputTokens: 420,
      },
    }),
  })

  if (!respuesta.ok) {
    return Response.json({ error: "No se pudo generar la carta." }, { status: 502 })
  }

  const data = await respuesta.json() as unknown
  const cuerpo = extraerTextoGemini(data)
  if (!cuerpo) {
    return Response.json({ error: "Gemini no devolvio una carta util." }, { status: 502 })
  }

  return Response.json({ cuerpo })
}
