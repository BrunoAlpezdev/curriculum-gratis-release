import { SeoPage, type SeoPageContent } from "@/app/seo-pages"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  path: "/cv-ats-gratis",
  title: "CV ATS Gratis para Chile | Plantilla PDF Compatible",
  description:
    "Crea un CV ATS gratis para Chile. Usa una plantilla clara, revisa palabras clave contra una oferta laboral y descarga tu curriculum en PDF.",
})

const content: SeoPageContent = {
  path: "/cv-ats-gratis",
  eyebrow: "CV ATS gratis",
  title: "CV ATS gratis: curriculum claro para portales laborales",
  description:
    "Guia practica para crear un curriculum compatible con ATS, ordenar secciones, usar palabras clave de la oferta y descargar un PDF listo para postular.",
  shortAnswer: {
    title: "¿Como hacer un CV ATS gratis?",
    body: "Usa una plantilla sobria, escribe cargos y habilidades con las mismas palabras que aparecen en la oferta, agrega logros concretos y evita exceso de columnas, iconos o elementos decorativos. En Curriculum Gratis puedes revisar coincidencia ATS localmente y descargar el CV en PDF sin registro.",
  },
  primaryCta: { label: "Crear CV ATS gratis", href: "/editor?plantilla=clasico" },
  secondaryCta: { label: "Comparar plantillas", href: "/plantillas-cv-gratis" },
  primaryKeyword: "cv ats gratis",
  relatedKeywords: [
    "curriculum ats",
    "cv compatible con ats",
    "plantilla cv ats gratis",
    "cv para portales laborales",
    "hacer cv ats online",
  ],
  sections: [
    {
      title: "Que significa que un CV sea ATS",
      body: "ATS significa Applicant Tracking System: sistemas que muchas empresas y portales usan para ordenar postulaciones. Un CV ATS prioriza texto claro, secciones reconocibles y palabras clave relacionadas con el cargo.",
    },
    {
      title: "Como mejorar la coincidencia con una oferta",
      body: "Lee el aviso laboral y replica terminos importantes de forma natural: herramientas, seniority, funciones, industria, metodologias y habilidades tecnicas. No rellenes palabras sueltas; integra esos terminos en experiencia, perfil y habilidades.",
    },
    {
      title: "Plantillas recomendadas para ATS",
      body: "Las plantillas Clasico y Minimalista son las mejores para procesos automatizados porque reducen ruido visual y priorizan texto nativo. Las plantillas mas visuales pueden servir cuando envias el CV directo a una persona.",
    },
  ],
  faq: [
    {
      question: "¿Un CV ATS tiene que ser feo?",
      answer: "No. Debe ser claro y ordenado. Puede verse profesional sin abusar de elementos visuales que dificulten la lectura automatizada.",
    },
    {
      question: "¿Puedo analizar mi CV contra una oferta laboral?",
      answer: "Si. El editor incluye un analisis ATS local que compara palabras clave de la oferta con tu CV sin enviar esos datos al servidor.",
    },
    {
      question: "¿Que plantilla conviene para ATS?",
      answer: "Para ATS conviene partir con Clasico o Minimalista, porque son plantillas sobrias y faciles de leer.",
    },
    {
      question: "¿El PDF mantiene texto seleccionable?",
      answer: "Si usas plantillas ATS como Clasico o Minimalista, la descarga prioriza texto nativo en el PDF para mejorar lectura y seleccion.",
    },
  ],
}

export default function CvAtsGratisPage() {
  return <SeoPage content={content} />
}
