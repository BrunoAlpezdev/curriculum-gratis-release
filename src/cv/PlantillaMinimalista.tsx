import type { DatosCurriculum, Personalizacion, SeccionOrdenable } from "@/types"
import { getColorHex } from "@/lib/colores"
import { formatearRangoFechas, formatearFechaEducacion, formatearFecha } from "@/lib/formato"
import { etiquetasCv } from "@/lib/etiquetas-cv"
import { ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"

interface Props {
  datos: DatosCurriculum
  personalizacion: Personalizacion
}

const H2_CLASSES = "text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2.5"

export function PlantillaMinimalista({ datos, personalizacion }: Props) {
  const color = getColorHex(personalizacion.color)
  const { datosPersonales: dp } = datos
  const e = etiquetasCv(personalizacion.idiomaCv)
  const orden = personalizacion.ordenSecciones ?? ORDEN_SECCIONES_INICIAL

  const secciones: Record<SeccionOrdenable, React.ReactNode> = {
    experiencia: datos.experiencia.length > 0 && (
      <div key="experiencia" className="mb-4">
        <h2 className={H2_CLASSES}>{e.experienciaLaboral}</h2>
        <div className="flex flex-col gap-2.5">
          {datos.experiencia.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-zinc-800">{exp.cargo || e.cargo}</span>
                  <span className="text-zinc-400 mx-1.5">—</span>
                  <span className="text-zinc-500">{exp.empresa || e.empresa}</span>
                </div>
                <span className="text-[11px] text-zinc-400 shrink-0 ml-2">
                  {formatearRangoFechas(exp.fechaInicio, exp.fechaFin)}
                </span>
              </div>
              {exp.descripcion && (
                <p className="text-zinc-500 mt-0.5 whitespace-pre-line">{exp.descripcion}</p>
              )}
              {exp.logros && (
                <p className="text-zinc-600 mt-0.5 text-[11px]">{exp.logros}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    educacion: datos.educacion.length > 0 && (
      <div key="educacion" className="mb-4">
        <h2 className={H2_CLASSES}>{e.educacion}</h2>
        <div className="flex flex-col gap-2">
          {datos.educacion.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-zinc-800">{edu.titulo || e.titulo}</span>
                  <span className="text-zinc-400 mx-1.5">—</span>
                  <span className="text-zinc-500">{edu.institucion || e.institucion}</span>
                </div>
                <span className="text-[11px] text-zinc-400 shrink-0 ml-2">
                  {formatearFechaEducacion(edu.fechaInicio, edu.fechaFin)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    cursos: datos.cursos.length > 0 && (
      <div key="cursos" className="mb-4">
        <h2 className={H2_CLASSES}>{e.cursosCertificaciones}</h2>
        <div className="flex flex-col gap-1.5">
          {datos.cursos.map((curso) => (
            <div key={curso.id}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-zinc-800">
                    {curso.nombre || e.curso}
                  </span>
                  {curso.institucion && (
                    <>
                      <span className="text-zinc-400 mx-1.5">—</span>
                      <span className="text-zinc-500">{curso.institucion}</span>
                    </>
                  )}
                </div>
                {curso.fecha && (
                  <span className="text-[11px] text-zinc-400 shrink-0 ml-2">
                    {formatearFecha(curso.fecha)}
                  </span>
                )}
              </div>
              {curso.url && (
                <p className="text-[11px] text-zinc-400">{curso.url}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    proyectos: datos.proyectos.length > 0 && (
      <div key="proyectos" className="mb-4">
        <h2 className={H2_CLASSES}>{e.proyectos}</h2>
        <div className="flex flex-col gap-2">
          {datos.proyectos.map((p) => (
            <div key={p.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-zinc-800">
                  {p.nombre || e.proyecto}
                </span>
                {p.url && (
                  <span className="text-[11px] text-zinc-400 shrink-0 ml-2">
                    {p.url}
                  </span>
                )}
              </div>
              {p.tecnologias && (
                <p className="text-[11px] text-zinc-400">{p.tecnologias}</p>
              )}
              {p.descripcion && (
                <p className="text-zinc-500 mt-0.5 whitespace-pre-line">
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
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">
          {e.competencias}
        </h2>
        <div className="flex flex-wrap gap-2">
          {datos.habilidades.map((h) => (
            <span
              key={h}
              className="rounded-full border border-zinc-200 px-3 py-0.5 text-[11px] text-zinc-600"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    ),
    idiomas: datos.idiomas.length > 0 && (
      <div key="idiomas" className="mb-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">
          {e.idiomas}
        </h2>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px]">
          {datos.idiomas.map((i) => (
            <span key={i.id} className="text-zinc-600">
              {i.nombre || e.idioma} ({i.nivel})
            </span>
          ))}
        </div>
      </div>
    ),
    referencias: datos.referencias.length > 0 && (
      <div key="referencias" className="mb-4">
        <h2 className={H2_CLASSES}>{e.referencias}</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {datos.referencias.map((ref) => (
            <div key={ref.id}>
              <p className="font-semibold text-zinc-800">{ref.nombre || e.nombre}</p>
              {(ref.cargo || ref.empresa) && (
                <p className="text-zinc-500 text-[11px]">
                  {ref.cargo}
                  {ref.cargo && ref.empresa && " — "}
                  {ref.empresa}
                </p>
              )}
              {ref.relacion && (
                <p className="text-zinc-400 text-[11px]">{ref.relacion}</p>
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
      {/* Header minimalista */}
      <div className="mb-5">
        <h1 className="text-[28px] font-light text-zinc-900 tracking-tight">
          {dp.nombreCompleto || e.tuNombre}
        </h1>
        {dp.titulo && (
          <p className="text-[13px] font-medium mt-0.5" style={{ color }}>
            {dp.titulo}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[11px] text-zinc-400">
          {dp.email && <span>{dp.email}</span>}
          {dp.telefono && <span>{dp.telefono}</span>}
          {dp.ubicacion && <span>{dp.ubicacion}</span>}
          {dp.linkedin && <span>{dp.linkedin}</span>}
          {dp.github && <span>{dp.github}</span>}
          {dp.sitioWeb && <span>{dp.sitioWeb}</span>}
        </div>
        <div className="mt-3 h-px bg-zinc-200" />
      </div>

      {datos.perfil && (
        <div className="mb-4">
          <p className="text-zinc-500 whitespace-pre-line">{datos.perfil}</p>
        </div>
      )}

      {orden.map((id) => secciones[id])}

      {(datos.disponibilidad || datos.pretensionesRenta) && (
        <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500 flex flex-wrap gap-x-5 gap-y-1">
          {datos.disponibilidad && (
            <span>
              <span className="uppercase tracking-[0.15em] text-[10px] font-semibold text-zinc-400">{e.disponibilidad}:</span>{" "}
              {datos.disponibilidad}
            </span>
          )}
          {datos.pretensionesRenta && (
            <span>
              <span className="uppercase tracking-[0.15em] text-[10px] font-semibold text-zinc-400">{e.pretensionRenta}:</span>{" "}
              {datos.pretensionesRenta}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
