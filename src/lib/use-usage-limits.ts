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

export function useUsageLimits() {
  const [usage, setUsage] = useState<UsageResponse | null>(null)

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/usage", { cache: "no-store" })
      if (!response.ok) return
      const body = await response.json() as UsageResponse
      setUsage(body)
    } catch {
      // Usage counters are informative; never block the editor if they fail.
    }
  }, [])

  useEffect(() => {
    let cancelado = false

    async function cargar() {
      try {
        const response = await fetch("/api/usage", { cache: "no-store" })
        if (!response.ok || cancelado) return
        const body = await response.json() as UsageResponse
        if (!cancelado) setUsage(body)
      } catch {
        // Usage counters are informative; never block the editor if they fail.
      }
    }

    void cargar()
    return () => {
      cancelado = true
    }
  }, [])

  return { usage, refresh }
}
