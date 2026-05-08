import type { Metadata } from "next"
import { SeoPage, type SeoPageContent } from "@/app/seo-pages"

export const metadata: Metadata = {
  title: "CV Chile 2026 | Crear Curriculum Vitae Gratis en PDF",
  description:
    "Crea un CV para Chile en 2026. Formato profesional, plantillas gratis, opciones ATS y descarga en PDF sin registro.",
  alternates: { canonical: "/cv-chile" },
}

const content: SeoPageContent = {
  eyebrow: "CV Chile 2026",
  title: "CV Chile 2026: crea tu curriculum vitae gratis",
  description:
    "Guia practica para armar un curriculum pensado para procesos laborales en Chile, con secciones relevantes, claridad y descarga PDF.",
  primaryCta: { label: "Crear CV para Chile", href: "/#editor" },
  secondaryCta: { label: "Ver plantillas recomendadas", href: "/plantillas-cv-gratis" },
  primaryKeyword: "cv chile",
  relatedKeywords: [
    "cv 2026",
    "curriculum vitae chile",
    "curriculum 2026",
    "curriculum vitae 2026",
    "cv gratis",
  ],
  sections: [
    {
      title: "Que debe incluir un CV en Chile",
      body: "Un buen CV debe mostrar datos de contacto, perfil profesional, experiencia laboral, educacion, habilidades, cursos, idiomas y logros concretos. No alcanza con listar tareas: hay que mostrar impacto.",
    },
    {
      title: "CV actualizado para 2026",
      body: "Las postulaciones actuales valoran claridad, palabras clave del cargo, logros medibles y formatos faciles de leer. Por eso la herramienta combina plantillas visuales con opciones mas sobrias para ATS.",
    },
    {
      title: "Crear y descargar sin cuenta",
      body: "Puedes completar tu curriculum desde el navegador, guardar tus datos localmente y descargar el PDF sin registrarte. Esta pagina orienta el contenido para Chile; el editor es el mismo y mantiene las funciones opcionales de correo e IA solo cuando las activas.",
    },
  ],
  faq: [
    {
      question: "¿Este creador sirve para trabajos en Chile?",
      answer: "Si. El contenido, las secciones y el enfoque estan pensados para postulaciones laborales en Chile.",
    },
    {
      question: "¿Conviene poner pretensiones de renta?",
      answer: "Depende de la postulacion. La herramienta incluye el campo para que puedas usarlo cuando el aviso lo pida.",
    },
    {
      question: "¿Puedo hacer un CV ATS?",
      answer: "Si. Usa una plantilla sobria, escribe cargos y habilidades relevantes, y evita exceso de elementos decorativos.",
    },
    {
      question: "¿El CV se descarga en PDF?",
      answer: "Si. Puedes descargar tu curriculum vitae en PDF al terminar la edicion.",
    },
  ],
}

export default function CvChilePage() {
  return <SeoPage content={content} />
}
