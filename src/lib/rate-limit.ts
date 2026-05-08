import { createHash } from "node:crypto"

interface RateLimitConfig {
  namespace: string
  limit: number
  windowSeconds: number
  message: string
}

interface RedisResponse<T> {
  result?: T
  error?: string
}

const memoria = new Map<string, { count: number; resetAt: number }>()

function obtenerRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return { url: url.replace(/\/$/, ""), token }
}

function obtenerIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cloudflareIp = request.headers.get("cf-connecting-ip")
  return forwarded?.split(",")[0]?.trim() || realIp || cloudflareIp || "unknown"
}

function crearClave(namespace: string, request: Request): string {
  const ip = obtenerIp(request)
  const salt = process.env.RATE_LIMIT_SALT ?? "curriculum-gratis"
  const hash = createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32)
  return `cg:rate-limit:${namespace}:${hash}`
}

function crearHeaders(limit: number, remaining: number, resetSeconds: number): HeadersInit {
  return {
    "RateLimit-Limit": String(limit),
    "RateLimit-Remaining": String(Math.max(0, remaining)),
    "RateLimit-Reset": String(resetSeconds),
    "Retry-After": String(resetSeconds),
  }
}

function limitarEnMemoria(key: string, config: RateLimitConfig): Response | null {
  const ahora = Date.now()
  const resetAt = ahora + config.windowSeconds * 1000
  const actual = memoria.get(key)

  if (!actual || actual.resetAt <= ahora) {
    memoria.set(key, { count: 1, resetAt })
    return null
  }

  const resetSeconds = Math.max(1, Math.ceil((actual.resetAt - ahora) / 1000))
  if (actual.count >= config.limit) {
    return Response.json({ error: config.message }, { status: 429, headers: crearHeaders(config.limit, 0, resetSeconds) })
  }

  actual.count += 1
  return null
}

async function comandoRedis<T>(path: string, token: string): Promise<T | null> {
  const respuesta = await fetch(path, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  if (!respuesta.ok) return null
  const body = await respuesta.json().catch(() => null) as RedisResponse<T> | null
  if (!body || body.error) return null
  return body.result ?? null
}

export async function verificarRateLimit(request: Request, config: RateLimitConfig): Promise<Response | null> {
  const key = crearClave(config.namespace, request)
  const redis = obtenerRedisConfig()
  if (!redis) return limitarEnMemoria(key, config)

  const encodedKey = encodeURIComponent(key)
  const count = await comandoRedis<number>(`${redis.url}/incr/${encodedKey}`, redis.token)

  if (typeof count !== "number") return limitarEnMemoria(key, config)

  if (count === 1) {
    await comandoRedis<number>(`${redis.url}/expire/${encodedKey}/${config.windowSeconds}`, redis.token)
  }

  if (count > config.limit) {
    const ttl = await comandoRedis<number>(`${redis.url}/ttl/${encodedKey}`, redis.token)
    const resetSeconds = typeof ttl === "number" && ttl > 0 ? ttl : config.windowSeconds
    return Response.json(
      { error: config.message },
      { status: 429, headers: crearHeaders(config.limit, 0, resetSeconds) },
    )
  }

  return null
}
