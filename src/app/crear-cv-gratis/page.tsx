import type { Metadata } from "next"
import { SeoPage, type SeoPageContent } from "@/app/seo-pages"

export const metadata: Metadata = {
  title: "Crear CV Gratis Online | Descargar en PDF sin Registro",
  description:
    "Crea tu CV gratis online en minutos. Completa tus datos, elige una plantilla profesional y descarga tu curriculum vitae en PDF sin registro.",
  alternates: { canonical: "/crear-cv-gratis" },
}

const content: SeoPageContent = {
  eyebrow: "Crear CV gratis",
  title: "Crear CV gratis online y descargarlo en PDF",
  description:
    "Una herramienta simple para hacer tu CV gratis desde el navegador, sin cuenta, sin pagos y sin marcas de agua.",
  primaryKeyword: "crear cv gratis",
  relatedKeywords: [
    "crear cv",
    "hacer cv gratis",
    "crear curriculum gratis",
    "crear cv online gratis",
    "creador de cv gratis",
  ],
  sections: [
    {
      title: "Como crear un CV gratis en minutos",
      body: "Completa tus datos personales, perfil profesional, experiencia, educacion, habilidades e idiomas. Mientras escribes, puedes ver una vista previa del curriculum para ajustar contenido antes de descargarlo.",
    },
    {
      title: "Sin registro y con datos privados",
      body: "No necesitas crear una cuenta ni entregar tu email. La informacion queda guardada en tu navegador, por eso puedes volver despues y seguir editando tu CV.",
    },
    {
      title: "Descarga tu curriculum en PDF",
      body: "Cuando el CV este listo, puedes descargarlo como PDF para enviarlo a empresas, subirlo a portales de empleo o adjuntarlo en postulaciones laborales.",
    },
  ],
  faq: [
    {
      question: "¿Crear el CV es realmente gratis?",
      answer: "Si. Puedes completar, personalizar y descargar tu CV en PDF sin pagar y sin marcas de agua.",
    },
    {
      question: "¿Necesito instalar algo?",
      answer: "No. El creador de CV funciona online desde el navegador, tanto en computador como en celular.",
    },
    {
      question: "¿Puedo editar mi CV despues?",
      answer: "Si. Tus datos quedan guardados localmente en tu navegador para que puedas volver y modificar el curriculum.",
    },
    {
      question: "¿Sirve para postulaciones en Chile?",
      answer: "Si. El formato esta pensado para crear un CV claro, profesional y facil de leer para procesos laborales en Chile.",
    },
  ],
}

export default function CrearCvGratisPage() {
  return <SeoPage content={content} />
}
