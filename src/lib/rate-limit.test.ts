import { describe, it, expect, beforeEach } from "vitest"
import { verificarRateLimit, obtenerRateLimitStatus } from "@/lib/rate-limit"

/* Estos tests ejercitan el fallback en memoria: sin Redis configurado,
   verificarRateLimit debe permitir `limit` peticiones y bloquear el resto.
   Cada test usa una identidad/namespace unicos para no compartir estado con
   el Map de modulo. */

function pedir(): Request {
  return new Request("http://localhost/api/x", { method: "POST" })
}

beforeEach(() => {
  // Aseguramos la ruta en memoria, sin Redis.
  delete process.env.UPSTASH_REDIS_REST_URL
  delete process.env.UPSTASH_REDIS_REST_TOKEN
  delete process.env.KV_REST_API_URL
  delete process.env.KV_REST_API_TOKEN
})

describe("verificarRateLimit (memoria)", () => {
  it("permite hasta el limite y luego responde 429", async () => {
    const config = {
      namespace: "test:permitir",
      limit: 3,
      windowSeconds: 60,
      message: "limite alcanzado",
      identity: { type: "user" as const, id: "user-a" },
    }

    expect(await verificarRateLimit(pedir(), config)).toBeNull()
    expect(await verificarRateLimit(pedir(), config)).toBeNull()
    expect(await verificarRateLimit(pedir(), config)).toBeNull()

    const bloqueado = await verificarRateLimit(pedir(), config)
    expect(bloqueado).not.toBeNull()
    expect(bloqueado!.status).toBe(429)
    const body = await bloqueado!.json() as { error: string }
    expect(body.error).toBe("limite alcanzado")
  })

  it("aisla el conteo por identidad", async () => {
    const base = {
      namespace: "test:aislar",
      limit: 1,
      windowSeconds: 60,
      message: "no",
    }
    expect(await verificarRateLimit(pedir(), { ...base, identity: { type: "user", id: "u1" } })).toBeNull()
    // u1 ya gasto su unico uso
    expect(await verificarRateLimit(pedir(), { ...base, identity: { type: "user", id: "u1" } })).not.toBeNull()
    // u2 es independiente y aun tiene cupo
    expect(await verificarRateLimit(pedir(), { ...base, identity: { type: "user", id: "u2" } })).toBeNull()
  })

  it("expone headers de rate limit al bloquear", async () => {
    const config = {
      namespace: "test:headers",
      limit: 1,
      windowSeconds: 120,
      message: "stop",
      identity: { type: "user" as const, id: "user-h" },
    }
    await verificarRateLimit(pedir(), config)
    const bloqueado = await verificarRateLimit(pedir(), config)
    expect(bloqueado!.headers.get("RateLimit-Limit")).toBe("1")
    expect(bloqueado!.headers.get("Retry-After")).toBeTruthy()
  })
})

describe("obtenerRateLimitStatus (memoria)", () => {
  it("refleja el uso acumulado sin incrementarlo", async () => {
    const config = {
      namespace: "test:status",
      limit: 5,
      windowSeconds: 60,
      message: "",
      identity: { type: "user" as const, id: "user-s" },
    }
    await verificarRateLimit(pedir(), config)
    await verificarRateLimit(pedir(), config)

    const status = await obtenerRateLimitStatus(pedir(), config)
    expect(status.limit).toBe(5)
    expect(status.used).toBe(2)
    expect(status.remaining).toBe(3)

    // consultar el status no debe consumir cupo
    const status2 = await obtenerRateLimitStatus(pedir(), config)
    expect(status2.used).toBe(2)
  })
})
