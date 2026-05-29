"use client"

import { useState } from "react"
import { LightbulbIcon, CaretDownIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { cn } from "@/components/ui/cn"

/**
 * Desplegable discreto de consejos para un paso. Parte cerrado para no ahogar en
 * texto; el usuario lo abre solo si quiere ayuda.
 */
export function Consejos({ consejos }: { consejos: string[] }) {
  const [abierto, setAbierto] = useState(false)
  if (consejos.length === 0) return null

  return (
    <div className="flex flex-col gap-0">
      <Button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        variant="plain"
        size="none"
        className="flex w-fit items-center gap-1.5 text-action-strong"
        aria-expanded={abierto}
      >
        <LightbulbIcon size={14} weight="fill" />
        <Text as="span" variant="caption" className="font-medium text-action-strong">
          Consejos
        </Text>
        <CaretDownIcon
          size={12}
          className={cn(
            "text-action-primary transition-transform duration-200",
            abierto && "rotate-180",
          )}
        />
      </Button>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
          abierto ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <Surface as="ul" variant="notice" className="mt-2 flex flex-col gap-1.5 px-3 py-2.5 shadow-none">
            {consejos.map((t) => (
              <li key={t} className="flex items-start gap-2 text-xs leading-relaxed text-text-main">
                <span className="mt-0.5 shrink-0 text-action-primary">•</span>
                {t}
              </li>
            ))}
          </Surface>
        </div>
      </div>
    </div>
  )
}
