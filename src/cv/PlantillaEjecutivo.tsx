import type { DatosCurriculum, Personalizacion, SeccionOrdenable } from "@/types"
import { getColorHex } from "@/lib/colores"
import { formatearRangoFechas, formatearFechaEducacion, formatearFecha, urlAbsoluta } from "@/lib/formato"
import { etiquetaNivelIdioma, etiquetasCv } from "@/lib/etiquetas-cv"
import { ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"
import { esTextoSimple } from "@/lib/texto-rico"
import { TextoRico } from "@/cv/TextoRico"

// Plantilla deliberadamente tipografica: sin iconos, encabezado centrado, fechas
// en un margen izquierdo y titulos de seccion entre filetes.

interface Props {
  datos: DatosCurriculum
  personalizacion: Personalizacion
}

function TituloSeccion({ children }: { children: React.ReactNode }) {
  // h2 real: generar-pdf.ts usa las posiciones de h2 para los cortes multipagina.
  return (
    <div className="flex items-center gap-3 mb-2.5">
      <div className="flex-1 h-px bg-zinc-200" />
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-800 text-center">
        {children}
      </h2>
      <div className="flex-1 h-px bg-zinc-200" />
    </div>
  )
}

export function PlantillaEjecutivo({ datos, personalizacion }: Props) {
  const color = getColorHex(personalizacion.color)
  const { datosPersonales: dp } = datos
  const e = etiquetasCv(personalizacion.idiomaCv)
  const orden = personalizacion.ordenSecciones ?? ORDEN_SECCIONES_INICIAL

  const fechaClasses = "text-[10px] uppercase tracking-wide font-medium text-right pt-0.5"

  const secciones: Record<SeccionOrdenable, React.ReactNode> = {
    experiencia: datos.experiencia.length > 0 && (
      <div key="experiencia">
        <TituloSeccion>{e.experienciaLaboral}</TituloSeccion>
        <div className="flex flex-col gap-2.5">
          {datos.experiencia.map((exp) => (
            <div key={exp.id} className="grid grid-cols-[100px_1fr] gap-x-5">
              <span className={fechaClasses} style={{ color }}>
                {formatearRangoFechas(exp.fechaInicio, exp.fechaFin, personalizacion.idiomaCv)}
              </span>
              <div>
                <h3 className="font-semibold text-zinc-900">{exp.cargo || e.cargo}</h3>
                <p className="text-zinc-500 text-[11px]">
                  {exp.empresa || e.empresa}
                  {exp.ubicacion && ` · ${exp.ubicacion}`}
                </p>
                {exp.descripcion && (
                  <TextoRico texto={exp.descripcion} className="text-zinc-600 mt-0.5" />
                )}
                {exp.logros &&
                  (esTextoSimple(exp.logros) ? (
                    <p className="mt-0.5 text-[11px] font-medium" style={{ color }}>
                      {e.logros}: {exp.logros}
                    </p>
                  ) : (
                    <div className="mt-0.5 text-[11px] font-medium" style={{ color }}>
                      <span className="font-semibold">{e.logros}:</span>
                      <TextoRico texto={exp.logros} />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    educacion: datos.educacion.length > 0 && (
      <div key="educacion">
        <TituloSeccion>{e.educacion}</TituloSeccion>
        <div className="flex flex-col gap-2">
          {datos.educacion.map((edu) => (
            <div key={edu.id} className="grid grid-cols-[100px_1fr] gap-x-5">
              <span className={fechaClasses} style={{ color }}>
                {formatearFechaEducacion(edu.fechaInicio, edu.fechaFin, personalizacion.idiomaCv)}
              </span>
              <div>
                <h3 className="font-semibold text-zinc-900">{edu.titulo || e.titulo}</h3>
                <p className="text-zinc-500 text-[11px]">{edu.institucion || e.institucion}</p>
                {edu.descripcion && (
                  <TextoRico texto={edu.descripcion} className="text-zinc-600 mt-0.5 text-[11px]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    cursos: datos.cursos.length > 0 && (
      <div key="cursos">
        <TituloSeccion>{e.cursosCertificaciones}</TituloSeccion>
        <div className="flex flex-col gap-1.5">
          {datos.cursos.map((curso) => (
            <div key={curso.id} className="grid grid-cols-[100px_1fr] gap-x-5">
              {curso.fecha ? (
                <span className={fechaClasses} style={{ color }}>
                  {formatearFecha(curso.fecha, personalizacion.idiomaCv)}
                </span>
              ) : (
                <span />
              )}
              <div>
                <h3 className="font-semibold text-zinc-900">{curso.nombre || e.curso}</h3>
                {curso.institucion && (
                  <p className="text-zinc-500 text-[11px]">{curso.institucion}</p>
                )}
                {curso.url && (
                  <p className="text-[11px] font-medium" style={{ color }}>
                    <a href={urlAbsoluta(curso.url)} target="_blank" rel="noopener noreferrer">{curso.url}</a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    proyectos: datos.proyectos.length > 0 && (
      <div key="proyectos">
        <TituloSeccion>{e.proyectos}</TituloSeccion>
        <div className="flex flex-col gap-2">
          {datos.proyectos.map((p) => (
            <div key={p.id} className="grid grid-cols-[100px_1fr] gap-x-5">
              {p.tecnologias ? (
                <span className="text-[10px] text-zinc-400 text-right pt-0.5 leading-tight">
                  {p.tecnologias}
                </span>
              ) : (
                <span />
              )}
              <div>
                <h3 className="font-semibold text-zinc-900">
                  {p.nombre || e.proyecto}
                  {p.url && (
                    <>
                      {" "}
                      <a
                        href={urlAbsoluta(p.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium"
                        style={{ color }}
                      >
                        {p.url}
                      </a>
                    </>
                  )}
                </h3>
                {p.descripcion && (
                  <TextoRico texto={p.descripcion} className="text-zinc-600 mt-0.5" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    habilidades: datos.habilidades.length > 0 && (
      <div key="habilidades">
        <TituloSeccion>{e.competencias}</TituloSeccion>
        <p className="text-center text-[11px] text-zinc-700 leading-relaxed max-w-[85%] mx-auto">
          {datos.habilidades.map((h, i) => (
            <span key={h}>
              {i > 0 && <span className="text-zinc-300 mx-1.5">·</span>}
              {h}
            </span>
          ))}
        </p>
      </div>
    ),
    idiomas: datos.idiomas.length > 0 && (
      <div key="idiomas">
        <TituloSeccion>{e.idiomas}</TituloSeccion>
        <p className="text-center text-[11px] text-zinc-700 leading-relaxed">
          {datos.idiomas.map((i, idx) => (
            <span key={i.id}>
              {idx > 0 && <span className="text-zinc-300 mx-1.5">·</span>}
              {i.nombre || e.idioma}{" "}
              <span className="text-zinc-400">({etiquetaNivelIdioma(i.nivel, personalizacion.idiomaCv)})</span>
            </span>
          ))}
        </p>
      </div>
    ),
    referencias: datos.referencias.length > 0 && (
      <div key="referencias">
        <TituloSeccion>{e.referencias}</TituloSeccion>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {datos.referencias.map((ref) => (
            <div key={ref.id}>
              <h3 className="font-semibold text-zinc-900">{ref.nombre || e.nombre}</h3>
              {(ref.cargo || ref.empresa) && (
                <p className="text-zinc-500 text-[11px]">
                  {ref.cargo}
                  {ref.cargo && ref.empresa && " · "}
                  {ref.empresa}
                </p>
              )}
              {ref.relacion && (
                <p className="text-[11px] font-medium" style={{ color }}>{ref.relacion}</p>
              )}
              <div className="flex flex-col text-[11px] text-zinc-600">
                {ref.email && <span>{ref.email}</span>}
                {ref.telefono && <span>{ref.telefono}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  }

  const contactos: { texto: string; url?: string }[] = [
    dp.email && { texto: dp.email, url: urlAbsoluta(dp.email) },
    dp.telefono && { texto: dp.telefono },
    dp.rut && { texto: `RUT ${dp.rut}` },
    dp.ubicacion && { texto: dp.ubicacion },
    dp.linkedin && { texto: dp.linkedin, url: urlAbsoluta(dp.linkedin) },
    dp.github && { texto: dp.github, url: urlAbsoluta(dp.github) },
    dp.sitioWeb && { texto: dp.sitioWeb, url: urlAbsoluta(dp.sitioWeb) },
  ].filter((c): c is { texto: string; url?: string } => Boolean(c))

  return (
    <div className="flex-1 flex flex-col text-[12px] leading-snug px-10 py-8">
      <div className="text-center mb-5">
        {dp.foto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dp.foto} alt="" className="size-20 rounded-full object-cover mx-auto mb-3 ring-1 ring-zinc-200" />
        )}
        <h1 className="text-[24px] font-semibold uppercase tracking-[0.14em] leading-tight text-zinc-900">
          {dp.nombreCompleto || e.tuNombre}
        </h1>
        <div className="w-12 h-0.5 mx-auto mt-2" style={{ backgroundColor: color }} />
        {dp.titulo && (
          <p className="text-[11px] uppercase tracking-[0.22em] mt-2" style={{ color }}>{dp.titulo}</p>
        )}
        {contactos.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 mt-3 text-[11px] text-zinc-500">
            {contactos.map((c, i) => (
              <span key={c.texto} className="flex items-center gap-2">
                {i > 0 && <span className="text-zinc-300">·</span>}
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer">{c.texto}</a>
                ) : (
                  c.texto
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {datos.perfil && (
        <div className="mb-3">
          <TituloSeccion>{e.perfilProfesional}</TituloSeccion>
          <TextoRico texto={datos.perfil} className="text-zinc-600 text-center max-w-[88%] mx-auto" />
        </div>
      )}

      <div className="flex flex-col gap-3">{orden.map((id) => secciones[id])}</div>

      {(datos.disponibilidad || datos.pretensionesRenta) && (
        <div className="mt-auto pt-3 border-t border-zinc-200 text-[11px] text-zinc-600 flex flex-wrap justify-center gap-x-6 gap-y-1">
          {datos.disponibilidad && (
            <span>
              <span className="font-semibold uppercase tracking-wide text-[10px]" style={{ color }}>{e.disponibilidad}:</span>{" "}
              {datos.disponibilidad}
            </span>
          )}
          {datos.pretensionesRenta && (
            <span>
              <span className="font-semibold uppercase tracking-wide text-[10px]" style={{ color }}>{e.pretensionRenta}:</span>{" "}
              {datos.pretensionesRenta}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
