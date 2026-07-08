import type { DatosCurriculum } from "@/types"

/**
 * Quita las entradas repetibles totalmente vacías (todos sus campos de usuario
 * en blanco) antes de renderizar o exportar el CV, para que una entrada agregada
 * y abandonada no imprima su placeholder ("Cargo", "Título"...) como si fuera
 * contenido. Las entradas parciales (con al menos un campo) se conservan.
 * `habilidades` no se toca: el store ya evita agregar vacías/duplicadas.
 */
export function sinEntradasVacias(datos: DatosCurriculum): DatosCurriculum {
  const tiene = (...valores: (string | null)[]) =>
    valores.some((v) => typeof v === "string" && v.trim() !== "")

  return {
    ...datos,
    experiencia: datos.experiencia.filter((e) =>
      tiene(e.empresa, e.cargo, e.ubicacion, e.fechaInicio, e.fechaFin, e.descripcion, e.logros),
    ),
    educacion: datos.educacion.filter((e) =>
      tiene(e.institucion, e.titulo, e.fechaInicio, e.fechaFin, e.descripcion),
    ),
    cursos: datos.cursos.filter((c) => tiene(c.nombre, c.institucion, c.fecha, c.url)),
    proyectos: datos.proyectos.filter((p) => tiene(p.nombre, p.descripcion, p.url, p.tecnologias)),
    idiomas: datos.idiomas.filter((i) => tiene(i.nombre)),
    referencias: datos.referencias.filter((r) =>
      tiene(r.nombre, r.cargo, r.empresa, r.email, r.telefono, r.relacion),
    ),
  }
}
