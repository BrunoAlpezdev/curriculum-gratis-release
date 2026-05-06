"use client"

import { InfoIcon } from "@phosphor-icons/react"
import { Input } from "@/components/atoms/Input"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { useCurriculumStore } from "@/lib/store"

export function FormInfoAdicional() {
  const disponibilidad = useCurriculumStore((s) => s.datos.disponibilidad)
  const pretensiones = useCurriculumStore((s) => s.datos.pretensionesRenta)
  const setDisponibilidad = useCurriculumStore((s) => s.setDisponibilidad)
  const setPretensiones = useCurriculumStore((s) => s.setPretensionesRenta)

  return (
    <SeccionFormulario
      titulo="Informacion Adicional"
      icono={<InfoIcon size={18} />}
      defaultAbierta={false}
      tip={[
        "Ambos campos son opcionales. Déjalos en blanco si prefieres no exponerlos — no todos los cargos lo piden.",
        "Disponibilidad suele ser importante para puestos operativos y retail. Si estás sin trabajo, 'Inmediata' juega a tu favor.",
        "Pretensión de renta: si la postulación la pide explícitamente, cúmplela. Si no, ponerla de más puede quedarte caro (alta o baja).",
        "Formato: puedes poner monto líquido ('$1.800.000 liquido') o bruto, siempre deja claro cuál es.",
      ]}
    >
      <Input
        label="Disponibilidad"
        placeholder="Inmediata, 15 dias, 1 mes..."
        value={disponibilidad}
        onChange={(e) => setDisponibilidad(e.target.value)}
      />
      <Input
        label="Pretension de renta"
        placeholder="$1.800.000 liquido o Negociable"
        value={pretensiones}
        onChange={(e) => setPretensiones(e.target.value)}
      />
    </SeccionFormulario>
  )
}
