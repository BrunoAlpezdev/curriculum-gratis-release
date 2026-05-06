import type { DatosCurriculum, Personalizacion, PlantillaId } from "@/types"
import { PlantillaClasico } from "@/cv/PlantillaClasico"
import { PlantillaModerno } from "@/cv/PlantillaModerno"
import { PlantillaColorido } from "@/cv/PlantillaColorido"
import { PlantillaMinimalista } from "@/cv/PlantillaMinimalista"
import { FUENTE_CSS } from "@/lib/constantes"

const PLANTILLAS_MAP: Record<
  PlantillaId,
  React.ComponentType<{ datos: DatosCurriculum; personalizacion: Personalizacion }>
> = {
  clasico: PlantillaClasico,
  moderno: PlantillaModerno,
  colorido: PlantillaColorido,
  minimalista: PlantillaMinimalista,
}

/** A4 a 96 DPI */
export const A4_WIDTH_PX = 794
export const A4_HEIGHT_PX = 1123

interface Props {
  datos: DatosCurriculum
  personalizacion: Personalizacion
}

export function CurriculumVista({ datos, personalizacion }: Props) {
  const Plantilla = PLANTILLAS_MAP[personalizacion.plantilla]

  return (
    <div
      id="curriculum-pdf"
      className="bg-white flex flex-col"
      style={{
        width: A4_WIDTH_PX,
        minHeight: A4_HEIGHT_PX,
        fontFamily: FUENTE_CSS[personalizacion.fuente ?? "inter"],
      }}
    >
      <Plantilla datos={datos} personalizacion={personalizacion} />
    </div>
  )
}
