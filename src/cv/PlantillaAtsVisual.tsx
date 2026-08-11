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
    <h2 className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#354052]">
      <span className="h-5 w-1 shrink-0 rounded-sm" style={{ backgroundColor: color }} aria-hidden="true" />
      <span>{children}</span>
      <span className="h-px flex-1 bg-zinc-200" aria-hidden="true" />
    </h2>
  )
}

function ItemConFecha({
  titulo,
  fecha,
  color,
  children,
}: {
  titulo: string
  fecha?: string
  color: string
  children?: React.ReactNode
}) {
  return (
    <article className="flex flex-col gap-0.5 border-l-2 pl-4" style={{ borderColor: color }}>
      <div className="grid grid-cols-[minmax(0,1fr)_max-content] items-start gap-x-6">
        <h3 className="min-w-0 break-words font-bold leading-tight text-zinc-900">{titulo}</h3>
        {fecha && <time className="whitespace-nowrap pt-0.5 text-right text-[11px] tabular-nums text-zinc-500">{fecha}</time>}
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
              titulo={exp.cargo || e.cargo}
              fecha={formatearRangoFechas(exp.fechaInicio, exp.fechaFin, personalizacion.idiomaCv)}
              color={color}
            >
              {exp.empresa && <p className="break-words text-[11px] font-semibold" style={{ color }}>{exp.empresa}</p>}
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
              titulo={edu.titulo || e.titulo}
              fecha={formatearFechaEducacion(edu.fechaInicio, edu.fechaFin, personalizacion.idiomaCv)}
              color={color}
            >
              {edu.institucion && <p className="break-words text-[11px] font-semibold" style={{ color }}>{edu.institucion}</p>}
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
              titulo={curso.nombre || e.curso}
              fecha={curso.fecha ? formatearFecha(curso.fecha, personalizacion.idiomaCv) : ""}
              color={color}
            >
              {curso.institucion && <p className="break-words text-[11px] font-semibold" style={{ color }}>{curso.institucion}</p>}
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
            <ItemConFecha key={proyecto.id} titulo={proyecto.nombre || e.proyecto} color={color}>
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
    <article className="flex flex-1 flex-col bg-white text-[12px] leading-[1.45] text-zinc-700 [overflow-wrap:anywhere]">
      <div className="h-2 shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
      <header className="relative overflow-hidden bg-[#354052] px-10 py-7 text-white">
        <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full border border-white/10 bg-white/[0.06]" aria-hidden="true" />
        <div className="relative">
          <h1 className="break-words text-[26px] font-bold leading-tight tracking-[-0.02em] text-white">
            {dp.nombreCompleto || e.tuNombre}
          </h1>
          {dp.titulo && <p className="mt-1 break-words text-[14px] text-white/80">{dp.titulo}</p>}
        {contactos.length > 0 && (
          <address className="mt-4 flex flex-wrap gap-x-5 gap-y-2 not-italic text-[11px] text-white/80">
            {contactos.map((contacto) => (
              <span key={contacto.texto} className="min-w-0 break-all">
                {contacto.url ? <a className="hover:underline" href={contacto.url}>{contacto.texto}</a> : contacto.texto}
              </span>
            ))}
          </address>
        )}
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-10 py-7">
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
