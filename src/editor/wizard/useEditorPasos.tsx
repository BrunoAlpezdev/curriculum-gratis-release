"use client"

import {
  UserIcon,
  IdentificationCardIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  LightningIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PaletteIcon,
} from "@phosphor-icons/react"
import { useCurriculumStore } from "@/lib/store"
import { CamposDatosPersonales, CONSEJOS_DATOS_PERSONALES } from "@/editor/campos/CamposDatosPersonales"
import { CamposPerfil, CONSEJOS_PERFIL } from "@/editor/campos/CamposPerfil"
import { CamposExperiencia, CONSEJOS_EXPERIENCIA } from "@/editor/campos/CamposExperiencia"
import { CamposCarta, CONSEJOS_CARTA } from "@/editor/campos/CamposCarta"
import { CONSEJOS_EDUCACION } from "@/editor/campos/CamposEducacion"
import { CONSEJOS_HABILIDADES } from "@/editor/campos/CamposHabilidades"
import { CONSEJOS_PROYECTOS } from "@/editor/campos/CamposProyectos"
import { CONSEJOS_PERSONALIZACION } from "@/editor/campos/CamposPersonalizacion"
import {
  ContenidoFormacion,
  ContenidoAptitudes,
  ContenidoExtras,
  ContenidoDisenoCv,
  ContenidoDisenoCarta,
} from "@/editor/wizard/PasosContenido"
import type { Modo } from "@/editor/Editor"

export interface Paso {
  id: string
  titulo: string
  /** Ayuda de una sola línea bajo el título. No párrafos. */
  descripcion: string
  icono: React.ReactNode
  opcional: boolean
  consejos: string[]
  /** Si el usuario ya completó lo mínimo de este paso (para el índice). */
  completo: boolean
  /** Contenido del paso. Componente de módulo (identidad estable, sin remount). */
  Contenido?: React.ComponentType
  /** Paso final de revisión + descarga; los shells lo renderizan aparte. */
  esRevision?: boolean
}

/**
 * Fuente de verdad de los pasos del wizard. `completo` se deriva del store de
 * forma reactiva, así el índice marca el progreso solo a medida que el usuario
 * escribe — sin estado duplicado ni efectos.
 */
export function useEditorPasos(modo: Modo): Paso[] {
  const datos = useCurriculumStore((s) => s.datos)
  const cartaCuerpo = useCurriculumStore((s) => s.carta.cuerpo)

  if (modo === "carta") {
    return [
      {
        id: "diseno",
        titulo: "Diseño",
        descripcion: "Color, fuente e idioma de tu carta",
        icono: <PaletteIcon size={20} />,
        opcional: false,
        consejos: CONSEJOS_PERSONALIZACION,
        completo: true,
        Contenido: ContenidoDisenoCarta,
      },
      {
        id: "datos",
        titulo: "Tus datos",
        descripcion: "Quién eres y cómo te contactan",
        icono: <UserIcon size={20} />,
        opcional: false,
        consejos: CONSEJOS_DATOS_PERSONALES,
        completo: datos.datosPersonales.nombreCompleto.trim().length > 0,
        Contenido: CamposDatosPersonales,
      },
      {
        id: "carta",
        titulo: "Tu carta",
        descripcion: "A quién le escribes y qué le dices",
        icono: <EnvelopeIcon size={20} />,
        opcional: false,
        consejos: CONSEJOS_CARTA,
        completo: cartaCuerpo.trim().length > 0,
        Contenido: CamposCarta,
      },
      {
        id: "revision",
        titulo: "Revisar y descargar",
        descripcion: "Revisa y descarga tu carta en PDF",
        icono: <CheckCircleIcon size={20} />,
        opcional: false,
        consejos: [],
        completo: false,
        esRevision: true,
      },
    ]
  }

  return [
    {
      id: "diseno",
      titulo: "Diseño",
      descripcion: "Plantilla, color, fuente y orden de secciones",
      icono: <PaletteIcon size={20} />,
      opcional: false,
      consejos: CONSEJOS_PERSONALIZACION,
      completo: true,
      Contenido: ContenidoDisenoCv,
    },
    {
      id: "datos",
      titulo: "Tus datos",
      descripcion: "Quién eres y cómo te contactan",
      icono: <UserIcon size={20} />,
      opcional: false,
      consejos: CONSEJOS_DATOS_PERSONALES,
      completo: datos.datosPersonales.nombreCompleto.trim().length > 0,
      Contenido: CamposDatosPersonales,
    },
    {
      id: "perfil",
      titulo: "Sobre ti",
      descripcion: "Un resumen corto de tu perfil",
      icono: <IdentificationCardIcon size={20} />,
      opcional: false,
      consejos: CONSEJOS_PERFIL,
      completo: datos.perfil.trim().length > 0,
      Contenido: CamposPerfil,
    },
    {
      id: "experiencia",
      titulo: "Experiencia",
      descripcion: "Dónde has trabajado y qué lograste",
      icono: <BriefcaseIcon size={20} />,
      opcional: false,
      consejos: CONSEJOS_EXPERIENCIA,
      completo: datos.experiencia.length > 0,
      Contenido: CamposExperiencia,
    },
    {
      id: "formacion",
      titulo: "Formación",
      descripcion: "Estudios, cursos y certificaciones",
      icono: <GraduationCapIcon size={20} />,
      opcional: false,
      consejos: CONSEJOS_EDUCACION,
      completo: datos.educacion.length > 0 || datos.cursos.length > 0,
      Contenido: ContenidoFormacion,
    },
    {
      id: "aptitudes",
      titulo: "Aptitudes",
      descripcion: "Competencias e idiomas",
      icono: <LightningIcon size={20} />,
      opcional: false,
      consejos: CONSEJOS_HABILIDADES,
      completo: datos.habilidades.length > 0 || datos.idiomas.length > 0,
      Contenido: ContenidoAptitudes,
    },
    {
      id: "extras",
      titulo: "Extras",
      descripcion: "Opcional — sáltalo si no aplica",
      icono: <PlusCircleIcon size={20} />,
      opcional: true,
      consejos: CONSEJOS_PROYECTOS,
      completo: true,
      Contenido: ContenidoExtras,
    },
    {
      id: "revision",
      titulo: "Revisar y descargar",
      descripcion: "Revisa que esté todo en orden y descarga tu CV",
      icono: <CheckCircleIcon size={20} />,
      opcional: false,
      consejos: [],
      completo: false,
      esRevision: true,
    },
  ]
}
