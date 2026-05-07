import Link from "next/link"
import { Badge } from "@/components/atoms/Badge"
import { buttonVariants } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { cn } from "@/components/ui/cn"
import { Editor } from "@/editor/Editor"

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Curriculum Gratis",
  url: "https://curriculum-gratis.cl",
  description:
    "Creador de curriculum vitae gratis para Chile. Crea tu CV 2026 con plantillas profesionales, formato Harvard, opciones ATS y descarga en PDF sin registro.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CLP",
  },
  featureList: [
    "Crear curriculum vitae gratis",
    "Crear CV gratis en Chile",
    "4 plantillas profesionales",
    "Formato Harvard y plantillas ATS",
    "7 colores personalizables",
    "Descarga en PDF",
    "Sin registro ni cuenta",
    "Datos guardados en tu navegador",
  ],
  inLanguage: "es",
}

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Es realmente gratis crear un curriculum?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si, 100% gratis. No pedimos registro, no hay pagos ocultos, no hay marcas de agua. Creas tu CV y lo descargas en PDF sin costo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito crear una cuenta?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Tus datos se guardan automaticamente en tu navegador. No necesitas cuenta, email ni contrasena.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo descargar mi curriculum en PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si. Haz click en Descargar PDF y se descarga automaticamente. El PDF es de alta calidad, listo para enviar a empleadores.",
      },
    },
    {
      "@type": "Question",
      name: "¿Que plantillas de curriculum tienen disponibles?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tenemos 4 plantillas: Clasico (estilo Harvard), Moderno (con sidebar), Colorido (con header grande y formas decorativas), y Minimalista (plano y elegante). Todas son personalizables con 7 colores.",
      },
    },
    {
      "@type": "Question",
      name: "¿Sirve para crear un CV en Chile en 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si. La herramienta esta pensada para crear un curriculum vitae claro, profesional y actualizado para postulaciones laborales en Chile durante 2026.",
      },
    },
    {
      "@type": "Question",
      name: "¿Tiene formato Harvard y CV ATS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si. Puedes usar plantillas sobrias como Clasico y Minimalista, ideales para un curriculum tipo Harvard o compatible con sistemas ATS.",
      },
    },
  ],
}

const HOW_TO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como crear un curriculum vitae gratis en Chile",
  description:
    "Guia rapida para hacer un CV gratis online, elegir una plantilla profesional y descargar el curriculum en PDF.",
  totalTime: "PT10M",
  step: [
    {
      "@type": "HowToStep",
      name: "Completa tus datos personales",
      text: "Agrega nombre, cargo, contacto, ubicacion, enlaces profesionales y perfil laboral.",
    },
    {
      "@type": "HowToStep",
      name: "Agrega experiencia y educacion",
      text: "Incluye tus trabajos, estudios, cursos, proyectos, habilidades, idiomas y referencias.",
    },
    {
      "@type": "HowToStep",
      name: "Elige una plantilla de CV",
      text: "Selecciona una plantilla clasica, moderna, colorida o minimalista, con colores y fuente personalizables.",
    },
    {
      "@type": "HowToStep",
      name: "Descarga tu CV en PDF",
      text: "Revisa la vista previa y descarga tu curriculum vitae en PDF listo para postular.",
    },
  ],
}

const KEYWORD_GROUPS = [
  {
    title: "Crear un curriculum gratis",
    href: "/crear-cv-gratis",
    text: "Para completar sus datos y descargar un PDF sin registrarse.",
  },
  {
    title: "Ver plantillas de CV",
    href: "/plantillas-cv-gratis",
    text: "Para elegir un diseño simple, moderno o más tradicional.",
  },
  {
    title: "Usar formato simple",
    href: "/formato-cv-harvard",
    text: "Para postulaciones donde importa que el curriculum sea claro y fácil de leer.",
  },
  {
    title: "Hacer un CV para Chile",
    href: "/cv-chile",
    text: "Para armar un curriculum pensado para trabajos y postulaciones en Chile.",
  },
]

const TRUST_ITEMS = [
  "Gratis",
  "Sin registro",
  "Sin pedir correo",
  "Sus datos quedan en su navegador",
]

const STEPS = [
  {
    number: "1",
    title: "Complete sus datos",
    text: "Escriba su información personal, experiencia, estudios y habilidades.",
  },
  {
    number: "2",
    title: "Revise cómo queda",
    text: "La vista previa muestra el curriculum mientras usted lo completa.",
  },
  {
    number: "3",
    title: "Descargue el PDF",
    text: "Guarde su CV listo para enviar por correo o subir a portales de trabajo.",
  },
]

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOW_TO_JSON_LD) }}
      />

      <Surface as="main" variant="page">
        <Surface as="section" variant="stripAccent" className="px-4 py-8 md:px-6 md:py-12">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_360px] md:items-start">
            <div className="max-w-3xl">
              <Badge variant="accent" size="md" className="mb-4">
                Curriculum gratis para Chile
              </Badge>
              <Text as="h1" variant="hero">
                Cree su curriculum gratis y descárguelo en PDF
              </Text>
              <Text variant="bodyLarge" className="mt-5 max-w-2xl">
                Complete sus datos paso a paso, revise cómo queda y descargue un curriculum listo para enviar. No necesita registrarse ni saber usar programas complicados.
              </Text>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#editor"
                  className={cn(buttonVariants({ variant: "primary", size: "lg" }), "min-h-14 text-base")}
                >
                  Empezar ahora
                </a>
                <a
                  href="#como-funciona"
                  className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "min-h-14 border-2 text-base")}
                >
                  Ver cómo funciona
                </a>
              </div>
              <ul className="mt-6 grid gap-2 text-base font-medium text-text-muted sm:grid-cols-2">
                {TRUST_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Badge size="sm" variant="solid" className="h-2.5 w-2.5 p-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Surface as="aside" variant="cardStrong" className="p-5">
              <Text variant="eyebrow" className="text-text-muted">
                Antes de empezar
              </Text>
              <Text as="h2" variant="panelTitle" className="mt-2">
                Tenga a mano su información laboral
              </Text>
              <Text className="mt-3">
                Puede completar solo lo que tenga. Si le falta algo, la herramienta igual funciona y puede volver después.
              </Text>
              <Text as="div" variant="small" className="mt-5 border-t border-border-subtle pt-4 leading-6">
                Sirve para crear CV gratis, curriculum vitae gratis, formato CV simple y curriculum para postular en Chile.
              </Text>
            </Surface>
          </div>
        </Surface>

        <Surface as="section" id="como-funciona" variant="strip" className="px-4 py-10 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <Text variant="eyebrow">
                Cómo funciona
              </Text>
              <Text as="h2" variant="sectionTitle" className="mt-2">
                Tres pasos, sin vueltas
              </Text>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {STEPS.map((step) => (
                <Surface as="article" key={step.number} variant="cardOnPage" className="p-5">
                  <Badge variant="solid" size="square">
                    {step.number}
                  </Badge>
                  <Text as="h3" variant="cardTitle" className="mt-4 text-xl">{step.title}</Text>
                  <Text className="mt-2">{step.text}</Text>
                </Surface>
              ))}
            </div>
          </div>
        </Surface>

        <Surface as="section" variant="page" className="border-b border-border-subtle px-4 py-10 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-[320px_1fr] md:items-start">
              <div>
                <Text variant="eyebrow">
                  Ayuda rápida
                </Text>
                <Text as="h2" variant="sectionTitle" className="mt-2 md:text-3xl">
                  Elija lo que necesita
                </Text>
                <Text className="mt-3">
                  Estos accesos sirven si busca un formato específico o quiere entender qué tipo de curriculum le conviene.
                </Text>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {KEYWORD_GROUPS.map((group) => (
                  <Surface
                    as={Link}
                    variant="interactiveCard"
                    key={group.title}
                    href={group.href}
                    className="block p-4"
                  >
                    <Text as="h3" variant="cardTitle">{group.title}</Text>
                    <Text variant="small" className="mt-2 leading-6">{group.text}</Text>
                  </Surface>
                ))}
              </div>
            </div>
          </div>
        </Surface>

        <section id="editor" className="scroll-mt-0" aria-label="Editor de curriculum vitae gratis">
          <Editor />
        </section>
      </Surface>
    </>
  )
}
