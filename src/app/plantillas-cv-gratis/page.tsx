import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"
import { Badge } from "@/components/atoms/Badge"
import { buttonVariants } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { SiteFooter } from "@/components/molecules/SiteFooter"
import { SiteHeader } from "@/components/molecules/SiteHeader"
import { TemplateOptionCard } from "@/components/molecules/TemplateOptionCard"
import { cn } from "@/components/ui/cn"
import { PLANTILLAS } from "@/lib/constantes"

export const metadata: Metadata = {
  title: "Plantillas CV Gratis | Formatos Profesionales en PDF",
  description:
    "Elige plantillas CV gratis: clasica, moderna, colorida o minimalista. Personaliza colores, fuente y descarga tu curriculum en PDF.",
  alternates: { canonical: "/plantillas-cv-gratis" },
}

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Que plantilla de CV conviene usar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para procesos tradicionales conviene una plantilla clasica o minimalista. Para perfiles creativos, comerciales o roles donde conviene destacar competencias, puedes usar una plantilla mas visual.",
      },
    },
    {
      "@type": "Question",
      name: "¿Las plantillas son gratis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si. Puedes usar las plantillas de CV, personalizarlas y descargar el PDF sin pagar.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo cambiar de plantilla despues?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si. Puedes cambiar de plantilla y ver el resultado inmediatamente en la vista previa.",
      },
    },
    {
      "@type": "Question",
      name: "¿Hay plantillas compatibles con ATS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si. Las plantillas Clasico y Minimalista estan pensadas para mejor lectura en procesos ATS.",
      },
    },
  ],
}

export default function PlantillasCvGratisPage() {
  return (
    <Surface variant="page" className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <SiteHeader />
      <Surface as="main" variant="page">
        <Surface as="section" variant="hero" className="px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto max-w-6xl">
            <Badge variant="accent" size="md" className="mb-5">
              Plantillas CV gratis
            </Badge>
            <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <Text as="h1" variant="heroDisplay" className="max-w-4xl">
                  Elige una plantilla segun tu postulacion.
                </Text>
                <Text variant="bodyLarge" className="mt-5 max-w-3xl">
                  No todos los CV necesitan verse iguales. Usa una plantilla ATS para portales laborales o una visual cuando quieras destacar estilo, competencias y presencia.
                </Text>
              </div>
              <Surface variant="heroCard" className="p-5">
                <Text as="p" variant="metric">
                  4
                </Text>
                <Text as="h2" variant="strong" className="mt-2 text-lg font-extrabold">
                  plantillas listas
                </Text>
                <Text variant="small" className="mt-2 leading-6">
                  Todas comparten el mismo editor, colores, fuentes, carta, copias locales, IA opcional y descarga PDF.
                </Text>
              </Surface>
            </div>
          </div>
        </Surface>

        <section className="px-4 py-10 md:px-6" aria-label="Selector de plantillas CV">
          <div className="mx-auto flex max-w-6xl flex-col gap-5">
            {PLANTILLAS.map((plantilla) => (
              <TemplateOptionCard
                key={plantilla.valor}
                id={plantilla.valor}
                nombre={plantilla.etiqueta}
                descripcion={plantilla.descripcion}
                ats={plantilla.ats}
              />
            ))}
          </div>
        </section>

        <Surface as="section" variant="strip" className="px-4 py-10 md:px-6">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <Text as="h2" variant="sectionTitle" className="md:text-3xl">
                ¿No sabes cual elegir?
              </Text>
              <Text className="mt-3 max-w-2xl">
                Si postulas por portales masivos, parte con Clasico o Minimalista. Si enviaras el CV directo a una persona, Moderno o Colorido pueden ayudarte a diferenciarte.
              </Text>
            </div>
            <Link href="/#editor" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "min-h-14 border-2") }>
              Empezar sin elegir
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </Surface>
      </Surface>
      <SiteFooter />
    </Surface>
  )
}
