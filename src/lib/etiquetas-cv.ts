import type { IdiomaCv } from "@/types"

export interface EtiquetasCv {
  // Secciones
  perfilProfesional: string
  experienciaLaboral: string
  educacion: string
  cursosCertificaciones: string
  proyectos: string
  competencias: string
  idiomas: string
  referencias: string

  // Sub-labels
  logros: string
  disponibilidad: string
  pretensionRenta: string

  // Placeholders cuando los campos estan vacios
  tuNombre: string
  cargo: string
  empresa: string
  titulo: string
  institucion: string
  curso: string
  proyecto: string
  nombre: string
  idioma: string
}

const ES: EtiquetasCv = {
  perfilProfesional: "Perfil Profesional",
  experienciaLaboral: "Experiencia Laboral",
  educacion: "Educacion",
  cursosCertificaciones: "Cursos y Certificaciones",
  proyectos: "Proyectos",
  competencias: "Competencias",
  idiomas: "Idiomas",
  referencias: "Referencias",
  logros: "Logros",
  disponibilidad: "Disponibilidad",
  pretensionRenta: "Pretension de renta",
  tuNombre: "Tu Nombre",
  cargo: "Cargo",
  empresa: "Empresa",
  titulo: "Titulo",
  institucion: "Institucion",
  curso: "Curso",
  proyecto: "Proyecto",
  nombre: "Nombre",
  idioma: "Idioma",
}

const EN: EtiquetasCv = {
  perfilProfesional: "Professional Summary",
  experienciaLaboral: "Work Experience",
  educacion: "Education",
  cursosCertificaciones: "Courses & Certifications",
  proyectos: "Projects",
  competencias: "Skills",
  idiomas: "Languages",
  referencias: "References",
  logros: "Achievements",
  disponibilidad: "Availability",
  pretensionRenta: "Expected salary",
  tuNombre: "Your Name",
  cargo: "Role",
  empresa: "Company",
  titulo: "Title",
  institucion: "Institution",
  curso: "Course",
  proyecto: "Project",
  nombre: "Name",
  idioma: "Language",
}

export function etiquetasCv(idioma: IdiomaCv | undefined): EtiquetasCv {
  return idioma === "en" ? EN : ES
}
