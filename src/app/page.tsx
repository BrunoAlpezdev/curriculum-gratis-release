import Link from "next/link"
import {
  CheckCircleIcon,
  EnvelopeIcon,
  FilePdfIcon,
  FileTextIcon,
  MagicWandIcon,
  ShieldCheckIcon,
  TargetIcon,
} from "@phosphor-icons/react/dist/ssr"
import { Badge } from "@/components/atoms/Badge"
import { buttonVariants } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { MarketingValueCard } from "@/components/molecules/MarketingValueCard"
import { SiteFooter } from "@/components/molecules/SiteFooter"
import { SiteHeader } from "@/components/molecules/SiteHeader"
import { cn } from "@/components/ui/cn"

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
        text: "No. Tus datos se guardan automaticamente en tu navegador para editar y descargar. Solo se envian al servidor si usas funciones opcionales como correo o IA.",
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
    title: "Crear curriculum vitae gratis",
    href: "/crear-cv-gratis",
    text: "Completa tus datos y descarga un curriculum vitae en PDF sin registro.",
  },
  {
    title: "Plantillas CV gratis",
    href: "/plantillas-cv-gratis",
    text: "Elige una plantilla simple, moderna, Harvard o compatible con ATS.",
  },
  {
    title: "Formato CV Harvard",
    href: "/formato-cv-harvard",
    text: "Usa un curriculum sobrio, claro y facil de leer para procesos exigentes.",
  },
  {
    title: "CV Chile 2026",
    href: "/cv-chile",
    text: "Arma un curriculum pensado para trabajos y postulaciones en Chile.",
  },
]

const TRUST_ITEMS = [
  "Gratis",
  "Sin registro",
  "Correo opcional",
  "Edicion local en su navegador",
]

const HERO_VALUES = [
  {
    icon: <FilePdfIcon size={17} weight="fill" />,
    title: "PDF listo para postular",
    text: "Descarga CV y carta con plantillas profesionales.",
  },
  {
    icon: <TargetIcon size={17} weight="fill" />,
    title: "ATS local",
    text: "Compara tu CV contra una oferta sin enviar datos.",
  },
  {
    icon: <MagicWandIcon size={17} weight="fill" />,
    title: "IA opcional",
    text: "Mejora perfil y carta solo cuando tu lo decides.",
  },
]

const PACKAGE_ITEMS = [
  { icon: <FileTextIcon size={15} />, label: "CV editable", value: "local" },
  { icon: <TargetIcon size={15} />, label: "Checklist + ATS", value: "incluido" },
  { icon: <EnvelopeIcon size={15} />, label: "Envio por correo", value: "opcional" },
  { icon: <ShieldCheckIcon size={15} />, label: "Copias locales", value: "seguro" },
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

      <Surface variant="page">
        <SiteHeader />
        <Surface as="main" variant="page">
          <Surface as="section" variant="hero" className="px-4 py-10 md:px-6 md:py-16">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
              <div className="max-w-4xl">
                <Badge variant="accent" size="md" className="mb-5">
                  Curriculum gratis para Chile
                </Badge>
                <Text as="h1" variant="heroDisplay">
                  Tu postulacion lista, no solo tu CV.
                </Text>
                <Text variant="bodyLarge" className="mt-6 max-w-2xl">
                  Arma un curriculum claro, revisa compatibilidad ATS, genera carta de presentacion y descarga el PDF sin registro. IA y correo estan disponibles solo si quieres usarlos.
                </Text>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/editor"
                    className={cn(buttonVariants({ variant: "primary", size: "lg" }), "min-h-14 text-base")}
                  >
                    Crear mi CV gratis
                  </Link>
                  <Link
                    href="/plantillas-cv-gratis"
                    className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "min-h-14 border-2 text-base")}
                  >
                    Ver plantillas
                  </Link>
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {HERO_VALUES.map((item) => (
                    <MarketingValueCard key={item.title} {...item} />
                  ))}
                </div>
              </div>

              <Surface as="aside" variant="heroCard" className="p-5">
                <div className="flex items-start justify-between gap-3 border-b-2 border-border-strong pb-4">
                  <div>
                    <Text variant="eyebrow" className="text-text-muted">
                      Paquete de postulacion
                    </Text>
                    <Text as="h2" variant="panelTitle" className="mt-2">
                      CV + carta + revision
                    </Text>
                  </div>
                  <Badge variant="solid">2026</Badge>
                </div>

                <div className="mt-4 grid gap-2">
                  {PACKAGE_ITEMS.map((item) => (
                    <Surface key={item.label} variant="metricCard" className="flex items-center justify-between gap-3 p-3">
                      <span className="flex items-center gap-2 text-sm font-bold text-text-main">
                        <span className="text-action-primary">{item.icon}</span>
                        {item.label}
                      </span>
                      <Badge variant="neutral">{item.value}</Badge>
                    </Surface>
                  ))}
                </div>

                <Surface variant="notice" className="mt-4 p-3">
                  <Text as="p" variant="strong" className="text-sm">
                    Empieza aunque no tengas todo listo
                  </Text>
                  <Text variant="caption" className="mt-1 leading-relaxed">
                    Completa lo que tengas, guarda copias locales y vuelve despues. El editor no exige cuenta.
                  </Text>
                </Surface>

                <ul className="mt-4 grid gap-2 text-sm font-semibold text-text-muted">
                  {TRUST_ITEMS.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircleIcon size={15} weight="fill" className="text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
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
        </Surface>
        <SiteFooter />
      </Surface>
    </>
  )
}
