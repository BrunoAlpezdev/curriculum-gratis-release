"use client"

import { useCallback, useEffect, useState } from "react"
import type { UsageFeature, UsageTier } from "@/lib/usage-limits"

export interface UsageCounter {
  limit: number
  used: number
  remaining: number
  resetAt: string
}

export interface UsageResponse {
  tier: UsageTier
  limits: Record<UsageFeature, UsageCounter>
}

// Los contadores de uso son informativos: si fallan nunca deben bloquear el editor.
async function fetchUsage(): Promise<UsageResponse | null> {
  try {
    const response = await fetch("/api/usage", { cache: "no-store" })
    if (!response.ok) return null
    return await response.json() as UsageResponse
  } catch {
    return null
  }
}

export function useUsageLimits() {
  const [usage, setUsage] = useState<UsageResponse | null>(null)

  const refresh = useCallback(async () => {
    const body = await fetchUsage()
    if (body) setUsage(body)
  }, [])

  useEffect(() => {
    let cancelado = false
    void fetchUsage().then((body) => {
      if (body && !cancelado) setUsage(body)
    })
    return () => {
      cancelado = true
    }
  }, [])

  return { usage, refresh }
}
