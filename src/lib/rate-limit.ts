import { createHash } from "node:crypto"

interface RateLimitConfig {
  namespace: string
  limit: number
  windowSeconds: number
  message: string
  identity?: {
    type: "user" | "ip"
    id: string
  }
}

export interface RateLimitStatus {
  limit: number
  used: number
  remaining: number
  resetAt: string
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

function crearClave(namespace: string, request: Request, identity?: RateLimitConfig["identity"]): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "curriculum-gratis"
  if (identity?.type === "user") {
    const hash = createHash("sha256").update(`${salt}:user:${identity.id}`).digest("hex").slice(0, 32)
    return `cg:rate-limit:${namespace}:user:${hash}`
  }

  const ip = identity?.type === "ip" ? identity.id : obtenerIp(request)
  const hash = createHash("sha256").update(`${salt}:ip:${ip}`).digest("hex").slice(0, 32)
  return `cg:rate-limit:${namespace}:ip:${hash}`
}

function crearHeaders(limit: number, remaining: number, resetSeconds: number): HeadersInit {
  return {
    "RateLimit-Limit": String(limit),
    "RateLimit-Remaining": String(Math.max(0, remaining)),
    "RateLimit-Reset": String(resetSeconds),
    "Retry-After": String(resetSeconds),
  }
}

function crearStatus(limit: number, used: number, resetSeconds: number): RateLimitStatus {
  return {
    limit,
    used: Math.max(0, used),
    remaining: Math.max(0, limit - used),
    resetAt: new Date(Date.now() + resetSeconds * 1000).toISOString(),
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

export async function obtenerRateLimitStatus(request: Request, config: RateLimitConfig): Promise<RateLimitStatus> {
  const key = crearClave(config.namespace, request, config.identity)
  const redis = obtenerRedisConfig()
  if (!redis) {
    const actual = memoria.get(key)
    if (!actual || actual.resetAt <= Date.now()) return crearStatus(config.limit, 0, config.windowSeconds)
    return crearStatus(config.limit, actual.count, Math.max(1, Math.ceil((actual.resetAt - Date.now()) / 1000)))
  }

  const encodedKey = encodeURIComponent(key)
  const [rawCount, ttl] = await Promise.all([
    comandoRedis<string | number>(`${redis.url}/get/${encodedKey}`, redis.token),
    comandoRedis<number>(`${redis.url}/ttl/${encodedKey}`, redis.token),
  ])
  const count = typeof rawCount === "number" ? rawCount : Number(rawCount ?? 0)
  const used = Number.isFinite(count) ? count : 0
  const resetSeconds = typeof ttl === "number" && ttl > 0 ? ttl : config.windowSeconds

  return crearStatus(config.limit, used, resetSeconds)
}

export async function verificarRateLimit(request: Request, config: RateLimitConfig): Promise<Response | null> {
  const key = crearClave(config.namespace, request, config.identity)
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
