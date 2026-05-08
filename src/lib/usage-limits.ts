export type UsageTier = "anonymous" | "free" | "pro"
export type UsageFeature = "aiProfile" | "aiCoverLetter" | "email"

export const USAGE_WINDOW_SECONDS = 24 * 60 * 60

export const USAGE_LIMITS: Record<UsageTier, Record<UsageFeature, number>> = {
  anonymous: {
    aiProfile: 2,
    aiCoverLetter: 1,
    email: 2,
  },
  free: {
    aiProfile: 10,
    aiCoverLetter: 5,
    email: 5,
  },
  pro: {
    aiProfile: 20,
    aiCoverLetter: 10,
    email: 20,
  },
}

export const USAGE_NAMESPACES: Record<UsageFeature, string> = {
  aiProfile: "ai:profile",
  aiCoverLetter: "ai:cover-letter",
  email: "email:send-cv",
}
