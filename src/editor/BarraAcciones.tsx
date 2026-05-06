"use client"

import { useState, useRef, useEffect } from "react"
import {
  DownloadSimpleIcon,
  ArrowCounterClockwiseIcon,
  SpinnerIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  EyeIcon,
  DotsThreeVerticalIcon,
  FileArrowDownIcon,
  FileArrowUpIcon,
} from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { useCurriculumStore } from "@/lib/store"
import { useTema, type Tema } from "@/lib/useTema"
import { exportarJson, importarJson } from "@/lib/importar-exportar"
import { DialogEjemploCv } from "@/editor/DialogEjemploCv"
import type { DatosCurriculum } from "@/types"
import type { Modo } from "@/editor/Editor"

const CICLO_TEMA: Record<Tema, Tema> = {
  sistema: "claro",
  claro: "oscuro",
  oscuro: "sistema",
}

const ICONO_TEMA: Record<Tema, React.ReactNode> = {
  claro: <SunIcon size={16} />,
  oscuro: <MoonIcon size={16} />,
  sistema: <MonitorIcon size={16} />,
}

const ETIQUETA_TEMA: Record<Tema, string> = {
  claro: "Claro",
  oscuro: "Oscuro",
  sistema: "Sistema",
}

function aleatorio<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

const PERFILES_MOCK = [
  {
    nombre: "Camila Rojas Fernandez",
    titulo: "Ingeniera de Software Senior",
    email: "persona-ejemplo-01@example.com",
    perfil: "Ingeniera de software con 6 años de experiencia desarrollando aplicaciones web escalables. Especializada en React, Node.js y arquitectura de microservicios.",
    cargo1: "Ingeniera de Software Senior", cargo2: "Desarrolladora Full Stack",
    carrera: "Ingenieria Civil en Computacion",
    habilidades: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS", "Git", "Scrum"],
  },
  {
    nombre: "Roberto Mamani Quispe",
    titulo: "Operador de Maquinaria Pesada",
    email: "persona-ejemplo-02@example.com",
    perfil: "Operador de maquinaria pesada con 12 años de experiencia en mineria a gran escala. Certificado en operacion de camiones Komatsu 930E y palas hidraulicas CAT 6060. Comprometido con la seguridad y el cumplimiento de protocolos operacionales.",
    cargo1: "Operador de Camion Minero", cargo2: "Operador de Pala Mecanica",
    carrera: "Tecnico en Maquinaria Pesada",
    habilidades: ["Komatsu 930E", "CAT 6060", "Licencia D", "Seguridad Minera", "Mantencion Preventiva", "Trabajo en Altura", "SAP PM", "Primeros Auxilios"],
  },
  {
    nombre: "Javiera Sepulveda Araya",
    titulo: "Estilista Profesional",
    email: "persona-ejemplo-03@example.com",
    perfil: "Estilista profesional con 8 años de experiencia en corte, colorimetria y tratamientos capilares. Especializada en tecnicas de balayage y alisados. Atencion personalizada enfocada en resaltar la imagen de cada cliente.",
    cargo1: "Estilista Senior", cargo2: "Colorista",
    carrera: "Cosmetologia y Estilismo Profesional",
    habilidades: ["Colorimetria", "Balayage", "Corte", "Alisado", "Tratamientos Capilares", "Atencion al Cliente", "Keratina", "Maquillaje"],
  },
  {
    nombre: "Carlos Figueroa Tapia",
    titulo: "Encargado de Bodega e Inventario",
    email: "persona-ejemplo-04@example.com",
    perfil: "Profesional de logistica con 6 años de experiencia en gestion de inventarios y control de bodega. Manejo avanzado de sistemas WMS y procesos de recepcion, almacenamiento y despacho.",
    cargo1: "Encargado de Bodega", cargo2: "Asistente de Inventario",
    carrera: "Tecnico en Logistica",
    habilidades: ["WMS", "Control de Inventario", "SAP MM", "Despacho", "Recepcion de Mercaderia", "Excel", "Grua Horquilla", "Picking"],
  },
  {
    nombre: "Valentina Muñoz Lagos",
    titulo: "Analista de Datos",
    email: "persona-ejemplo-05@example.com",
    perfil: "Analista de datos con experiencia en business intelligence y machine learning. Apasionada por transformar datos complejos en insights accionables para la toma de decisiones.",
    cargo1: "Data Analyst Senior", cargo2: "Analista de Business Intelligence",
    carrera: "Ingenieria en Informatica",
    habilidades: ["Python", "SQL", "Power BI", "Tableau", "Pandas", "Machine Learning", "Excel Avanzado", "ETL"],
  },
  {
    nombre: "Sebastian Torres Medina",
    titulo: "Contador Auditor",
    email: "persona-ejemplo-06@example.com",
    perfil: "Contador auditor con 8 años de experiencia en auditoria financiera y tributaria. Especializado en IFRS, normativa tributaria chilena y optimizacion de procesos contables.",
    cargo1: "Contador Senior", cargo2: "Analista Contable",
    carrera: "Contabilidad y Auditoria",
    habilidades: ["IFRS", "Auditoria", "SAP", "Tributaria", "Excel Avanzado", "ERP", "Presupuestos", "Conciliaciones"],
  },
  {
    nombre: "Pedro Arancibia Cortes",
    titulo: "Soldador Certificado",
    email: "persona-ejemplo-07@example.com",
    perfil: "Soldador certificado con 10 años de experiencia en soldadura MIG, TIG y arco manual. Trabajo en plantas industriales, mineria y construccion. Cumplimiento estricto de normas de seguridad y calidad AWS.",
    cargo1: "Soldador Especialista", cargo2: "Ayudante de Soldadura",
    carrera: "Tecnico en Soldadura Industrial",
    habilidades: ["Soldadura MIG", "Soldadura TIG", "Arco Manual", "Lectura de Planos", "AWS D1.1", "Oxicorte", "Seguridad Industrial", "Esmerilado"],
  },
  {
    nombre: "Maria Jose Contreras Vega",
    titulo: "Tecnica en Enfermeria",
    email: "persona-ejemplo-08@example.com",
    perfil: "Tecnica en enfermeria con 5 años de experiencia en atencion hospitalaria y ambulatoria. Especializada en cuidados del paciente critico, toma de muestras y administracion de medicamentos.",
    cargo1: "Tecnica en Enfermeria", cargo2: "Auxiliar de Enfermeria",
    carrera: "Tecnico en Enfermeria",
    habilidades: ["Toma de Muestras", "Signos Vitales", "RCP", "Administracion de Medicamentos", "Curaciones", "Atencion al Paciente", "Registro Clinico", "Esterilizacion"],
  },
  {
    nombre: "Luis Henriquez Palma",
    titulo: "Electricista Industrial",
    email: "persona-ejemplo-09@example.com",
    perfil: "Electricista industrial con licencia SEC clase A, 9 años de experiencia en instalaciones electricas de media y baja tension. Mantencion preventiva y correctiva en plantas industriales y mineras.",
    cargo1: "Electricista Industrial", cargo2: "Ayudante Electrico",
    carrera: "Tecnico en Electricidad Industrial",
    habilidades: ["Media Tension", "Baja Tension", "Licencia SEC A", "PLC", "Tableros Electricos", "Canalizacion", "Lectura de Planos", "Norma NCH 4/2003"],
  },
  {
    nombre: "Andrea Fuentes Castillo",
    titulo: "Vendedora Retail",
    email: "persona-ejemplo-10@example.com",
    perfil: "Profesional de ventas con 4 años de experiencia en retail y atencion al cliente. Orientada al cumplimiento de metas y fidelizacion de clientes. Manejo de caja y reposicion de productos.",
    cargo1: "Vendedora Senior", cargo2: "Cajera",
    carrera: "Administracion de Empresas mencion Marketing",
    habilidades: ["Atencion al Cliente", "Ventas", "Caja", "Visual Merchandising", "SAP Retail", "Manejo de Inventario", "Postventa", "Trabajo en Equipo"],
  },
]

const EMPRESAS = [
  "TechCorp Chile", "Falabella", "Banco Estado", "LATAM Airlines", "Cencosud",
  "Minera Escondida", "Codelco", "SQM", "Sodimac", "Lider Express",
  "Clinica Alemana", "Hospital Regional", "Salon Estilo", "Beauty Center",
  "Constructora Echeverria", "Logistica Andina", "Frigorifico del Sur",
]
const UBICACIONES = [
  "Santiago, Chile", "Valparaiso, Chile", "Concepcion, Chile",
  "Antofagasta, Chile", "Calama, Chile", "Iquique, Chile",
  "Copiapo, Chile", "La Serena, Chile", "Temuco, Chile", "Rancagua, Chile",
]
const INSTITUCIONES = [
  "Universidad de Chile", "PUC Chile", "Universidad de Santiago",
  "UTFSM", "Duoc UC", "INACAP", "CFT Santo Tomas",
  "Instituto AIEP", "CFT CENCO", "Liceo Industrial",
]

const TELEFONO_MOCK = "+56 9 0000 0000"
const LINKEDIN_MOCK = "linkedin.com/in/perfil-ejemplo-no-real"

function generarDatosMock(): DatosCurriculum {
  const perfil = aleatorio(PERFILES_MOCK)
  return {
    datosPersonales: {
      nombreCompleto: perfil.nombre,
      titulo: perfil.titulo,
      email: perfil.email,
      telefono: TELEFONO_MOCK,
      ubicacion: aleatorio(UBICACIONES),
      linkedin: LINKEDIN_MOCK,
      github: "",
      sitioWeb: "",
      foto: "",
    },
    perfil: perfil.perfil,
    experiencia: [
      {
        id: crypto.randomUUID(),
        empresa: aleatorio(EMPRESAS),
        cargo: perfil.cargo1,
        ubicacion: aleatorio(UBICACIONES),
        fechaInicio: "2021-03",
        fechaFin: null,
        descripcion: "Liderazgo tecnico y desarrollo de soluciones de alto impacto. Colaboracion directa con stakeholders para definir roadmap de producto.",
        logros: "Reduccion de costos operativos en un 30%. Implementacion de procesos que mejoraron la productividad del equipo.",
      },
      {
        id: crypto.randomUUID(),
        empresa: aleatorio(EMPRESAS),
        cargo: perfil.cargo2,
        ubicacion: aleatorio(UBICACIONES),
        fechaInicio: "2018-06",
        fechaFin: "2021-02",
        descripcion: "Desarrollo e implementacion de proyectos clave para el area. Coordinacion con equipos multidisciplinarios.",
        logros: "Reconocimiento como mejor profesional del area en 2020.",
      },
    ],
    educacion: [
      {
        id: crypto.randomUUID(),
        institucion: aleatorio(INSTITUCIONES),
        titulo: perfil.carrera,
        fechaInicio: "2013-03",
        fechaFin: "2018-01",
        descripcion: "Graduacion con distincion. Participacion activa en proyectos de investigacion.",
      },
    ],
    cursos: [
      {
        id: crypto.randomUUID(),
        nombre: "Scrum Fundamentals Certified",
        institucion: "SCRUMstudy",
        fecha: "2022-06",
        url: "",
      },
    ],
    proyectos: [],
    habilidades: perfil.habilidades,
    idiomas: [
      { id: crypto.randomUUID(), nombre: "Español", nivel: "nativo" },
      { id: crypto.randomUUID(), nombre: "Ingles", nivel: "avanzado" },
    ],
    referencias: [
      {
        id: crypto.randomUUID(),
        nombre: "Referencia Laboral",
        cargo: "Gerente de Operaciones",
        empresa: aleatorio(EMPRESAS),
        email: "referencia-laboral-1@example.com",
        telefono: TELEFONO_MOCK,
        relacion: "Jefe directo",
      },
      {
        id: crypto.randomUUID(),
        nombre: "Referencia Laboral 2",
        cargo: "Lider de Proyecto",
        empresa: aleatorio(EMPRESAS),
        email: "referencia-laboral-2@example.com",
        telefono: TELEFONO_MOCK,
        relacion: "Colega de equipo",
      },
    ],
    disponibilidad: "Inmediata",
    pretensionesRenta: "",
  }
}

const TAPS_REQUERIDOS = 5
const VENTANA_MS = 2000

interface BarraAccionesProps {
  modo: Modo
}

export function BarraAcciones({ modo }: BarraAccionesProps) {
  const [descargando, setDescargando] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [ejemploAbierto, setEjemploAbierto] = useState(false)
  const datos = useCurriculumStore((s) => s.datos)
  const carta = useCurriculumStore((s) => s.carta)
  const personalizacion = useCurriculumStore((s) => s.personalizacion)
  const reiniciarStore = useCurriculumStore((s) => s.reiniciar)
  const setDatos = useCurriculumStore((s) => s.setDatos)
  const setPersonalizacion = useCurriculumStore((s) => s.setPersonalizacion)
  const tapsRef = useRef<number[]>([])
  const menuRef = useRef<HTMLDivElement>(null)
  const inputArchivoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!menuAbierto) return
    function handleClickFuera(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuAbierto(false)
    }
    document.addEventListener("mousedown", handleClickFuera)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickFuera)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [menuAbierto])

  function exportar() {
    exportarJson(datos, personalizacion)
    setMenuAbierto(false)
  }

  function pedirImportar() {
    inputArchivoRef.current?.click()
    setMenuAbierto(false)
  }

  async function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    e.target.value = ""
    if (!archivo) return
    const resultado = await importarJson(archivo)
    if (!resultado.ok) {
      window.alert(`No se pudo importar: ${resultado.error}`)
      return
    }
    if (!window.confirm("Esto reemplazará los datos actuales. ¿Continuar?")) return
    setDatos(resultado.datos)
    setPersonalizacion(resultado.personalizacion)
  }

  function handleTapTitulo() {
    const ahora = Date.now()
    tapsRef.current = tapsRef.current.filter((t) => ahora - t < VENTANA_MS)
    tapsRef.current.push(ahora)
    if (tapsRef.current.length >= TAPS_REQUERIDOS) {
      tapsRef.current = []
      useCurriculumStore.setState({ datos: generarDatosMock() })
    }
  }

  function reiniciar() {
    if (window.confirm("¿Seguro que quieres reiniciar? Se borrarán todos los datos del curriculum.")) {
      reiniciarStore()
    }
  }
  const { tema, setTema } = useTema()

  async function descargar() {
    setDescargando(true)
    try {
      if (modo === "carta") {
        const { generarPdfCarta } = await import("@/lib/generar-pdf-carta")
        generarPdfCarta(datos, carta, personalizacion)
      } else {
        const { generarPdf } = await import("@/lib/generar-pdf")
        await generarPdf(datos, personalizacion)
      }
    } finally {
      setDescargando(false)
    }
  }

  return (
    <div data-no-print className="flex items-center justify-between border-b border-ds-line bg-ds-surface px-3 py-2.5 md:px-4">
      <div className="flex items-center gap-1.5 min-w-0">
        <h1
          className="text-base font-extrabold text-ds-ink truncate cursor-default select-none"
          onClick={handleTapTitulo}
        >
          <span className="md:hidden">CV Gratis</span>
          <span className="hidden md:inline">Generador de Curriculum</span>
        </h1>
        <span className="hidden md:inline text-xs text-ds-ink-muted">·</span>
        <span className="hidden md:inline text-xs text-ds-ink-muted shrink-0">100% gratuito</span>
      </div>
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={() => setEjemploAbierto(true)}>
          <EyeIcon size={16} />
          Ver ejemplo
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setEjemploAbierto(true)} title="Ver ejemplo">
          <EyeIcon size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          onClick={() => setTema(CICLO_TEMA[tema])}
          title={ETIQUETA_TEMA[tema]}
        >
          {ICONO_TEMA[tema]}
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={reiniciar} title="Reiniciar">
          <ArrowCounterClockwiseIcon size={16} />
        </Button>
        <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={reiniciar}>
          <ArrowCounterClockwiseIcon size={16} />
          Reiniciar
        </Button>

        <div ref={menuRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuAbierto((v) => !v)}
            title="Mas opciones"
            aria-haspopup="menu"
            aria-expanded={menuAbierto}
          >
            <DotsThreeVerticalIcon size={18} />
          </Button>
          {menuAbierto && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1 z-50 min-w-[180px] border border-ds-line bg-ds-surface py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={exportar}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ds-ink-muted hover:bg-ds-surface-muted hover:text-ds-ink cursor-pointer"
              >
                <FileArrowDownIcon size={16} />
                Exportar JSON
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={pedirImportar}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ds-ink-muted hover:bg-ds-surface-muted hover:text-ds-ink cursor-pointer"
              >
                <FileArrowUpIcon size={16} />
                Importar JSON
              </button>
            </div>
          )}
          <input
            ref={inputArchivoRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleArchivo}
          />
        </div>

        <Button size="sm" className="whitespace-nowrap" onClick={descargar} disabled={descargando}>
          {descargando ? (
            <SpinnerIcon size={16} className="animate-spin" />
          ) : (
            <DownloadSimpleIcon size={16} />
          )}
          {descargando ? "Descargando..." : "Descargar PDF"}
        </Button>
      </div>
      <DialogEjemploCv abierto={ejemploAbierto} onCerrar={() => setEjemploAbierto(false)} />
    </div>
  )
}
