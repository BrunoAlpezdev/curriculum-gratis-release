import type { DatosCurriculum, Personalizacion, SeccionOrdenable } from "@/types"
import { getColorHex } from "@/lib/colores"
import { formatearRangoFechas, formatearFechaEducacion, formatearFecha, urlAbsoluta } from "@/lib/formato"
import { etiquetaNivelIdioma, etiquetasCv } from "@/lib/etiquetas-cv"
import { ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"
import { TextoRico } from "@/cv/TextoRico"
import { SeccionesDestacadas } from "@/cv/SeccionesDestacadas"

interface Props {
  datos: DatosCurriculum
  personalizacion: Personalizacion
}

function TituloSeccion({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h2
      className="mb-2 border-b border-zinc-200 pb-1 text-[11px] font-bold uppercase tracking-[0.16em]"
      style={{ color, borderColor: color }}
    >
      {children}
    </h2>
  )
}

function ItemConFecha({ titulo, fecha, children }: { titulo: string; fecha?: string; children?: React.ReactNode }) {
  return (
    <article className="flex flex-col gap-0.5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4">
        <h3 className="min-w-0 break-words font-bold text-zinc-900">{titulo}</h3>
        {fecha && <time className="max-w-[35%] break-words text-right text-[11px] text-zinc-500">{fecha}</time>}
      </div>
      {children}
    </article>
  )
}

export function PlantillaAtsVisual({ datos, personalizacion }: Props) {
  const color = getColorHex(personalizacion.color)
  const { datosPersonales: dp } = datos
  const e = etiquetasCv(personalizacion.idiomaCv)
  const orden = personalizacion.ordenSecciones ?? ORDEN_SECCIONES_INICIAL
  const contactos = [
    dp.email && { texto: dp.email, url: urlAbsoluta(dp.email) },
    dp.telefono && { texto: dp.telefono },
    dp.rut && { texto: `RUT ${dp.rut}` },
    dp.ubicacion && { texto: dp.ubicacion },
    dp.linkedin && { texto: dp.linkedin, url: urlAbsoluta(dp.linkedin) },
    dp.github && { texto: dp.github, url: urlAbsoluta(dp.github) },
    dp.sitioWeb && { texto: dp.sitioWeb, url: urlAbsoluta(dp.sitioWeb) },
  ].filter((contacto): contacto is { texto: string; url?: string } => Boolean(contacto))

  const secciones: Record<SeccionOrdenable, React.ReactNode> = {
    experiencia: datos.experiencia.length > 0 && (
      <section key="experiencia">
        <TituloSeccion color={color}>{e.experienciaLaboral}</TituloSeccion>
        <div className="flex flex-col gap-3">
          {datos.experiencia.map((exp) => (
            <ItemConFecha
              key={exp.id}
              titulo={`${exp.cargo || e.cargo}${exp.empresa ? ` — ${exp.empresa}` : ""}`}
              fecha={formatearRangoFechas(exp.fechaInicio, exp.fechaFin, personalizacion.idiomaCv)}
            >
              {exp.ubicacion && <p className="break-words text-[11px] italic text-zinc-500">{exp.ubicacion}</p>}
              {exp.descripcion && <TextoRico texto={exp.descripcion} className="text-zinc-700" />}
              {exp.logros && <TextoRico texto={exp.logros} className="text-zinc-700" />}
            </ItemConFecha>
          ))}
        </div>
      </section>
    ),
    educacion: datos.educacion.length > 0 && (
      <section key="educacion">
        <TituloSeccion color={color}>{e.educacion}</TituloSeccion>
        <div className="flex flex-col gap-3">
          {datos.educacion.map((edu) => (
            <ItemConFecha
              key={edu.id}
              titulo={`${edu.titulo || e.titulo}${edu.institucion ? ` — ${edu.institucion}` : ""}`}
              fecha={formatearFechaEducacion(edu.fechaInicio, edu.fechaFin, personalizacion.idiomaCv)}
            >
              {edu.descripcion && <TextoRico texto={edu.descripcion} className="text-zinc-700" />}
            </ItemConFecha>
          ))}
        </div>
      </section>
    ),
    cursos: datos.cursos.length > 0 && (
      <section key="cursos">
        <TituloSeccion color={color}>{e.cursosCertificaciones}</TituloSeccion>
        <div className="flex flex-col gap-2.5">
          {datos.cursos.map((curso) => (
            <ItemConFecha
              key={curso.id}
              titulo={`${curso.nombre || e.curso}${curso.institucion ? ` — ${curso.institucion}` : ""}`}
              fecha={curso.fecha ? formatearFecha(curso.fecha, personalizacion.idiomaCv) : ""}
            >
              {curso.url && <a className="break-all text-[11px] text-zinc-600 underline" href={urlAbsoluta(curso.url)}>{curso.url}</a>}
            </ItemConFecha>
          ))}
        </div>
      </section>
    ),
    proyectos: datos.proyectos.length > 0 && (
      <section key="proyectos">
        <TituloSeccion color={color}>{e.proyectos}</TituloSeccion>
        <div className="flex flex-col gap-3">
          {datos.proyectos.map((proyecto) => (
            <ItemConFecha key={proyecto.id} titulo={proyecto.nombre || e.proyecto}>
              {proyecto.tecnologias && <p className="break-words text-[11px] italic text-zinc-500">{proyecto.tecnologias}</p>}
              {proyecto.url && <a className="break-all text-[11px] text-zinc-600 underline" href={urlAbsoluta(proyecto.url)}>{proyecto.url}</a>}
              {proyecto.descripcion && <TextoRico texto={proyecto.descripcion} className="text-zinc-700" />}
            </ItemConFecha>
          ))}
        </div>
      </section>
    ),
    habilidades: datos.habilidades.length > 0 && (
      <section key="habilidades">
        <TituloSeccion color={color}>{e.competencias}</TituloSeccion>
        <ul className="list-disc space-y-0.5 pl-5 text-zinc-700">
          {datos.habilidades.map((habilidad) => <li key={habilidad} className="break-words">{habilidad}</li>)}
        </ul>
      </section>
    ),
    idiomas: datos.idiomas.length > 0 && (
      <section key="idiomas">
        <TituloSeccion color={color}>{e.idiomas}</TituloSeccion>
        <ul className="list-disc space-y-0.5 pl-5 text-zinc-700">
          {datos.idiomas.map((idioma) => (
            <li key={idioma.id} className="break-words">
              {idioma.nombre || e.idioma} — {etiquetaNivelIdioma(idioma.nivel, personalizacion.idiomaCv)}
            </li>
          ))}
        </ul>
      </section>
    ),
    referencias: datos.referencias.length > 0 && (
      <section key="referencias">
        <TituloSeccion color={color}>{e.referencias}</TituloSeccion>
        <ul className="flex list-disc flex-col gap-2.5 pl-5 text-zinc-700">
          {datos.referencias.map((referencia) => (
            <li key={referencia.id} className="break-words pl-1">
              <h3 className="font-bold text-zinc-900">{referencia.nombre || e.nombre}</h3>
              {(referencia.cargo || referencia.empresa) && (
                <p>{[referencia.cargo, referencia.empresa].filter(Boolean).join(" · ")}</p>
              )}
              {referencia.relacion && <p className="italic text-zinc-500">{referencia.relacion}</p>}
              {(referencia.email || referencia.telefono) && (
                <p className="break-all text-[11px]">{[referencia.email, referencia.telefono].filter(Boolean).join(" · ")}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    ),
    destacadas: <SeccionesDestacadas datos={datos} color={color} estilo="clasico" />,
  }

  return (
    <article className="flex flex-1 flex-col text-[12px] leading-snug text-zinc-700 [overflow-wrap:anywhere]">
      <div className="h-3 shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
      <header className="border-b-2 border-zinc-200 px-10 py-6">
        <h1 className="break-words text-[25px] font-bold leading-tight text-zinc-950">
          {dp.nombreCompleto || e.tuNombre}
        </h1>
        {dp.titulo && <p className="mt-1 break-words text-[14px] text-zinc-600">{dp.titulo}</p>}
        {contactos.length > 0 && (
          <address className="mt-3 flex flex-wrap gap-x-4 gap-y-1 not-italic text-[11px] text-zinc-600">
            {contactos.map((contacto) => (
              <span key={contacto.texto} className="min-w-0 break-all">
                {contacto.url ? <a href={contacto.url}>{contacto.texto}</a> : contacto.texto}
              </span>
            ))}
          </address>
        )}
      </header>

      <main className="flex flex-1 flex-col gap-5 px-10 py-7">
        {datos.perfil && (
          <section>
            <TituloSeccion color={color}>{e.perfilProfesional}</TituloSeccion>
            <TextoRico texto={datos.perfil} className="text-zinc-700" />
          </section>
        )}
        {orden.map((id) => secciones[id])}
        {(datos.disponibilidad || datos.pretensionesRenta) && (
          <section>
            <TituloSeccion color={color}>{e.infoAdicional}</TituloSeccion>
            <ul className="list-disc space-y-0.5 pl-5 text-zinc-700">
              {datos.disponibilidad && <li className="break-words"><strong>{e.disponibilidad}:</strong> {datos.disponibilidad}</li>}
              {datos.pretensionesRenta && <li className="break-words"><strong>{e.pretensionRenta}:</strong> {datos.pretensionesRenta}</li>}
            </ul>
          </section>
        )}
      </main>
    </article>
  )
}
