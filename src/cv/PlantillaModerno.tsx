import {
  EnvelopeSimpleIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  LightningIcon,
  TranslateIcon,
  UsersIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
  GlobeIcon,
  CertificateIcon,
  CodeIcon,
} from "@phosphor-icons/react"
import type { DatosCurriculum, Personalizacion, SeccionOrdenable } from "@/types"
import { getColorHex } from "@/lib/colores"
import { formatearRangoFechas, formatearFechaEducacion, formatearFecha } from "@/lib/formato"
import { etiquetasCv } from "@/lib/etiquetas-cv"
import { ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"

interface Props {
  datos: DatosCurriculum
  personalizacion: Personalizacion
}

/* En Moderno habilidades e idiomas van siempre en el sidebar, los sacamos
   del orden configurable cuando render el body */
const SECCIONES_BODY = [
  "experiencia",
  "educacion",
  "cursos",
  "proyectos",
  "referencias",
] as const satisfies readonly SeccionOrdenable[]

type SeccionBody = (typeof SECCIONES_BODY)[number]

export function PlantillaModerno({ datos, personalizacion }: Props) {
  const color = getColorHex(personalizacion.color)
  const { datosPersonales: dp } = datos
  const e = etiquetasCv(personalizacion.idiomaCv)
  const orden = (personalizacion.ordenSecciones ?? ORDEN_SECCIONES_INICIAL).filter(
    (id): id is SeccionBody => SECCIONES_BODY.includes(id as SeccionBody),
  )

  const secciones: Record<SeccionBody, React.ReactNode> = {
    experiencia: datos.experiencia.length > 0 && (
      <div key="experiencia">
        <div className="flex items-center gap-1.5 mb-2 pb-1 border-b-2" style={{ borderColor: color }}>
          <BriefcaseIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.experienciaLaboral}
          </h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {datos.experiencia.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-800">{exp.cargo || e.cargo}</h3>
                <span className="text-[11px] text-zinc-500 shrink-0 ml-2">
                  {formatearRangoFechas(exp.fechaInicio, exp.fechaFin)}
                </span>
              </div>
              <p className="text-zinc-500 italic text-[11px]">
                {exp.empresa || e.empresa}
                {exp.ubicacion && ` · ${exp.ubicacion}`}
              </p>
              {exp.descripcion && (
                <p className="text-zinc-600 mt-0.5 whitespace-pre-line">{exp.descripcion}</p>
              )}
              {exp.logros && (
                <p className="mt-0.5 text-[11px]" style={{ color }}>
                  <span className="font-semibold">{e.logros}: </span>{exp.logros}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    educacion: datos.educacion.length > 0 && (
      <div key="educacion">
        <div className="flex items-center gap-1.5 mb-2 pb-1 border-b-2" style={{ borderColor: color }}>
          <GraduationCapIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.educacion}
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {datos.educacion.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-800">{edu.titulo || e.titulo}</h3>
                <span className="text-[11px] text-zinc-500 shrink-0 ml-2">
                  {formatearFechaEducacion(edu.fechaInicio, edu.fechaFin)}
                </span>
              </div>
              <p className="text-zinc-500 italic text-[11px]">{edu.institucion || e.institucion}</p>
              {edu.descripcion && (
                <p className="text-zinc-600 mt-0.5 text-[11px]">{edu.descripcion}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    cursos: datos.cursos.length > 0 && (
      <div key="cursos">
        <div className="flex items-center gap-1.5 mb-2 pb-1 border-b-2" style={{ borderColor: color }}>
          <CertificateIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.cursosCertificaciones}
          </h2>
        </div>
        <div className="flex flex-col gap-1.5">
          {datos.cursos.map((curso) => (
            <div key={curso.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-800">
                  {curso.nombre || e.curso}
                </h3>
                {curso.fecha && (
                  <span className="text-[11px] text-zinc-500 shrink-0 ml-2">
                    {formatearFecha(curso.fecha)}
                  </span>
                )}
              </div>
              {curso.institucion && (
                <p className="text-zinc-500 italic text-[11px]">
                  {curso.institucion}
                </p>
              )}
              {curso.url && (
                <p className="text-[11px]" style={{ color }}>
                  {curso.url}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    proyectos: datos.proyectos.length > 0 && (
      <div key="proyectos">
        <div className="flex items-center gap-1.5 mb-2 pb-1 border-b-2" style={{ borderColor: color }}>
          <CodeIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.proyectos}
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {datos.proyectos.map((p) => (
            <div key={p.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-800">
                  {p.nombre || e.proyecto}
                </h3>
                {p.url && (
                  <span className="text-[11px] shrink-0 ml-2" style={{ color }}>
                    {p.url}
                  </span>
                )}
              </div>
              {p.tecnologias && (
                <p className="text-zinc-500 italic text-[11px]">
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
    referencias: datos.referencias.length > 0 && (
      <div key="referencias">
        <div className="flex items-center gap-1.5 mb-2 pb-1 border-b-2" style={{ borderColor: color }}>
          <UsersIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.referencias}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {datos.referencias.map((ref) => (
            <div key={ref.id}>
              <h3 className="font-bold text-zinc-800">{ref.nombre || e.nombre}</h3>
              {(ref.cargo || ref.empresa) && (
                <p className="text-zinc-500 italic text-[11px]">
                  {ref.cargo}
                  {ref.cargo && ref.empresa && " · "}
                  {ref.empresa}
                </p>
              )}
              {ref.relacion && (
                <p className="text-[11px]" style={{ color }}>
                  {ref.relacion}
                </p>
              )}
              <div className="flex flex-wrap gap-x-3 text-[11px] text-zinc-600">
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
    <div className="flex flex-1 text-[12px] leading-snug">
      {/* Sidebar */}
      <div
        className="w-[33%] px-5 py-6 text-white flex flex-col gap-5"
        style={{ backgroundColor: color }}
      >
        {dp.foto && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dp.foto}
              alt=""
              className="h-24 w-24 rounded-full object-cover border-2 border-white/40"
            />
          </div>
        )}
        <div>
          <h1 className="text-[18px] font-bold leading-tight">
            {dp.nombreCompleto || e.tuNombre}
          </h1>
          {dp.titulo && (
            <p className="text-[11px] mt-1 opacity-90">{dp.titulo}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-[11px]">
          {dp.email && (
            <div className="flex items-center gap-1.5">
              <EnvelopeSimpleIcon size={12} />
              <span className="break-all">{dp.email}</span>
            </div>
          )}
          {dp.telefono && (
            <div className="flex items-center gap-1.5">
              <PhoneIcon size={12} />
              <span>{dp.telefono}</span>
            </div>
          )}
          {dp.ubicacion && (
            <div className="flex items-center gap-1.5">
              <MapPinIcon size={12} />
              <span>{dp.ubicacion}</span>
            </div>
          )}
          {dp.linkedin && (
            <div className="flex items-center gap-1.5">
              <LinkedinLogoIcon size={12} />
              <span className="break-all">{dp.linkedin}</span>
            </div>
          )}
          {dp.github && (
            <div className="flex items-center gap-1.5">
              <GithubLogoIcon size={12} />
              <span className="break-all">{dp.github}</span>
            </div>
          )}
          {dp.sitioWeb && (
            <div className="flex items-center gap-1.5">
              <GlobeIcon size={12} />
              <span className="break-all">{dp.sitioWeb}</span>
            </div>
          )}
        </div>

        {datos.habilidades.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <LightningIcon size={13} weight="bold" />
              <h2 className="text-[11px] font-bold uppercase tracking-wide">{e.competencias}</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {datos.habilidades.map((h) => (
                <span
                  key={h}
                  className="rounded-full px-2.5 py-0.5 text-[10px]"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {datos.idiomas.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TranslateIcon size={13} weight="bold" />
              <h2 className="text-[11px] font-bold uppercase tracking-wide">{e.idiomas}</h2>
            </div>
            <div className="flex flex-col gap-1 text-[11px]">
              {datos.idiomas.map((i) => (
                <div key={i.id} className="flex justify-between">
                  <span>{i.nombre || e.idioma}</span>
                  <span className="opacity-75 capitalize">{i.nivel}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 px-5 py-6 flex flex-col gap-3">
        {datos.perfil && (
          <div>
            <h2
              className="text-[12px] font-bold uppercase tracking-wide mb-1.5 pb-1 border-b-2"
              style={{ color, borderColor: color }}
            >
              {e.perfilProfesional}
            </h2>
            <p className="text-zinc-600 whitespace-pre-line">{datos.perfil}</p>
          </div>
        )}

        {orden.map((id) => secciones[id])}

        {(datos.disponibilidad || datos.pretensionesRenta) && (
          <div className="mt-auto pt-3 border-t-2 text-[11px] text-zinc-600 flex flex-wrap gap-x-5 gap-y-1" style={{ borderColor: color }}>
            {datos.disponibilidad && (
              <span>
                <span className="font-bold uppercase tracking-wide text-[10px]" style={{ color }}>{e.disponibilidad}:</span>{" "}
                {datos.disponibilidad}
              </span>
            )}
            {datos.pretensionesRenta && (
              <span>
                <span className="font-bold uppercase tracking-wide text-[10px]" style={{ color }}>{e.pretensionRenta}:</span>{" "}
                {datos.pretensionesRenta}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
