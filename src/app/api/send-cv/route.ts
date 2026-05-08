import { auth } from "@clerk/nextjs/server"
import { verificarRateLimit } from "@/lib/rate-limit"

const RESEND_API_URL = "https://api.resend.com/emails"
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024
const RATE_LIMIT_ANONIMO = 2
const RATE_LIMIT_FREE = 5
const RATE_LIMIT_WINDOW_SECONDS = 24 * 60 * 60

function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? "Curriculum Gratis <no-reply@curriculum-gratis.cl>"

  if (!apiKey) {
    return Response.json({ error: "Envio de correo no configurado." }, { status: 503 })
  }

  const { userId } = await auth()
  const rateLimit = await verificarRateLimit(request, {
    namespace: "email:send-cv",
    limit: userId ? RATE_LIMIT_FREE : RATE_LIMIT_ANONIMO,
    windowSeconds: RATE_LIMIT_WINDOW_SECONDS,
    message: userId
      ? "Alcanzaste tu limite diario de envios por correo. Intenta nuevamente manana."
      : "Alcanzaste el limite anonimo de envios. Inicia sesion gratis para mas envios diarios.",
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
  const email = typeof payload.email === "string" ? payload.email.trim() : ""
  const nombreArchivo = typeof payload.nombreArchivo === "string" ? payload.nombreArchivo : "curriculum.pdf"
  const pdfBase64 = typeof payload.pdfBase64 === "string" ? payload.pdfBase64 : ""
  const nombre = typeof payload.nombre === "string" ? payload.nombre.trim() : ""

  if (!emailValido(email)) {
    return Response.json({ error: "Email invalido." }, { status: 400 })
  }
  if (!pdfBase64) {
    return Response.json({ error: "Falta el PDF adjunto." }, { status: 400 })
  }

  const sizeBytes = Math.ceil((pdfBase64.length * 3) / 4)
  if (sizeBytes > MAX_ATTACHMENT_BYTES) {
    return Response.json({ error: "El PDF es demasiado pesado para enviarlo por correo." }, { status: 413 })
  }

  const resendResponse = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Tu CV generado en Curriculum Gratis",
      text: `Hola${nombre ? ` ${nombre}` : ""},\n\nAdjuntamos tu CV generado en Curriculum Gratis.\n\nRecuerda revisarlo antes de enviarlo a una postulacion.`,
      attachments: [
        {
          filename: nombreArchivo,
          content: pdfBase64,
        },
      ],
    }),
  })

  if (!resendResponse.ok) {
    return Response.json({ error: "No se pudo enviar el correo." }, { status: 502 })
  }

  return Response.json({ ok: true })
}
