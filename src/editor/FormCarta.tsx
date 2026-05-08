"use client"

import { useState } from "react"
import { EnvelopeIcon, SparkleIcon, SpinnerIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { Textarea } from "@/components/atoms/Textarea"
import { AiSuggestionPanel } from "@/components/molecules/AiSuggestionPanel"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { textoCv } from "@/lib/analisis-ats"
import { guardarCopiaLocal } from "@/lib/copias-locales"
import { useCurriculumStore } from "@/lib/store"
import { useUsageLimits } from "@/lib/use-usage-limits"

const PLANTILLAS_CUERPO = [
  {
    nombre: "Postulacion directa",
    texto: `Estimado/a [Destinatario]:

Me dirijo a usted con el objetivo de postular al cargo de [Cargo] en [Empresa], posicion que me interesa profundamente por su alineacion con mi trayectoria profesional y objetivos de desarrollo.

A lo largo de mi experiencia he desarrollado [breve resumen de fortalezas clave]. Considero que podria aportar valor al equipo de [Empresa] gracias a [razon especifica y concreta].

Quedo atento/a a la posibilidad de coordinar una entrevista en la que pueda ampliar la informacion de mi CV y conocer mas sobre el rol.`,
  },
  {
    nombre: "Cambio de rubro",
    texto: `Estimado/a [Destinatario]:

Escribo para postular al cargo de [Cargo] en [Empresa]. Aunque mi experiencia previa se ha desarrollado en un ambito distinto, he estado capacitandome activamente para dar el paso a [area objetivo], y considero que las habilidades transversales que traigo pueden aportar una perspectiva fresca al equipo.

En particular, [menciona 1-2 experiencias puntuales que respalden el cambio]. Estoy convencido/a de que la combinacion de mi background y mi entusiasmo por aprender seria un buen complemento para el equipo.

Agradezco la oportunidad de ser considerado/a y quedo disponible para una conversacion.`,
  },
  {
    nombre: "Primer empleo",
    texto: `Estimado/a [Destinatario]:

Me presento como postulante al cargo de [Cargo] en [Empresa]. Aunque me encuentro iniciando mi carrera profesional, mi formacion en [Carrera/Titulo] y los proyectos desarrollados durante mi proceso educativo me han permitido adquirir las bases tecnicas y la actitud necesaria para aportar desde el primer dia.

Destaco de mi perfil [cualidades clave: responsabilidad, capacidad de aprendizaje, trabajo en equipo]. Tengo gran interes en sumarme a [Empresa] por [razon concreta] y aprovechar la oportunidad para crecer junto a un equipo con experiencia.

Agradezco de antemano su consideracion.`,
  },
]

export function FormCarta() {
  const datos = useCurriculumStore((s) => s.datos)
  const personalizacion = useCurriculumStore((s) => s.personalizacion)
  const carta = useCurriculumStore((s) => s.carta)
  const set = useCurriculumStore((s) => s.setCarta)
  const { usage, refresh: refreshUsage } = useUsageLimits()
  const [oferta, setOferta] = useState("")
  const [generando, setGenerando] = useState(false)
  const [sugerencia, setSugerencia] = useState("")
  const [error, setError] = useState("")

  async function generarCarta() {
    setGenerando(true)
    setSugerencia("")
    setError("")
    try {
      const respuesta = await fetch("/api/ai/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumenCv: textoCv(datos),
          empresa: carta.empresaDestino,
          cargo: carta.cargoPostulado,
          destinatario: carta.destinatario,
          oferta,
        }),
      })
      const body = await respuesta.json().catch(() => ({})) as { cuerpo?: string; error?: string }
      if (!respuesta.ok) throw new Error(body.error ?? "No se pudo generar la carta.")
      setSugerencia(body.cuerpo ?? "")
      void refreshUsage()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo generar la carta.")
    } finally {
      setGenerando(false)
    }
  }

  function aplicarSugerencia() {
    guardarCopiaLocal("Respaldo antes de aplicar IA en carta", datos, personalizacion, carta)
    set({ cuerpo: sugerencia })
    setSugerencia("")
  }

  return (
    <SeccionFormulario
      titulo="Carta de Presentacion"
      icono={<EnvelopeIcon size={18} />}
      tip={[
        "Corta, concreta y personalizada. 3 parrafos es lo ideal — si no lees tu carta completa sin distraerte, el reclutador tampoco lo hara.",
        "Siempre menciona la empresa y el cargo explicitamente. Una carta genérica se nota y resta puntos.",
        "No repitas tu CV. La carta es para contar el 'por qué yo' y 'por qué ustedes', no para listar logros.",
        "Destinatario: si conoces el nombre (Sra./Sr. Apellido), mejor que un 'A quien corresponda'.",
      ]}
    >
      <Input
        label="Destinatario"
          placeholder="Nombre del destinatario o 'A quien corresponda'"
        value={carta.destinatario}
        onChange={(e) => set({ destinatario: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Empresa"
          placeholder="Empresa S.A."
          value={carta.empresaDestino}
          onChange={(e) => set({ empresaDestino: e.target.value })}
        />
        <Input
          label="Cargo al que postula"
          placeholder="Analista de datos"
          value={carta.cargoPostulado}
          onChange={(e) => set({ cargoPostulado: e.target.value })}
        />
      </div>
      <Input
        label="Ciudad y fecha"
        placeholder="Santiago, 22 de abril de 2026"
        value={carta.ciudadFecha}
        onChange={(e) => set({ ciudadFecha: e.target.value })}
      />

      <div className="flex flex-col gap-1.5">
        <Text as="label" variant="label">
          Plantillas de cuerpo
        </Text>
        <div className="flex flex-wrap gap-2">
          {PLANTILLAS_CUERPO.map((p) => (
            <Button
              key={p.nombre}
              type="button"
              onClick={() => set({ cuerpo: p.texto })}
              variant="secondary"
              size="xs"
            >
              {p.nombre}
            </Button>
          ))}
        </div>
      </div>

      <Textarea
        label="Oferta laboral para IA (opcional)"
        placeholder="Pega aqui la descripcion del cargo para personalizar la carta..."
        value={oferta}
        onChange={(e) => setOferta(e.target.value)}
        rows={4}
      />

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={generarCarta}
          disabled={generando || !carta.empresaDestino.trim() || !carta.cargoPostulado.trim()}
          className="w-fit"
        >
          {generando ? <SpinnerIcon size={16} className="animate-spin" /> : <SparkleIcon size={16} />}
          {generando ? "Generando..." : "Generar cuerpo con IA"}
        </Button>
        <Text variant="caption">
          Opcional: envia datos resumidos de tu CV y la oferta a Gemini. Antes de aplicar una sugerencia se guarda una copia local.
        </Text>
        {usage && (
          <Text variant="caption" className="font-semibold text-action-strong">
            {usage.limits.aiCoverLetter.remaining > 0
              ? `Te quedan ${usage.limits.aiCoverLetter.remaining} de ${usage.limits.aiCoverLetter.limit} cartas con IA hoy${usage.tier === "free" ? " en tu cuenta Free" : " sin cuenta"}.`
              : usage.tier === "anonymous"
                ? "Se acabaron tus cartas con IA sin cuenta. Inicia sesion gratis para mas usos hoy."
                : "Alcanzaste tu limite diario Free de cartas con IA. Vuelve manana."}
          </Text>
        )}
      </div>

      {error && (
        <Surface variant="panelMuted" className="border-danger-line bg-danger-soft px-3 py-2">
          <Text variant="small" className="text-danger-text">
            {error}
          </Text>
        </Surface>
      )}

      {sugerencia && (
        <AiSuggestionPanel
          title="Carta sugerida"
          text={sugerencia}
          applyLabel="Usar sugerencia"
          onApply={aplicarSugerencia}
          onRegenerate={generarCarta}
          onDismiss={() => setSugerencia("")}
          loading={generando}
          multiline
        />
      )}

      <Textarea
        label="Cuerpo de la carta"
        placeholder="Escribe el contenido de tu carta..."
        value={carta.cuerpo}
        onChange={(e) => set({ cuerpo: e.target.value })}
        rows={12}
      />

      <Input
        label="Despedida"
        placeholder="Atentamente,"
        value={carta.despedida}
        onChange={(e) => set({ despedida: e.target.value })}
      />
    </SeccionFormulario>
  )
}
