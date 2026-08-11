import type { DatosCurriculum } from "@/types"

type EstiloSeccionesDestacadas = "clasico" | "minimalista" | "moderno" | "colorido" | "ejecutivo" | "compacto"

interface Props {
  datos: DatosCurriculum
  color: string
  estilo: EstiloSeccionesDestacadas
}

const ESTILOS: Record<EstiloSeccionesDestacadas, { contenedor: string; titulo: string; lista: string }> = {
  clasico: {
    contenedor: "mb-4",
    titulo: "text-[12px] font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b",
    lista: "list-disc pl-4 text-[11px] text-zinc-700 space-y-0.5",
  },
  minimalista: {
    contenedor: "mb-4",
    titulo: "text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2.5",
    lista: "list-disc pl-4 text-[11px] text-zinc-600 space-y-0.5",
  },
  moderno: {
    contenedor: "mb-0",
    titulo: "text-[12px] font-bold uppercase tracking-wide mb-2 pb-1 border-b-2",
    lista: "list-disc pl-4 text-[11px] text-zinc-600 space-y-0.5",
  },
  colorido: {
    contenedor: "mb-0",
    titulo: "text-[12px] font-bold uppercase tracking-wide mb-2",
    lista: "list-disc pl-4 text-[11px] text-zinc-700 space-y-0.5",
  },
  ejecutivo: {
    contenedor: "mb-0",
    titulo: "text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-800 text-center mb-2.5",
    lista: "list-disc pl-4 text-[11px] text-zinc-700 space-y-0.5",
  },
  compacto: {
    contenedor: "mb-0",
    titulo: "text-[10px] font-bold uppercase tracking-[0.14em] border-b border-zinc-200 pb-1 mb-2",
    lista: "list-disc pl-4 text-[10.5px] text-zinc-700 space-y-0.5",
  },
}

export function SeccionesDestacadas({ datos, color, estilo }: Props) {
  const secciones = datos.seccionesDestacadas.filter((seccion) =>
    seccion.titulo.trim() && seccion.items.some((item) => item.trim()),
  )
  if (secciones.length === 0) return null

  const clases = ESTILOS[estilo]
  return (
    <div className="flex flex-col gap-3">
      {secciones.map((seccion) => (
        <section key={seccion.id} className={clases.contenedor}>
          <h2 className={clases.titulo} style={{ color, borderColor: color }}>
            {seccion.titulo}
          </h2>
          <ul className={clases.lista}>
            {seccion.items.filter((item) => item.trim()).map((item, index) => (
              <li key={`${seccion.id}-${index}`} className="break-words">{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
