import type { Metadata } from "next"
import { SeoPage, type SeoPageContent } from "@/app/seo-pages"

export const metadata: Metadata = {
  title: "Plantillas CV Gratis | Formatos Profesionales en PDF",
  description:
    "Elige plantillas CV gratis: clasica, moderna, colorida o minimalista. Personaliza colores, fuente y descarga tu curriculum en PDF.",
  alternates: { canonical: "/plantillas-cv-gratis" },
}

const content: SeoPageContent = {
  eyebrow: "Plantillas CV gratis",
  title: "Plantillas CV gratis para descargar en PDF",
  description:
    "Usa plantillas profesionales de curriculum vitae gratis, personalizalas y descarga tu CV listo para postular.",
  primaryKeyword: "plantillas cv gratis",
  relatedKeywords: [
    "plantilla cv gratis",
    "cv plantillas gratis",
    "plantillas de cv gratis",
    "plantillas para cv gratis",
    "plantilla curriculum gratis",
  ],
  sections: [
    {
      title: "Plantillas para distintos estilos de postulacion",
      body: "Puedes elegir una plantilla clasica, moderna, colorida o minimalista. La idea no es decorar por decorar, sino presentar tu experiencia con una estructura clara y profesional.",
    },
    {
      title: "Personalizacion sin perder legibilidad",
      body: "Cambia colores, fuente e idioma del CV, pero manteniendo un formato facil de leer. En un curriculum, la jerarquia visual importa mas que los adornos.",
    },
    {
      title: "Plantillas gratis con descarga PDF",
      body: "Despues de completar tu informacion, la herramienta genera un PDF que puedes usar para enviar por correo, subir a portales de trabajo o imprimir.",
    },
  ],
  faq: [
    {
      question: "¿Que plantilla de CV conviene usar?",
      answer: "Para procesos tradicionales conviene una plantilla clasica o minimalista. Para perfiles creativos o comerciales puedes usar una plantilla mas visual.",
    },
    {
      question: "¿Las plantillas son gratis?",
      answer: "Si. Puedes usar las plantillas de CV, personalizarlas y descargar el PDF sin pagar.",
    },
    {
      question: "¿Puedo cambiar de plantilla despues?",
      answer: "Si. Puedes cambiar de plantilla y ver el resultado inmediatamente en la vista previa.",
    },
    {
      question: "¿Hay plantillas compatibles con ATS?",
      answer: "Si. Las plantillas mas sobrias, como Clasico y Minimalista, estan pensadas para mejor lectura en procesos ATS.",
    },
  ],
}

export default function PlantillasCvGratisPage() {
  return <SeoPage content={content} />
}
