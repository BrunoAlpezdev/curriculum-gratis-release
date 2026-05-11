import type { Metadata } from "next"
import { SeoPage, type SeoPageContent } from "@/app/seo-pages"

export const metadata: Metadata = {
  title: "Crear CV Gratis Online en Chile | PDF sin Registro",
  description:
    "Crea tu CV gratis online en Chile. Completa tus datos, elige una plantilla profesional y descarga tu curriculum vitae en PDF sin registro.",
  alternates: { canonical: "/crear-cv-gratis" },
}

const content: SeoPageContent = {
  eyebrow: "Crear CV gratis",
  title: "Crear CV gratis online en Chile y descargarlo en PDF",
  description:
    "Entrada directa para completar datos, revisar el CV y descargarlo en PDF. Ideal si ya quieres empezar, sin comparar formatos primero.",
  primaryCta: { label: "Crear mi CV ahora", href: "/editor" },
  secondaryCta: { label: "Ver plantillas primero", href: "/plantillas-cv-gratis" },
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
      body: "Esta pagina es la entrada rapida al editor. Completa datos personales, perfil profesional, experiencia, educacion, habilidades e idiomas; mientras escribes, la vista previa muestra el resultado antes de descargar.",
    },
    {
      title: "Sin registro y con datos privados",
      body: "No necesitas crear una cuenta para editar y descargar. La informacion queda guardada en tu navegador; solo se envia al servidor si usas funciones opcionales como correo o IA.",
    },
    {
      title: "Descarga tu curriculum en PDF",
      body: "Cuando el CV este listo, descargalo como PDF para enviarlo a empresas, subirlo a portales de empleo o adjuntarlo en postulaciones laborales. Si quieres elegir diseño antes, usa la pagina de plantillas.",
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
