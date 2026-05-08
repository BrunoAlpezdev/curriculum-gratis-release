"use client"

import { useMemo } from "react"
import { CheckCircleIcon, ListChecksIcon, WarningIcon, XCircleIcon } from "@phosphor-icons/react"
import { Badge } from "@/components/atoms/Badge"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { analizarCalidadCv, type NivelRevision } from "@/lib/calidad-cv"
import { useCurriculumStore } from "@/lib/store"

const ESTILO_NIVEL: Record<
  NivelRevision,
  {
    etiqueta: string
    badge: "success" | "danger" | "neutral"
    icono: React.ReactNode
    borde: string
  }
> = {
  ok: {
    etiqueta: "Listo",
    badge: "success",
    icono: <CheckCircleIcon size={16} weight="fill" />,
    borde: "border-success-line bg-success-soft/45",
  },
  advertencia: {
    etiqueta: "Mejorar",
    badge: "neutral",
    icono: <WarningIcon size={16} weight="fill" />,
    borde: "border-border-subtle bg-panel-muted",
  },
  error: {
    etiqueta: "Urgente",
    badge: "danger",
    icono: <XCircleIcon size={16} weight="fill" />,
    borde: "border-danger-line bg-danger-soft/45",
  },
}

function mensajePuntaje(puntaje: number): string {
  if (puntaje >= 80) return "Tu CV esta bien encaminado. Quedan ajustes finos antes de descargar."
  if (puntaje >= 50) return "Tu CV tiene una base util, pero todavia hay mejoras importantes."
  return "Completa los puntos urgentes antes de usar este CV para postular."
}

export function FormCalidadCv() {
  const datos = useCurriculumStore((s) => s.datos)
  const resultado = useMemo(() => analizarCalidadCv(datos), [datos])
  const pendientes = resultado.revisiones.filter((revision) => revision.nivel !== "ok")
  const urgentes = resultado.revisiones.filter((revision) => revision.nivel === "error").length

  return (
    <SeccionFormulario
      titulo="Checklist de calidad"
      icono={<ListChecksIcon size={18} />}
      tip={[
        "Este checklist corre 100% en tu navegador. No envia datos a servidores ni usa IA.",
        "Primero resuelve los puntos urgentes. Luego trabaja las mejoras para subir la calidad general.",
        "No agregues informacion falsa solo para completar el checklist. Es mejor un CV honesto y enfocado.",
      ]}
    >
      <Surface variant="panelMuted" className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Text as="p" variant="label">
              Puntaje estimado
            </Text>
            <Text as="p" variant="strong" className="mt-1 text-3xl font-extrabold text-action-strong">
              {resultado.puntaje}%
            </Text>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={urgentes > 0 ? "danger" : "success"}>
              {urgentes > 0 ? `${urgentes} urgente${urgentes === 1 ? "" : "s"}` : "Sin urgentes"}
            </Badge>
            <Text as="span" variant="caption">
              {resultado.completadas}/{resultado.total} puntos listos
            </Text>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden bg-border-subtle">
          <div
            className="h-full bg-action-primary transition-all"
            style={{ width: `${resultado.puntaje}%` }}
          />
        </div>
        <Text variant="small" className="mt-3 leading-relaxed">
          {mensajePuntaje(resultado.puntaje)}
        </Text>
      </Surface>

      <div className="flex flex-col gap-2">
        {resultado.revisiones.map((revision) => {
          const estilo = ESTILO_NIVEL[revision.nivel]
          return (
            <div
              key={revision.id}
              className={`flex items-start gap-2 border px-3 py-2.5 ${estilo.borde}`}
            >
              <span className="mt-0.5 shrink-0 text-text-muted">{estilo.icono}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Text as="p" variant="strong" className="text-sm">
                    {revision.titulo}
                  </Text>
                  <Badge variant={estilo.badge}>{estilo.etiqueta}</Badge>
                </div>
                <Text variant="caption" className="mt-1 leading-relaxed">
                  {revision.descripcion}
                </Text>
              </div>
            </div>
          )
        })}
      </div>

      {pendientes.length === 0 && (
        <Surface variant="notice" className="px-3 py-2">
          <Text variant="small" className="font-semibold text-action-strong">
            Buen trabajo. Tu CV cumple todos los puntos del checklist local.
          </Text>
        </Surface>
      )}
    </SeccionFormulario>
  )
}
