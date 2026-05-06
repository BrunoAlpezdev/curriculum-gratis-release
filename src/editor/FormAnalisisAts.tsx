"use client"

import { useState, useMemo } from "react"
import { TargetIcon, CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Textarea } from "@/components/atoms/Textarea"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { useCurriculumStore } from "@/lib/store"
import { analizar } from "@/lib/analisis-ats"

export function FormAnalisisAts() {
  const datos = useCurriculumStore((s) => s.datos)
  const [jd, setJd] = useState("")

  const resultado = useMemo(() => analizar(jd, datos), [jd, datos])
  const porcentaje = resultado.totalClaves > 0
    ? Math.round((resultado.encontradas / resultado.totalClaves) * 100)
    : 0

  const colorPorcentaje =
    porcentaje >= 70
      ? "text-emerald-600 dark:text-emerald-400"
      : porcentaje >= 40
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400"

  return (
    <SeccionFormulario
      titulo="Analisis ATS vs Oferta"
      icono={<TargetIcon size={18} />}
      defaultAbierta={false}
      tip={[
        "Pega la descripción del puesto al que postulas. Comparamos las palabras clave con las que ya están en tu CV.",
        "Un match de 70%+ es bueno. Menos de 40% significa que el CV está mal alineado con el puesto.",
        "No rellenes tu CV con keywords solo por pasar un ATS — los reclutadores humanos detectan el relleno al instante.",
        "El análisis es 100% local, la descripción nunca sale de tu navegador.",
      ]}
    >
      <Textarea
        label="Descripcion del puesto (Job Description)"
        placeholder="Pega aqui el texto del aviso de trabajo..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows={5}
      />

      {jd.trim().length > 0 && resultado.totalClaves > 0 && (
        <div className="flex flex-col gap-3 border border-ds-line p-3 bg-ds-surface-muted">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-ds-ink-muted">
              Coincidencia con el puesto
            </span>
            <span className={`text-2xl font-bold ${colorPorcentaje}`}>
              {porcentaje}%
            </span>
          </div>
          <div className="h-1.5 bg-ds-line overflow-hidden">
            <div
              className={`h-full transition-all ${
                porcentaje >= 70
                  ? "bg-emerald-500"
                  : porcentaje >= 40
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <p className="text-xs text-ds-ink-muted">
            {resultado.encontradas} de {resultado.totalClaves} palabras clave presentes en tu CV
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
              {resultado.palabras
                .filter((p) => !p.enCv)
                .map((p) => (
                  <span
                    key={p.palabra}
                    className="inline-flex items-center gap-1 border border-red-300 bg-red-100/70 px-2 py-0.5 text-[11px] text-red-800"
                    title={`Aparece ${p.frecuencia}× en la oferta`}
                  >
                    <XCircleIcon size={12} weight="fill" />
                    {p.palabra}
                  </span>
                ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {resultado.palabras
                .filter((p) => p.enCv)
                .map((p) => (
                  <span
                    key={p.palabra}
                    className="inline-flex items-center gap-1 border border-emerald-300 bg-emerald-100/70 px-2 py-0.5 text-[11px] text-emerald-800"
                  >
                    <CheckCircleIcon size={12} weight="fill" />
                    {p.palabra}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </SeccionFormulario>
  )
}
