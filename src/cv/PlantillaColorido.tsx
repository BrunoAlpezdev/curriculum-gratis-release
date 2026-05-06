import {
  EnvelopeSimpleIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  LightningIcon,
  TranslateIcon,
  UserIcon,
  UsersIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
  GlobeIcon,
  CertificateIcon,
  CodeIcon,
} from "@phosphor-icons/react"
import type { DatosCurriculum, Personalizacion, SeccionOrdenable } from "@/types"
import { getColorHex, getColorClaro } from "@/lib/colores"
import { formatearRangoFechas, formatearFechaEducacion, formatearFecha } from "@/lib/formato"
import { etiquetasCv } from "@/lib/etiquetas-cv"
import { ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"

interface Props {
  datos: DatosCurriculum
  personalizacion: Personalizacion
}

export function PlantillaColorido({ datos, personalizacion }: Props) {
  const color = getColorHex(personalizacion.color)
  const colorClaro = getColorClaro(color)
  const { datosPersonales: dp } = datos
  const e = etiquetasCv(personalizacion.idiomaCv)
  const orden = personalizacion.ordenSecciones ?? ORDEN_SECCIONES_INICIAL

  const secciones: Record<SeccionOrdenable, React.ReactNode> = {
    experiencia: datos.experiencia.length > 0 && (
      <div key="experiencia">
        <div className="flex items-center gap-1.5 mb-2">
          <BriefcaseIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.experienciaLaboral}
          </h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {datos.experiencia.map((exp) => (
            <div key={exp.id} className="pl-3 border-l-2" style={{ borderColor: color }}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-800">
                  {exp.cargo || e.cargo}
                </h3>
                <span className="text-[11px] text-zinc-500 shrink-0 ml-2">
                  {formatearRangoFechas(exp.fechaInicio, exp.fechaFin)}
                </span>
              </div>
              <p className="text-zinc-500 italic text-[11px]">
                {exp.empresa || e.empresa}
                {exp.ubicacion && ` · ${exp.ubicacion}`}
              </p>
              {exp.descripcion && (
                <p className="text-zinc-600 mt-0.5 whitespace-pre-line">
                  {exp.descripcion}
                </p>
              )}
              {exp.logros && (
                <p className="mt-0.5 text-[11px] font-medium" style={{ color }}>
                  {e.logros}: {exp.logros}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    educacion: datos.educacion.length > 0 && (
      <div key="educacion">
        <div className="flex items-center gap-1.5 mb-2">
          <GraduationCapIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.educacion}
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {datos.educacion.map((edu) => (
            <div key={edu.id} className="pl-3 border-l-2" style={{ borderColor: color }}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-800">
                  {edu.titulo || e.titulo}
                </h3>
                <span className="text-[11px] text-zinc-500 shrink-0 ml-2">
                  {formatearFechaEducacion(edu.fechaInicio, edu.fechaFin)}
                </span>
              </div>
              <p className="text-zinc-500 italic text-[11px]">
                {edu.institucion || e.institucion}
              </p>
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
        <div className="flex items-center gap-1.5 mb-2">
          <CertificateIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.cursosCertificaciones}
          </h2>
        </div>
        <div className="flex flex-col gap-1.5">
          {datos.cursos.map((curso) => (
            <div key={curso.id} className="pl-3 border-l-2" style={{ borderColor: color }}>
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
                <p className="text-[11px] font-medium" style={{ color }}>
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
        <div className="flex items-center gap-1.5 mb-2">
          <CodeIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.proyectos}
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {datos.proyectos.map((p) => (
            <div key={p.id} className="pl-3 border-l-2" style={{ borderColor: color }}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-800">
                  {p.nombre || e.proyecto}
                </h3>
                {p.url && (
                  <span className="text-[11px] font-medium shrink-0 ml-2" style={{ color }}>
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
    habilidades: datos.habilidades.length > 0 && (
      <div key="habilidades">
        <div className="flex items-center gap-1.5 mb-1.5">
          <LightningIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.competencias}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {datos.habilidades.map((h) => (
            <span
              key={h}
              className="rounded-full border px-3 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: colorClaro, color, borderColor: `${color}30` }}
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    ),
    idiomas: datos.idiomas.length > 0 && (
      <div key="idiomas">
        <div className="flex items-center gap-1.5 mb-1.5">
          <TranslateIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.idiomas}
          </h2>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px]">
          {datos.idiomas.map((i) => (
            <span key={i.id} className="text-zinc-700">
              {i.nombre || e.idioma}{" "}
              <span className="capitalize text-zinc-400">({i.nivel})</span>
            </span>
          ))}
        </div>
      </div>
    ),
    referencias: datos.referencias.length > 0 && (
      <div key="referencias">
        <div className="flex items-center gap-1.5 mb-2">
          <UsersIcon size={14} style={{ color }} weight="bold" />
          <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
            {e.referencias}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {datos.referencias.map((ref) => (
            <div
              key={ref.id}
              className="p-2.5 rounded-lg"
              style={{ backgroundColor: colorClaro }}
            >
              <h3 className="font-bold text-zinc-800">{ref.nombre || e.nombre}</h3>
              {(ref.cargo || ref.empresa) && (
                <p className="text-zinc-600 text-[11px]">
                  {ref.cargo}
                  {ref.cargo && ref.empresa && " · "}
                  {ref.empresa}
                </p>
              )}
              {ref.relacion && (
                <p className="text-[11px] font-medium" style={{ color }}>
                  {ref.relacion}
                </p>
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

  return (
    <div className="flex-1 flex flex-col text-[12px] leading-snug relative overflow-hidden">
      {/* Formas decorativas de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: color, transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: color, transform: "translate(-30%, 30%)" }} />

      {/* Header */}
      <div
        className="px-7 py-5 text-white relative overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 bg-white" style={{ transform: "translate(20%, -50%)" }} />
        <div className="relative flex items-center gap-4">
          {dp.foto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dp.foto}
              alt=""
              className="h-20 w-20 rounded-full object-cover border-2 border-white/60 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
          <h1 className="text-[22px] font-bold leading-tight">
            {dp.nombreCompleto || e.tuNombre}
          </h1>
          {dp.titulo && (
            <p className="text-[13px] mt-0.5 opacity-90">{dp.titulo}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-2 text-[11px] opacity-90">
            {dp.email && (
              <span className="flex items-center gap-1">
                <EnvelopeSimpleIcon size={12} />
                {dp.email}
              </span>
            )}
            {dp.telefono && (
              <span className="flex items-center gap-1">
                <PhoneIcon size={12} />
                {dp.telefono}
              </span>
            )}
            {dp.ubicacion && (
              <span className="flex items-center gap-1">
                <MapPinIcon size={12} />
                {dp.ubicacion}
              </span>
            )}
            {dp.linkedin && (
              <span className="flex items-center gap-1">
                <LinkedinLogoIcon size={12} />
                {dp.linkedin}
              </span>
            )}
            {dp.github && (
              <span className="flex items-center gap-1">
                <GithubLogoIcon size={12} />
                {dp.github}
              </span>
            )}
            {dp.sitioWeb && (
              <span className="flex items-center gap-1">
                <GlobeIcon size={12} />
                {dp.sitioWeb}
              </span>
            )}
          </div>
          </div>
        </div>
      </div>

      <div className="px-7 py-4 flex flex-col gap-3 flex-1">
        {/* Perfil */}
        {datos.perfil && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: colorClaro }}>
            <div className="flex items-center gap-1.5 mb-1">
              <UserIcon size={14} style={{ color }} weight="bold" />
              <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>
                {e.perfilProfesional}
              </h2>
            </div>
            <p className="text-zinc-600 whitespace-pre-line">{datos.perfil}</p>
          </div>
        )}

        {orden.map((id) => secciones[id])}

        {(datos.disponibilidad || datos.pretensionesRenta) && (
          <div
            className="mt-auto p-2.5 rounded-lg text-[11px] flex flex-wrap gap-x-5 gap-y-1"
            style={{ backgroundColor: colorClaro }}
          >
            {datos.disponibilidad && (
              <span className="text-zinc-700">
                <span className="font-bold" style={{ color }}>{e.disponibilidad}:</span>{" "}
                {datos.disponibilidad}
              </span>
            )}
            {datos.pretensionesRenta && (
              <span className="text-zinc-700">
                <span className="font-bold" style={{ color }}>{e.pretensionRenta}:</span>{" "}
                {datos.pretensionesRenta}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
