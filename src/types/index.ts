// --- Datos del curriculum ---

export interface DatosPersonales {
  nombreCompleto: string
  titulo: string
  email: string
  telefono: string
  ubicacion: string
  linkedin: string
  github: string
  sitioWeb: string
  foto: string
}

export interface Experiencia {
  id: string
  empresa: string
  cargo: string
  ubicacion: string
  fechaInicio: string
  fechaFin: string | null
  descripcion: string
  logros: string
}

export interface Educacion {
  id: string
  institucion: string
  titulo: string
  fechaInicio: string
  fechaFin: string | null
  descripcion: string
}

export interface Curso {
  id: string
  nombre: string
  institucion: string
  fecha: string
  url: string
}

export interface Proyecto {
  id: string
  nombre: string
  descripcion: string
  url: string
  tecnologias: string
}

export type NivelIdioma = "basico" | "intermedio" | "avanzado" | "nativo"

export interface Idioma {
  id: string
  nombre: string
  nivel: NivelIdioma
}

export interface Referencia {
  id: string
  nombre: string
  cargo: string
  empresa: string
  email: string
  telefono: string
  relacion: string
}

export interface DatosCurriculum {
  datosPersonales: DatosPersonales
  perfil: string
  experiencia: Experiencia[]
  educacion: Educacion[]
  cursos: Curso[]
  proyectos: Proyecto[]
  habilidades: string[]
  idiomas: Idioma[]
  referencias: Referencia[]
  disponibilidad: string
  pretensionesRenta: string
}

// --- Personalizacion visual ---

export type ColorTema =
  | "azul"
  | "verde"
  | "rojo"
  | "morado"
  | "teal"
  | "naranja"
  | "gris"

export type PlantillaId = "clasico" | "moderno" | "colorido" | "minimalista"

export type FuenteId = "inter" | "roboto" | "lato" | "merriweather" | "libre-baskerville"

export type IdiomaCv = "es" | "en"

export interface Carta {
  destinatario: string
  empresaDestino: string
  cargoPostulado: string
  ciudadFecha: string
  cuerpo: string
  despedida: string
}

export type SeccionOrdenable =
  | "experiencia"
  | "educacion"
  | "cursos"
  | "proyectos"
  | "habilidades"
  | "idiomas"
  | "referencias"

export interface Personalizacion {
  color: ColorTema
  plantilla: PlantillaId
  fuente: FuenteId
  idiomaCv: IdiomaCv
  ordenSecciones: SeccionOrdenable[]
}
