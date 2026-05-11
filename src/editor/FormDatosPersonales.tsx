"use client"

import { useRef } from "react"
import { UserIcon, CameraIcon, TrashIcon } from "@phosphor-icons/react"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { useCurriculumStore } from "@/lib/store"

const TAMANO_MAX_FOTO = 1_500_000 // 1.5 MB

export function FormDatosPersonales() {
  const datos = useCurriculumStore((s) => s.datos.datosPersonales)
  const set = useCurriculumStore((s) => s.setDatosPersonales)
  const inputFotoRef = useRef<HTMLInputElement>(null)

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    e.target.value = ""
    if (!archivo) return
    if (!archivo.type.startsWith("image/")) {
      window.alert("El archivo debe ser una imagen.")
      return
    }
    if (archivo.size > TAMANO_MAX_FOTO) {
      window.alert("La imagen es muy grande. Usa una de menos de 1.5 MB.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        set({ foto: reader.result })
      }
    }
    reader.readAsDataURL(archivo)
  }

  return (
    <SeccionFormulario
      titulo="Datos Personales"
      icono={<UserIcon size={18} />}
      tip={[
        "Pon solo ciudad y país en ubicación — la dirección completa es innecesaria y un riesgo de privacidad.",
        "El título profesional es lo primero que lee el reclutador. Sé específico: 'Desarrollador Frontend React' es mucho mejor que 'Desarrollador'.",
        "Usa un email profesional. Nada de mails de cuando tenías 15 años.",
        "LinkedIn es casi obligatorio hoy. GitHub/portafolio solo si son relevantes para el puesto — no ensucies con enlaces que no aportan.",
        "Los enlaces van sin 'https://' — se ven más limpios y ocupan menos ancho.",
        "La foto es opcional y solo sale en plantillas visuales. En USA/Canadá/UK no la pongas nunca; en Chile y Latam varía según la empresa.",
      ]}
    >
      <div className="flex items-center gap-3">
        <Surface variant="panelMuted" className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden">
          {datos.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={datos.foto} alt="Foto" className="h-full w-full object-cover" />
          ) : (
            <UserIcon size={28} className="text-text-muted" />
          )}
        </Surface>
        <div className="flex flex-col gap-1.5">
          <Text as="span" variant="caption">
            Foto (opcional, solo en plantillas visuales)
          </Text>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => inputFotoRef.current?.click()}
            >
              <CameraIcon size={14} />
              {datos.foto ? "Cambiar" : "Subir foto"}
            </Button>
            {datos.foto && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => set({ foto: "" })}
                className="text-text-muted hover:text-danger"
              >
                <TrashIcon size={14} />
                Quitar
              </Button>
            )}
          </div>
          <input
            ref={inputFotoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFoto}
          />
        </div>
      </div>
      <Input
        label="Nombre completo"
        placeholder="Camila Gavilán"
        value={datos.nombreCompleto}
        onChange={(e) => set({ nombreCompleto: e.target.value })}
      />
      <Input
        label="Titulo profesional"
        placeholder="Ingeniera de Software"
        value={datos.titulo}
        onChange={(e) => set({ titulo: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Email"
          type="email"
          placeholder="persona@example.com"
          value={datos.email}
          onChange={(e) => set({ email: e.target.value })}
        />
        <Input
          label="Telefono"
          type="tel"
          placeholder="+56 9 0000 0000"
          value={datos.telefono}
          onChange={(e) => set({ telefono: e.target.value })}
        />
      </div>
      <Input
        label="Ubicacion"
        placeholder="Santiago, Chile"
        value={datos.ubicacion}
        onChange={(e) => set({ ubicacion: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="LinkedIn"
          placeholder="linkedin.com/in/perfil-ejemplo"
          value={datos.linkedin}
          onChange={(e) => set({ linkedin: e.target.value })}
        />
        <Input
          label="GitHub"
          placeholder="github.com/usuario"
          value={datos.github}
          onChange={(e) => set({ github: e.target.value })}
        />
      </div>
      <Input
        label="Sitio web o portafolio"
        placeholder="miportafolio.cl"
        value={datos.sitioWeb}
        onChange={(e) => set({ sitioWeb: e.target.value })}
      />
    </SeccionFormulario>
  )
}
