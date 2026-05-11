import type { ReactNode } from "react"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"

interface MarketingValueCardProps {
  icon: ReactNode
  title: string
  text: string
}

export function MarketingValueCard({ icon, title, text }: MarketingValueCardProps) {
  return (
    <Surface variant="metricCard" className="p-3">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center bg-action-primary text-action-primary-fg">
          {icon}
        </span>
        <div className="min-w-0">
          <Text as="h3" variant="strong" className="text-sm font-extrabold">
            {title}
          </Text>
          <Text variant="caption" className="mt-1 leading-relaxed">
            {text}
          </Text>
        </div>
      </div>
    </Surface>
  )
}
