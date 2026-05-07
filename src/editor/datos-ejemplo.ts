import type { DatosCurriculum } from "@/types"

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

export function generarDatosMock(): DatosCurriculum {
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
