import type { DatosCurriculum, Personalizacion, SeccionOrdenable } from "@/types"
import { getColorHex } from "@/lib/colores"
import { formatearRangoFechas, formatearFechaEducacion, formatearFecha } from "@/lib/formato"
import { etiquetasCv } from "@/lib/etiquetas-cv"
import { ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"

interface Props {
  datos: DatosCurriculum
  personalizacion: Personalizacion
}

export function PlantillaClasico({ datos, personalizacion }: Props) {
  const color = getColorHex(personalizacion.color)
  const { datosPersonales: dp } = datos
  const e = etiquetasCv(personalizacion.idiomaCv)
  const orden = personalizacion.ordenSecciones ?? ORDEN_SECCIONES_INICIAL

  const tituloClasses = "text-[12px] font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b"

  const secciones: Record<SeccionOrdenable, React.ReactNode> = {
    experiencia: datos.experiencia.length > 0 && (
      <div key="experiencia" className="mb-4">
        <h2 className={tituloClasses} style={{ color, borderColor: color }}>
          {e.experienciaLaboral}
        </h2>
        <div className="flex flex-col gap-2.5">
          {datos.experiencia.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-800">
                  {exp.cargo || e.cargo}{exp.empresa ? `, ${exp.empresa}` : ""}
                </h3>
                <span className="text-[11px] text-zinc-500 shrink-0 ml-2">
                  {formatearRangoFechas(exp.fechaInicio, exp.fechaFin)}
                </span>
              </div>
              {exp.ubicacion && (
                <p className="text-zinc-500 italic text-[11px]">{exp.ubicacion}</p>
              )}
              {exp.descripcion && (
                <p className="text-zinc-600 mt-0.5 whitespace-pre-line">{exp.descripcion}</p>
              )}
              {exp.logros && (
                <p className="text-zinc-700 mt-0.5 italic text-[11px]">{e.logros}: {exp.logros}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    educacion: datos.educacion.length > 0 && (
      <div key="educacion" className="mb-4">
        <h2 className={tituloClasses} style={{ color, borderColor: color }}>
          {e.educacion}
        </h2>
        <div className="flex flex-col gap-2">
          {datos.educacion.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-800">
                  {edu.titulo || e.titulo}{edu.institucion ? `, ${edu.institucion}` : ""}
                </h3>
                <span className="text-[11px] text-zinc-500 shrink-0 ml-2">
                  {formatearFechaEducacion(edu.fechaInicio, edu.fechaFin)}
                </span>
              </div>
              {edu.descripcion && (
                <p className="text-zinc-600 mt-0.5 text-[11px]">{edu.descripcion}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    cursos: datos.cursos.length > 0 && (
      <div key="cursos" className="mb-4">
        <h2 className={tituloClasses} style={{ color, borderColor: color }}>
          {e.cursosCertificaciones}
        </h2>
        <div className="flex flex-col gap-1.5">
          {datos.cursos.map((curso) => (
            <div key={curso.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-800">
                  {curso.nombre || e.curso}
                  {curso.institucion && (
                    <span className="font-normal text-zinc-600">
                      , {curso.institucion}
                    </span>
                  )}
                </h3>
                {curso.fecha && (
                  <span className="text-[11px] text-zinc-500 shrink-0 ml-2">
                    {formatearFecha(curso.fecha)}
                  </span>
                )}
              </div>
              {curso.url && (
                <p className="text-[11px] text-zinc-500 italic">{curso.url}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    proyectos: datos.proyectos.length > 0 && (
      <div key="proyectos" className="mb-4">
        <h2 className={tituloClasses} style={{ color, borderColor: color }}>
          {e.proyectos}
        </h2>
        <div className="flex flex-col gap-2">
          {datos.proyectos.map((p) => (
            <div key={p.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-800">
                  {p.nombre || e.proyecto}
                </h3>
                {p.url && (
                  <span className="text-[11px] text-zinc-500 italic shrink-0 ml-2">
                    {p.url}
                  </span>
                )}
              </div>
              {p.tecnologias && (
                <p className="text-[11px] text-zinc-500 italic">
                  {p.tecnologias}
                </p>
              )}
              {p.descripcion && (
                <p className="text-zinc-600 mt-0.5 whitespace-pre-line">
                  {p.descripcion}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    habilidades: datos.habilidades.length > 0 && (
      <div key="habilidades" className="mb-4">
        <h2 className={tituloClasses} style={{ color, borderColor: color }}>
          {e.competencias}
        </h2>
        <div className="flex flex-wrap gap-2">
          {datos.habilidades.map((h) => (
            <span
              key={h}
              className="rounded border border-zinc-200 px-2.5 py-0.5 text-[11px] text-zinc-700"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    ),
    idiomas: datos.idiomas.length > 0 && (
      <div key="idiomas" className="mb-4">
        <h2 className={tituloClasses} style={{ color, borderColor: color }}>
          {e.idiomas}
        </h2>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-zinc-700">
          {datos.idiomas.map((i) => (
            <span key={i.id}>
              {i.nombre || e.idioma}{" "}
              <span className="capitalize text-zinc-500">({i.nivel})</span>
            </span>
          ))}
        </div>
      </div>
    ),
    referencias: datos.referencias.length > 0 && (
      <div key="referencias" className="mb-4">
        <h2 className={tituloClasses} style={{ color, borderColor: color }}>
          {e.referencias}
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {datos.referencias.map((ref) => (
            <div key={ref.id}>
              <p className="font-bold text-zinc-800">{ref.nombre || e.nombre}</p>
              {(ref.cargo || ref.empresa) && (
                <p className="text-zinc-600 text-[11px]">
                  {ref.cargo}
                  {ref.cargo && ref.empresa && " · "}
                  {ref.empresa}
                </p>
              )}
              {ref.relacion && (
                <p className="text-zinc-500 italic text-[11px]">{ref.relacion}</p>
              )}
              <div className="flex flex-wrap gap-x-3 text-[11px] text-zinc-500">
                {ref.email && <span>{ref.email}</span>}
                {ref.telefono && <span>{ref.telefono}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  }

  return (
    <div className="px-10 py-8 flex-1 text-[12px] leading-snug">
      {/* Header centrado estilo Harvard */}
      <div className="text-center mb-4 pb-3 border-b-2" style={{ borderColor: color }}>
        <h1 className="text-[22px] font-bold text-zinc-900">
          {dp.nombreCompleto || e.tuNombre}
        </h1>
        {dp.titulo && (
          <p className="text-[13px] text-zinc-600 mt-0.5">{dp.titulo}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 mt-2 text-zinc-500 text-[11px]">
          {[dp.email, dp.telefono, dp.ubicacion, dp.linkedin, dp.github, dp.sitioWeb]
            .filter(Boolean)
            .map((valor, i, arr) => (
              <span key={i} className="flex items-center gap-3">
                <span>{valor}</span>
                {i < arr.length - 1 && <span>|</span>}
              </span>
            ))}
        </div>
      </div>

      {datos.perfil && (
        <div className="mb-4">
          <h2 className={tituloClasses} style={{ color, borderColor: color }}>
            {e.perfilProfesional}
          </h2>
          <p className="text-zinc-600 whitespace-pre-line">{datos.perfil}</p>
        </div>
      )}

      {orden.map((id) => secciones[id])}

      {(datos.disponibilidad || datos.pretensionesRenta) && (
        <div className="mt-3 pt-2 border-t border-zinc-200 text-[11px] text-zinc-600 flex flex-wrap gap-x-5 gap-y-1">
          {datos.disponibilidad && (
            <span>
              <span className="font-semibold" style={{ color }}>{e.disponibilidad}:</span>{" "}
              {datos.disponibilidad}
            </span>
          )}
          {datos.pretensionesRenta && (
            <span>
              <span className="font-semibold" style={{ color }}>{e.pretensionRenta}:</span>{" "}
              {datos.pretensionesRenta}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
