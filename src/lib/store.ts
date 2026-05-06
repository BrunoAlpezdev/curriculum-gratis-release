import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  DatosCurriculum,
  DatosPersonales,
  Experiencia,
  Educacion,
  Curso,
  Proyecto,
  Idioma,
  Referencia,
  Personalizacion,
  Carta,
} from "@/types"
import { DATOS_INICIALES, PERSONALIZACION_INICIAL, CARTA_INICIAL } from "@/lib/constantes"

interface CurriculumStore {
  datos: DatosCurriculum
  personalizacion: Personalizacion
  carta: Carta

  // Reemplazo completo (import/export)
  setDatos: (datos: DatosCurriculum) => void
  setCarta: (campos: Partial<Carta>) => void

  // Datos personales
  setDatosPersonales: (datos: Partial<DatosPersonales>) => void
  setPerfil: (perfil: string) => void
  setDisponibilidad: (valor: string) => void
  setPretensionesRenta: (valor: string) => void

  // Experiencia
  agregarExperiencia: () => void
  actualizarExperiencia: (id: string, datos: Partial<Experiencia>) => void
  eliminarExperiencia: (id: string) => void

  // Educacion
  agregarEducacion: () => void
  actualizarEducacion: (id: string, datos: Partial<Educacion>) => void
  eliminarEducacion: (id: string) => void

  // Cursos
  agregarCurso: () => void
  actualizarCurso: (id: string, datos: Partial<Curso>) => void
  eliminarCurso: (id: string) => void

  // Proyectos
  agregarProyecto: () => void
  actualizarProyecto: (id: string, datos: Partial<Proyecto>) => void
  eliminarProyecto: (id: string) => void

  // Habilidades
  agregarHabilidad: (nombre: string) => void
  eliminarHabilidad: (nombre: string) => void

  // Idiomas
  agregarIdioma: () => void
  actualizarIdioma: (id: string, datos: Partial<Idioma>) => void
  eliminarIdioma: (id: string) => void

  // Referencias
  agregarReferencia: () => void
  actualizarReferencia: (id: string, datos: Partial<Referencia>) => void
  eliminarReferencia: (id: string) => void

  // Personalizacion
  setPersonalizacion: (p: Partial<Personalizacion>) => void

  // Reset
  reiniciar: () => void
}

export const useCurriculumStore = create<CurriculumStore>()(
  persist(
    (set) => ({
      datos: DATOS_INICIALES,
      personalizacion: PERSONALIZACION_INICIAL,
      carta: CARTA_INICIAL,

      setDatos: (nuevos) => set({ datos: nuevos }),
      setCarta: (campos) =>
        set((s) => ({ carta: { ...s.carta, ...campos } })),

      setDatosPersonales: (nuevos) =>
        set((s) => ({
          datos: {
            ...s.datos,
            datosPersonales: { ...s.datos.datosPersonales, ...nuevos },
          },
        })),

      setPerfil: (perfil) =>
        set((s) => ({ datos: { ...s.datos, perfil } })),

      setDisponibilidad: (valor) =>
        set((s) => ({ datos: { ...s.datos, disponibilidad: valor } })),

      setPretensionesRenta: (valor) =>
        set((s) => ({ datos: { ...s.datos, pretensionesRenta: valor } })),

      agregarExperiencia: () =>
        set((s) => ({
          datos: {
            ...s.datos,
            experiencia: [
              ...s.datos.experiencia,
              {
                id: crypto.randomUUID(),
                empresa: "",
                cargo: "",
                ubicacion: "",
                fechaInicio: "",
                fechaFin: null,
                descripcion: "",
                logros: "",
              },
            ],
          },
        })),

      actualizarExperiencia: (id, nuevos) =>
        set((s) => ({
          datos: {
            ...s.datos,
            experiencia: s.datos.experiencia.map((e) =>
              e.id === id ? { ...e, ...nuevos } : e,
            ),
          },
        })),

      eliminarExperiencia: (id) =>
        set((s) => ({
          datos: {
            ...s.datos,
            experiencia: s.datos.experiencia.filter((e) => e.id !== id),
          },
        })),

      agregarEducacion: () =>
        set((s) => ({
          datos: {
            ...s.datos,
            educacion: [
              ...s.datos.educacion,
              {
                id: crypto.randomUUID(),
                institucion: "",
                titulo: "",
                fechaInicio: "",
                fechaFin: null,
                descripcion: "",
              },
            ],
          },
        })),

      actualizarEducacion: (id, nuevos) =>
        set((s) => ({
          datos: {
            ...s.datos,
            educacion: s.datos.educacion.map((e) =>
              e.id === id ? { ...e, ...nuevos } : e,
            ),
          },
        })),

      eliminarEducacion: (id) =>
        set((s) => ({
          datos: {
            ...s.datos,
            educacion: s.datos.educacion.filter((e) => e.id !== id),
          },
        })),

      agregarCurso: () =>
        set((s) => ({
          datos: {
            ...s.datos,
            cursos: [
              ...s.datos.cursos,
              {
                id: crypto.randomUUID(),
                nombre: "",
                institucion: "",
                fecha: "",
                url: "",
              },
            ],
          },
        })),

      actualizarCurso: (id, nuevos) =>
        set((s) => ({
          datos: {
            ...s.datos,
            cursos: s.datos.cursos.map((c) =>
              c.id === id ? { ...c, ...nuevos } : c,
            ),
          },
        })),

      eliminarCurso: (id) =>
        set((s) => ({
          datos: {
            ...s.datos,
            cursos: s.datos.cursos.filter((c) => c.id !== id),
          },
        })),

      agregarProyecto: () =>
        set((s) => ({
          datos: {
            ...s.datos,
            proyectos: [
              ...s.datos.proyectos,
              {
                id: crypto.randomUUID(),
                nombre: "",
                descripcion: "",
                url: "",
                tecnologias: "",
              },
            ],
          },
        })),

      actualizarProyecto: (id, nuevos) =>
        set((s) => ({
          datos: {
            ...s.datos,
            proyectos: s.datos.proyectos.map((p) =>
              p.id === id ? { ...p, ...nuevos } : p,
            ),
          },
        })),

      eliminarProyecto: (id) =>
        set((s) => ({
          datos: {
            ...s.datos,
            proyectos: s.datos.proyectos.filter((p) => p.id !== id),
          },
        })),

      agregarHabilidad: (nombre) =>
        set((s) => {
          if (s.datos.habilidades.includes(nombre)) return s
          return {
            datos: {
              ...s.datos,
              habilidades: [...s.datos.habilidades, nombre],
            },
          }
        }),

      eliminarHabilidad: (nombre) =>
        set((s) => ({
          datos: {
            ...s.datos,
            habilidades: s.datos.habilidades.filter((h) => h !== nombre),
          },
        })),

      agregarIdioma: () =>
        set((s) => ({
          datos: {
            ...s.datos,
            idiomas: [
              ...s.datos.idiomas,
              {
                id: crypto.randomUUID(),
                nombre: "",
                nivel: "basico",
              },
            ],
          },
        })),

      actualizarIdioma: (id, nuevos) =>
        set((s) => ({
          datos: {
            ...s.datos,
            idiomas: s.datos.idiomas.map((i) =>
              i.id === id ? { ...i, ...nuevos } : i,
            ),
          },
        })),

      eliminarIdioma: (id) =>
        set((s) => ({
          datos: {
            ...s.datos,
            idiomas: s.datos.idiomas.filter((i) => i.id !== id),
          },
        })),

      agregarReferencia: () =>
        set((s) => ({
          datos: {
            ...s.datos,
            referencias: [
              ...s.datos.referencias,
              {
                id: crypto.randomUUID(),
                nombre: "",
                cargo: "",
                empresa: "",
                email: "",
                telefono: "",
                relacion: "",
              },
            ],
          },
        })),

      actualizarReferencia: (id, nuevos) =>
        set((s) => ({
          datos: {
            ...s.datos,
            referencias: s.datos.referencias.map((r) =>
              r.id === id ? { ...r, ...nuevos } : r,
            ),
          },
        })),

      eliminarReferencia: (id) =>
        set((s) => ({
          datos: {
            ...s.datos,
            referencias: s.datos.referencias.filter((r) => r.id !== id),
          },
        })),

      setPersonalizacion: (p) =>
        set((s) => ({
          personalizacion: { ...s.personalizacion, ...p },
        })),

      reiniciar: () =>
        set({
          datos: DATOS_INICIALES,
          personalizacion: PERSONALIZACION_INICIAL,
          carta: CARTA_INICIAL,
        }),
    }),
    {
      name: "curriculum-gratis",
      merge: (persisted, current) => {
        const estado = persisted as Record<string, unknown> | undefined
        return {
          ...current,
          ...estado,
          datos: {
            ...DATOS_INICIALES,
            ...(estado?.datos as object),
          },
          personalizacion: {
            ...PERSONALIZACION_INICIAL,
            ...(estado?.personalizacion as object),
          },
          carta: {
            ...CARTA_INICIAL,
            ...(estado?.carta as object),
          },
        } as CurriculumStore
      },
    },
  ),
)
