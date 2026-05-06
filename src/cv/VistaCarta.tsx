import type { Carta, DatosCurriculum, Personalizacion } from "@/types"
import { getColorHex } from "@/lib/colores"
import { FUENTE_CSS } from "@/lib/constantes"
import { A4_WIDTH_PX, A4_HEIGHT_PX } from "@/cv/CurriculumVista"

interface Props {
  datos: DatosCurriculum
  carta: Carta
  personalizacion: Personalizacion
}

export function VistaCarta({ datos, carta, personalizacion }: Props) {
  const color = getColorHex(personalizacion.color)
  const { datosPersonales: dp } = datos

  return (
    <div
      id="carta-pdf"
      className="bg-white flex flex-col px-14 py-14 text-[12px] leading-relaxed"
      style={{
        width: A4_WIDTH_PX,
        minHeight: A4_HEIGHT_PX,
        fontFamily: FUENTE_CSS[personalizacion.fuente ?? "inter"],
      }}
    >
      {/* Header con datos del remitente */}
      <div className="mb-8 pb-4 border-b" style={{ borderColor: color }}>
        <h1 className="text-[18px] font-bold text-zinc-900">
          {dp.nombreCompleto || "Tu Nombre"}
        </h1>
        {dp.titulo && (
          <p className="text-[12px] text-zinc-600">{dp.titulo}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-[11px] text-zinc-500">
          {dp.email && <span>{dp.email}</span>}
          {dp.telefono && <span>{dp.telefono}</span>}
          {dp.ubicacion && <span>{dp.ubicacion}</span>}
          {dp.linkedin && <span>{dp.linkedin}</span>}
        </div>
      </div>

      {/* Ciudad y fecha */}
      {carta.ciudadFecha && (
        <p className="text-right text-zinc-600 mb-5">{carta.ciudadFecha}</p>
      )}

      {/* Destinatario */}
      {(carta.destinatario || carta.empresaDestino || carta.cargoPostulado) && (
        <div className="mb-5 text-zinc-700">
          {carta.destinatario && <p className="font-semibold">{carta.destinatario}</p>}
          {carta.empresaDestino && <p>{carta.empresaDestino}</p>}
          {carta.cargoPostulado && (
            <p className="text-zinc-500 text-[11px] italic mt-0.5">
              Postulacion: {carta.cargoPostulado}
            </p>
          )}
        </div>
      )}

      {/* Cuerpo */}
      {carta.cuerpo ? (
        <div className="flex-1 text-zinc-700 whitespace-pre-line">{carta.cuerpo}</div>
      ) : (
        <div className="flex-1 text-zinc-300 italic">
          Escribe el cuerpo de tu carta en el formulario...
        </div>
      )}

      {/* Despedida + firma */}
      <div className="mt-8 text-zinc-700">
        {carta.despedida && <p>{carta.despedida}</p>}
        <p className="mt-8 font-bold text-zinc-900">
          {dp.nombreCompleto || "Tu Nombre"}
        </p>
      </div>
    </div>
  )
}
