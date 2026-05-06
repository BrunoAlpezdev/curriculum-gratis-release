import Link from "next/link"
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

      <main className="bg-ds-paper text-ds-ink">
        <section className="border-b-4 border-ds-accent bg-ds-paper px-4 py-8 md:px-6 md:py-12">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_360px] md:items-start">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex border border-ds-accent bg-ds-surface px-3 py-1 text-sm font-bold text-ds-accent-strong">
                Curriculum gratis para Chile
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.04] tracking-tight text-ds-ink md:text-6xl">
                Cree su curriculum gratis y descárguelo en PDF
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-ds-ink-muted">
                Complete sus datos paso a paso, revise cómo queda y descargue un curriculum listo para enviar. No necesita registrarse ni saber usar programas complicados.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#editor"
                  className="inline-flex min-h-14 items-center justify-center bg-ds-accent px-6 text-base font-bold text-ds-surface transition hover:bg-ds-accent-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ds-accent"
                >
                  Empezar ahora
                </a>
                <a
                  href="#como-funciona"
                  className="inline-flex min-h-14 items-center justify-center border-2 border-ds-line-strong bg-ds-surface px-6 text-base font-bold text-ds-ink transition hover:bg-ds-surface-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ds-line-strong"
                >
                  Ver cómo funciona
                </a>
              </div>
              <ul className="mt-6 grid gap-2 text-base font-medium text-ds-ink-muted sm:grid-cols-2">
                {TRUST_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 bg-ds-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="border-2 border-ds-line-strong bg-ds-surface p-5">
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-ds-ink-muted">
                Antes de empezar
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-ds-ink">
                Tenga a mano su información laboral
              </h2>
              <p className="mt-3 text-base leading-7 text-ds-ink-muted">
                Puede completar solo lo que tenga. Si le falta algo, la herramienta igual funciona y puede volver después.
              </p>
              <div className="mt-5 border-t border-ds-line pt-4 text-sm leading-6 text-ds-ink-muted">
                Sirve para crear CV gratis, curriculum vitae gratis, formato CV simple y curriculum para postular en Chile.
              </div>
            </aside>
          </div>
        </section>

        <section id="como-funciona" className="border-b border-ds-line bg-ds-surface px-4 py-10 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-ds-accent-strong">
                Cómo funciona
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ds-ink md:text-4xl">
                Tres pasos, sin vueltas
              </h2>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {STEPS.map((step) => (
                <article key={step.number} className="border-2 border-ds-line-strong bg-ds-paper p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center bg-ds-accent text-lg font-extrabold text-ds-surface">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-xl font-extrabold text-ds-ink">{step.title}</h3>
                  <p className="mt-2 text-base leading-7 text-ds-ink-muted">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-ds-line bg-ds-paper px-4 py-10 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-[320px_1fr] md:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-ds-accent-strong">
                  Ayuda rápida
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ds-ink">
                  Elija lo que necesita
                </h2>
                <p className="mt-3 text-base leading-7 text-ds-ink-muted">
                  Estos accesos sirven si busca un formato específico o quiere entender qué tipo de curriculum le conviene.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {KEYWORD_GROUPS.map((group) => (
                  <Link
                    key={group.title}
                    href={group.href}
                    className="block border border-ds-line bg-ds-surface p-4 transition hover:border-ds-accent hover:bg-ds-accent-soft"
                  >
                    <h3 className="text-lg font-extrabold text-ds-ink">{group.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ds-ink-muted">{group.text}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="editor" className="scroll-mt-0" aria-label="Editor de curriculum vitae gratis">
          <Editor />
        </section>
      </main>
    </>
  )
}
