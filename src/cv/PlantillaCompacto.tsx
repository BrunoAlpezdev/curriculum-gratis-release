import {
  EnvelopeSimpleIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationCardIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
  GlobeIcon,
} from "@phosphor-icons/react"
import type { DatosCurriculum, Personalizacion, SeccionOrdenable, NivelIdioma } from "@/types"
import { getColorHex } from "@/lib/colores"
import { formatearRangoFechas, formatearFechaEducacion, formatearFecha, urlAbsoluta } from "@/lib/formato"
import { etiquetaNivelIdioma, etiquetasCv } from "@/lib/etiquetas-cv"
import { ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"
import { esTextoSimple } from "@/lib/texto-rico"
import { TextoRico } from "@/cv/TextoRico"

const SECCIONES_MAIN: SeccionOrdenable[] = ["experiencia", "educacion", "proyectos", "referencias"]
const SECCIONES_RAIL: SeccionOrdenable[] = ["cursos", "habilidades", "idiomas"]
const NIVEL_PUNTOS: Record<NivelIdioma, number> = { basico: 1, intermedio: 2, avanzado: 3, nativo: 4 }

interface Props {
  datos: DatosCurriculum
  personalizacion: Personalizacion
}

function TituloSeccion({ color, children }: { color: string; children: React.ReactNode }) {
  // h2 real: generar-pdf.ts mide posiciones de h2 para los cortes multipagina.
  return (
    <h2
      className="text-[10px] font-bold uppercase tracking-[0.14em] border-b border-zinc-200 pb-1 mb-2"
      style={{ color }}
    >
      {children}
    </h2>
  )
}

export function PlantillaCompacto({ datos, personalizacion }: Props) {
  const color = getColorHex(personalizacion.color)
  const { datosPersonales: dp } = datos
  const e = etiquetasCv(personalizacion.idiomaCv)
  const orden = personalizacion.ordenSecciones ?? ORDEN_SECCIONES_INICIAL

  const logros = (texto: string) =>
    esTextoSimple(texto) ? (
      <p className="mt-0.5 text-[10.5px] font-medium" style={{ color }}>
        {e.logros}: {texto}
      </p>
    ) : (
      <div className="mt-0.5 text-[10.5px] font-medium" style={{ color }}>
        <span className="font-semibold">{e.logros}:</span>
        <TextoRico texto={texto} />
      </div>
    )

  const secciones: Record<SeccionOrdenable, React.ReactNode> = {
    experiencia: datos.experiencia.length > 0 && (
      <div key="experiencia">
        <TituloSeccion color={color}>{e.experienciaLaboral}</TituloSeccion>
        <div className="flex flex-col gap-2">
          {datos.experiencia.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="font-semibold text-zinc-900">{exp.cargo || e.cargo}</h3>
                <span className="text-[10px] text-zinc-400 shrink-0 tabular-nums">
                  {formatearRangoFechas(exp.fechaInicio, exp.fechaFin, personalizacion.idiomaCv)}
                </span>
              </div>
              <p className="text-zinc-500 text-[10.5px]">
                {exp.empresa || e.empresa}
                {exp.ubicacion && ` · ${exp.ubicacion}`}
              </p>
              {exp.descripcion && <TextoRico texto={exp.descripcion} className="text-zinc-600 mt-0.5" />}
              {exp.logros && logros(exp.logros)}
            </div>
          ))}
        </div>
      </div>
    ),
    educacion: datos.educacion.length > 0 && (
      <div key="educacion">
        <TituloSeccion color={color}>{e.educacion}</TituloSeccion>
        <div className="flex flex-col gap-2">
          {datos.educacion.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="font-semibold text-zinc-900">{edu.titulo || e.titulo}</h3>
                <span className="text-[10px] text-zinc-400 shrink-0 tabular-nums">
                  {formatearFechaEducacion(edu.fechaInicio, edu.fechaFin, personalizacion.idiomaCv)}
                </span>
              </div>
              <p className="text-zinc-500 text-[10.5px]">{edu.institucion || e.institucion}</p>
              {edu.descripcion && <TextoRico texto={edu.descripcion} className="text-zinc-600 mt-0.5 text-[10.5px]" />}
            </div>
          ))}
        </div>
      </div>
    ),
    proyectos: datos.proyectos.length > 0 && (
      <div key="proyectos">
        <TituloSeccion color={color}>{e.proyectos}</TituloSeccion>
        <div className="flex flex-col gap-2">
          {datos.proyectos.map((p) => (
            <div key={p.id}>
              <h3 className="font-semibold text-zinc-900">{p.nombre || e.proyecto}</h3>
              {p.tecnologias && <p className="text-zinc-400 text-[10px]">{p.tecnologias}</p>}
              {p.url && (
                <p className="text-[10.5px] font-medium break-all" style={{ color }}>
                  <a href={urlAbsoluta(p.url)} target="_blank" rel="noopener noreferrer">{p.url}</a>
                </p>
              )}
              {p.descripcion && <TextoRico texto={p.descripcion} className="text-zinc-600 mt-0.5" />}
            </div>
          ))}
        </div>
      </div>
    ),
    referencias: datos.referencias.length > 0 && (
      <div key="referencias">
        <TituloSeccion color={color}>{e.referencias}</TituloSeccion>
        <div className="flex flex-col gap-2">
          {datos.referencias.map((ref) => (
            <div key={ref.id}>
              <h3 className="font-semibold text-zinc-900">{ref.nombre || e.nombre}</h3>
              {(ref.cargo || ref.empresa) && (
                <p className="text-zinc-500 text-[10.5px]">
                  {ref.cargo}
                  {ref.cargo && ref.empresa && " · "}
                  {ref.empresa}
                </p>
              )}
              {ref.relacion && <p className="text-[10.5px] font-medium" style={{ color }}>{ref.relacion}</p>}
              <div className="flex flex-col text-[10.5px] text-zinc-600">
                {ref.email && <span className="break-all">{ref.email}</span>}
                {ref.telefono && <span>{ref.telefono}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    cursos: datos.cursos.length > 0 && (
      <div key="cursos">
        <TituloSeccion color={color}>{e.cursosCertificaciones}</TituloSeccion>
        <div className="flex flex-col gap-1.5">
          {datos.cursos.map((curso) => (
            <div key={curso.id}>
              <h3 className="font-semibold text-zinc-900 text-[10.5px]">{curso.nombre || e.curso}</h3>
              {curso.institucion && <p className="text-zinc-500 text-[10px]">{curso.institucion}</p>}
              {curso.fecha && (
                <p className="text-zinc-400 text-[10px] tabular-nums">
                  {formatearFecha(curso.fecha, personalizacion.idiomaCv)}
                </p>
              )}
              {curso.url && (
                <p className="text-[10px] font-medium break-all" style={{ color }}>
                  <a href={urlAbsoluta(curso.url)} target="_blank" rel="noopener noreferrer">{curso.url}</a>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    habilidades: datos.habilidades.length > 0 && (
      <div key="habilidades">
        <TituloSeccion color={color}>{e.competencias}</TituloSeccion>
        <div className="flex flex-wrap gap-x-2.5 gap-y-1">
          {datos.habilidades.map((h) => (
            <span key={h} className="flex items-center gap-1.5 text-zinc-700 text-[10.5px]">
              <span className="size-1 rounded-[1px] shrink-0" style={{ backgroundColor: color }} />
              {h}
            </span>
          ))}
        </div>
      </div>
    ),
    idiomas: datos.idiomas.length > 0 && (
      <div key="idiomas">
        <TituloSeccion color={color}>{e.idiomas}</TituloSeccion>
        <div className="flex flex-col gap-1.5">
          {datos.idiomas.map((i) => (
            <div key={i.id} className="flex items-center justify-between gap-2">
              <span className="text-zinc-700 text-[10.5px]">{i.nombre || e.idioma}</span>
              <span className="flex items-center gap-1 shrink-0" title={etiquetaNivelIdioma(i.nivel, personalizacion.idiomaCv)}>
                {[1, 2, 3, 4].map((n) => (
                  <span
                    key={n}
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: n <= NIVEL_PUNTOS[i.nivel] ? color : "#e4e4e7" }}
                  />
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  }

  const contactos: { icono: React.ReactNode; texto: string; url?: string }[] = []
  if (dp.email) contactos.push({ icono: <EnvelopeSimpleIcon size={11} style={{ color }} />, texto: dp.email, url: urlAbsoluta(dp.email) })
  if (dp.telefono) contactos.push({ icono: <PhoneIcon size={11} style={{ color }} />, texto: dp.telefono })
  if (dp.rut) contactos.push({ icono: <IdentificationCardIcon size={11} style={{ color }} />, texto: `RUT ${dp.rut}` })
  if (dp.ubicacion) contactos.push({ icono: <MapPinIcon size={11} style={{ color }} />, texto: dp.ubicacion })
  if (dp.linkedin) contactos.push({ icono: <LinkedinLogoIcon size={11} style={{ color }} />, texto: dp.linkedin, url: urlAbsoluta(dp.linkedin) })
  if (dp.github) contactos.push({ icono: <GithubLogoIcon size={11} style={{ color }} />, texto: dp.github, url: urlAbsoluta(dp.github) })
  if (dp.sitioWeb) contactos.push({ icono: <GlobeIcon size={11} style={{ color }} />, texto: dp.sitioWeb, url: urlAbsoluta(dp.sitioWeb) })

  return (
    <div className="flex-1 flex flex-col text-[11px] leading-snug px-8 py-6">
      <div className="flex items-start justify-between gap-5 pb-4 mb-5 border-b-2" style={{ borderColor: color }}>
        <div className="flex-1 min-w-0">
          <h1 className="text-[22px] font-bold tracking-tight leading-tight text-zinc-900">
            {dp.nombreCompleto || e.tuNombre}
          </h1>
          {dp.titulo && <p className="text-[12px] font-semibold mt-0.5" style={{ color }}>{dp.titulo}</p>}
          {contactos.length > 0 && (
            <div className="flex flex-wrap gap-x-3.5 gap-y-1 mt-2 text-[10.5px] text-zinc-500">
              {contactos.map((c) => (
                <span key={c.texto} className="flex items-center gap-1 min-w-0">
                  {c.icono}
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="break-all">{c.texto}</a>
                  ) : (
                    <span className="break-all">{c.texto}</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
        {dp.foto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dp.foto} alt="" className="size-16 shrink-0 rounded-lg object-cover ring-1 ring-zinc-200" />
        )}
      </div>

      <div className="flex-1 grid grid-cols-[1fr_230px] gap-x-7 items-start">
        <div className="flex flex-col gap-3 min-w-0">
          {datos.perfil && (
            <div>
              <TituloSeccion color={color}>{e.perfilProfesional}</TituloSeccion>
              <TextoRico texto={datos.perfil} className="text-zinc-600" />
            </div>
          )}
          {orden.filter((id) => SECCIONES_MAIN.includes(id)).map((id) => secciones[id])}
        </div>
        <div className="flex flex-col gap-3 min-w-0">
          {orden.filter((id) => SECCIONES_RAIL.includes(id)).map((id) => secciones[id])}
          {(datos.disponibilidad || datos.pretensionesRenta) && (
            <div className="bg-zinc-50 rounded-lg p-2.5 text-[10.5px] text-zinc-600 flex flex-col gap-1">
              {datos.disponibilidad && (
                <span>
                  <span className="font-bold uppercase tracking-wide text-[9px]" style={{ color }}>{e.disponibilidad}:</span>{" "}
                  {datos.disponibilidad}
                </span>
              )}
              {datos.pretensionesRenta && (
                <span>
                  <span className="font-bold uppercase tracking-wide text-[9px]" style={{ color }}>{e.pretensionRenta}:</span>{" "}
                  {datos.pretensionesRenta}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
