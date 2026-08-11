import type { DatosCurriculum } from "@/types"

function aleatorio<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

const PERFILES_MOCK = [
  {
    nombre: "Camila Rojas Fernández",
    titulo: "Ingeniera de Software Senior",
    email: "persona-ejemplo-01@example.com",
    perfil: "Ingeniera de software con 6 años de experiencia desarrollando aplicaciones web escalables. Especializada en React, Node.js y arquitectura de microservicios.",
    cargo1: "Ingeniera de Software Senior", cargo2: "Desarrolladora Full Stack",
    carrera: "Ingeniería Civil en Computación",
    habilidades: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS", "Git", "Scrum"],
  },
  {
    nombre: "Roberto Mamani Quispe",
    titulo: "Operador de Maquinaria Pesada",
    email: "persona-ejemplo-02@example.com",
    perfil: "Operador de maquinaria pesada con 12 años de experiencia en minería a gran escala. Certificado en operación de camiones Komatsu 930E y palas hidráulicas CAT 6060. Comprometido con la seguridad y el cumplimiento de protocolos operacionales.",
    cargo1: "Operador de Camión Minero", cargo2: "Operador de Pala Mecánica",
    carrera: "Técnico en Maquinaria Pesada",
    habilidades: ["Komatsu 930E", "CAT 6060", "Licencia D", "Seguridad Minera", "Mantención Preventiva", "Trabajo en Altura", "SAP PM", "Primeros Auxilios"],
  },
  {
    nombre: "Javiera Sepúlveda Araya",
    titulo: "Estilista Profesional",
    email: "persona-ejemplo-03@example.com",
    perfil: "Estilista profesional con 8 años de experiencia en corte, colorimetría y tratamientos capilares. Especializada en técnicas de balayage y alisados. Atención personalizada enfocada en resaltar la imagen de cada cliente.",
    cargo1: "Estilista Senior", cargo2: "Colorista",
    carrera: "Cosmetología y Estilismo Profesional",
    habilidades: ["Colorimetría", "Balayage", "Corte", "Alisado", "Tratamientos Capilares", "Atención al Cliente", "Keratina", "Maquillaje"],
  },
  {
    nombre: "Carlos Figueroa Tapia",
    titulo: "Encargado de Bodega e Inventario",
    email: "persona-ejemplo-04@example.com",
    perfil: "Profesional de logística con 6 años de experiencia en gestión de inventarios y control de bodega. Manejo avanzado de sistemas WMS y procesos de recepción, almacenamiento y despacho.",
    cargo1: "Encargado de Bodega", cargo2: "Asistente de Inventario",
    carrera: "Técnico en Logística",
    habilidades: ["WMS", "Control de Inventario", "SAP MM", "Despacho", "Recepción de Mercadería", "Excel", "Grúa Horquilla", "Picking"],
  },
  {
    nombre: "Valentina Muñoz Lagos",
    titulo: "Analista de Datos",
    email: "persona-ejemplo-05@example.com",
    perfil: "Analista de datos con experiencia en business intelligence y machine learning. Apasionada por transformar datos complejos en insights accionables para la toma de decisiones.",
    cargo1: "Data Analyst Senior", cargo2: "Analista de Business Intelligence",
    carrera: "Ingeniería en Informática",
    habilidades: ["Python", "SQL", "Power BI", "Tableau", "Pandas", "Machine Learning", "Excel Avanzado", "ETL"],
  },
  {
    nombre: "Sebastián Torres Medina",
    titulo: "Contador Auditor",
    email: "persona-ejemplo-06@example.com",
    perfil: "Contador auditor con 8 años de experiencia en auditoría financiera y tributaria. Especializado en IFRS, normativa tributaria chilena y optimización de procesos contables.",
    cargo1: "Contador Senior", cargo2: "Analista Contable",
    carrera: "Contabilidad y Auditoría",
    habilidades: ["IFRS", "Auditoría", "SAP", "Tributaria", "Excel Avanzado", "ERP", "Presupuestos", "Conciliaciones"],
  },
  {
    nombre: "Pedro Arancibia Cortés",
    titulo: "Soldador Certificado",
    email: "persona-ejemplo-07@example.com",
    perfil: "Soldador certificado con 10 años de experiencia en soldadura MIG, TIG y arco manual. Trabajo en plantas industriales, minería y construcción. Cumplimiento estricto de normas de seguridad y calidad AWS.",
    cargo1: "Soldador Especialista", cargo2: "Ayudante de Soldadura",
    carrera: "Técnico en Soldadura Industrial",
    habilidades: ["Soldadura MIG", "Soldadura TIG", "Arco Manual", "Lectura de Planos", "AWS D1.1", "Oxicorte", "Seguridad Industrial", "Esmerilado"],
  },
  {
    nombre: "María José Contreras Vega",
    titulo: "Técnica en Enfermería",
    email: "persona-ejemplo-08@example.com",
    perfil: "Técnica en enfermería con 5 años de experiencia en atención hospitalaria y ambulatoria. Especializada en cuidados del paciente crítico, toma de muestras y administración de medicamentos.",
    cargo1: "Técnica en Enfermería", cargo2: "Auxiliar de Enfermería",
    carrera: "Técnico en Enfermería",
    habilidades: ["Toma de Muestras", "Signos Vitales", "RCP", "Administración de Medicamentos", "Curaciones", "Atención al Paciente", "Registro Clínico", "Esterilización"],
  },
  {
    nombre: "Luis Henríquez Palma",
    titulo: "Electricista Industrial",
    email: "persona-ejemplo-09@example.com",
    perfil: "Electricista industrial con licencia SEC clase A, 9 años de experiencia en instalaciones eléctricas de media y baja tensión. Mantención preventiva y correctiva en plantas industriales y mineras.",
    cargo1: "Electricista Industrial", cargo2: "Ayudante Eléctrico",
    carrera: "Técnico en Electricidad Industrial",
    habilidades: ["Media Tensión", "Baja Tensión", "Licencia SEC A", "PLC", "Tableros Eléctricos", "Canalización", "Lectura de Planos", "Norma NCH 4/2003"],
  },
  {
    nombre: "Andrea Fuentes Castillo",
    titulo: "Vendedora Retail",
    email: "persona-ejemplo-10@example.com",
    perfil: "Profesional de ventas con 4 años de experiencia en retail y atención al cliente. Orientada al cumplimiento de metas y fidelización de clientes. Manejo de caja y reposición de productos.",
    cargo1: "Vendedora Senior", cargo2: "Cajera",
    carrera: "Administración de Empresas mención Marketing",
    habilidades: ["Atención al Cliente", "Ventas", "Caja", "Visual Merchandising", "SAP Retail", "Manejo de Inventario", "Postventa", "Trabajo en Equipo"],
  },
]

const EMPRESAS = [
  "TechCorp Chile", "Falabella", "Banco Estado", "LATAM Airlines", "Cencosud",
  "Minera Escondida", "Codelco", "SQM", "Sodimac", "Lider Express",
  "Clínica Alemana", "Hospital Regional", "Salón Estilo", "Beauty Center",
  "Constructora Echeverría", "Logística Andina", "Frigorífico del Sur",
]

const UBICACIONES = [
  "Santiago, Chile", "Valparaíso, Chile", "Concepción, Chile",
  "Antofagasta, Chile", "Calama, Chile", "Iquique, Chile",
  "Copiapó, Chile", "La Serena, Chile", "Temuco, Chile", "Rancagua, Chile",
]

const INSTITUCIONES = [
  "Universidad de Chile", "PUC Chile", "Universidad de Santiago",
  "UTFSM", "Duoc UC", "INACAP", "CFT Santo Tomás",
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
      rut: "12.345.678-9",
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
        descripcion: "Liderazgo técnico y desarrollo de soluciones de alto impacto. Colaboración directa con stakeholders para definir roadmap de producto.",
        logros: "Reducción de costos operativos en un 30%. Implementación de procesos que mejoraron la productividad del equipo.",
      },
      {
        id: crypto.randomUUID(),
        empresa: aleatorio(EMPRESAS),
        cargo: perfil.cargo2,
        ubicacion: aleatorio(UBICACIONES),
        fechaInicio: "2018-06",
        fechaFin: "2021-02",
        descripcion: "Desarrollo e implementación de proyectos clave para el área. Coordinación con equipos multidisciplinarios.",
        logros: "Reconocimiento como mejor profesional del área en 2020.",
      },
    ],
    educacion: [
      {
        id: crypto.randomUUID(),
        institucion: aleatorio(INSTITUCIONES),
        titulo: perfil.carrera,
        fechaInicio: "2013-03",
        fechaFin: "2018-01",
        descripcion: "Graduación con distinción. Participación activa en proyectos de investigación.",
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
      { id: crypto.randomUUID(), nombre: "Inglés", nivel: "avanzado" },
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
        cargo: "Líder de Proyecto",
        empresa: aleatorio(EMPRESAS),
        email: "referencia-laboral-2@example.com",
        telefono: TELEFONO_MOCK,
        relacion: "Colega de equipo",
      },
    ],
    seccionesDestacadas: [
      {
        id: crypto.randomUUID(),
        titulo: "Certificaciones",
        items: ["Scrum Fundamentals Certified"],
      },
    ],
    disponibilidad: "Inmediata",
    pretensionesRenta: "",
  }
}
