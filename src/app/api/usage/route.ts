import { auth } from "@clerk/nextjs/server"
import { obtenerRateLimitStatus } from "@/lib/rate-limit"
import { USAGE_LIMITS, USAGE_NAMESPACES, USAGE_WINDOW_SECONDS, type UsageFeature, type UsageTier } from "@/lib/usage-limits"

const FEATURES: UsageFeature[] = ["aiProfile", "aiCoverLetter", "email"]

export async function GET(request: Request) {
  const { userId } = await auth()
  const tier: UsageTier = userId ? "free" : "anonymous"
  const identity = userId ? { type: "user" as const, id: userId } : undefined

  const entries = await Promise.all(FEATURES.map(async (feature) => {
    const status = await obtenerRateLimitStatus(request, {
      namespace: USAGE_NAMESPACES[feature],
      limit: USAGE_LIMITS[tier][feature],
      windowSeconds: USAGE_WINDOW_SECONDS,
      message: "",
      identity,
    })
    return [feature, status] as const
  }))

  return Response.json({
    tier,
    limits: Object.fromEntries(entries),
  })
}
