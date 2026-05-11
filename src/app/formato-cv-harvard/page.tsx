import type { Metadata } from "next"
import { SeoPage, type SeoPageContent } from "@/app/seo-pages"

export const metadata: Metadata = {
  title: "Formato CV Harvard Gratis | Plantilla Sobria PDF",
  description:
    "Crea un CV con formato Harvard gratis. Usa una plantilla clasica, sobria y facil de leer, ideal para postulaciones profesionales y ATS.",
  alternates: { canonical: "/formato-cv-harvard" },
}

const content: SeoPageContent = {
  eyebrow: "Formato Harvard CV",
  title: "Formato CV Harvard gratis para un curriculum claro y profesional",
  description:
    "Pagina enfocada en CV sobrio tipo Harvard: estructura limpia, lectura rapida y plantillas compatibles con ATS.",
  primaryCta: { label: "Usar plantilla Clasico", href: "/editor?plantilla=clasico" },
  secondaryCta: { label: "Comparar plantillas ATS", href: "/plantillas-cv-gratis" },
  primaryKeyword: "formato harvard cv",
  relatedKeywords: [
    "cv harvard",
    "harvard cv",
    "cv formato harvard",
    "formato cv harvard",
    "plantilla cv harvard gratis",
  ],
  sections: [
    {
      title: "Que caracteriza a un CV estilo Harvard",
      body: "Un CV tipo Harvard usa una estructura sobria, jerarquia clara, secciones ordenadas y poco ruido visual. El foco esta en experiencia, logros, educacion y habilidades relevantes.",
    },
    {
      title: "Cuando conviene usar este formato",
      body: "Conviene para postulaciones corporativas, cargos administrativos, tecnologia, finanzas, operaciones, mineria, salud o cualquier proceso donde la claridad pese mas que el diseño llamativo.",
    },
    {
      title: "Como hacerlo gratis",
      body: "Usa la plantilla Clasico si quieres una estructura Harvard directa, o Minimalista si prefieres una version mas ligera. Completa tus datos, revisa que el CV no se extienda innecesariamente y descarga el PDF final sin registro.",
    },
  ],
  faq: [
    {
      question: "¿El formato Harvard sirve para ATS?",
      answer: "Si. Al ser sobrio y ordenado, suele ser mas facil de leer para sistemas ATS que un CV excesivamente visual.",
    },
    {
      question: "¿Tiene que ser de una sola pagina?",
      answer: "No siempre, pero para muchos perfiles junior o semi senior una pagina clara suele funcionar mejor que dos paginas con informacion repetida.",
    },
    {
      question: "¿Puedo descargarlo en PDF?",
      answer: "Si. Puedes crear el CV con formato sobrio y descargarlo como PDF listo para enviar.",
    },
    {
      question: "¿Es lo mismo que una plantilla simple?",
      answer: "No exactamente. La clave no es solo que sea simple, sino que priorice estructura, jerarquia y lectura rapida.",
    },
  ],
}

export default function FormatoCvHarvardPage() {
  return <SeoPage content={content} />
}
