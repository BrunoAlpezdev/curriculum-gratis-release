import Link from "next/link"
import { buttonVariants } from "@/components/atoms/Button"
import { cn } from "@/components/ui/cn"

export interface SeoPageContent {
  eyebrow: string
  title: string
  description: string
  primaryKeyword: string
  relatedKeywords: string[]
  sections: Array<{
    title: string
    body: string
  }>
  faq: Array<{
    question: string
    answer: string
  }>
}

interface SeoPageProps {
  content: SeoPageContent
}

export function SeoPage({ content }: SeoPageProps) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <main className="min-h-screen bg-app-bg text-text-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="border-b-4 border-action-primary bg-app-bg px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 inline-flex border border-action-primary bg-panel px-3 py-1 text-sm font-bold text-action-strong">
            {content.eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.06] tracking-tight md:text-6xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">
            {content.description}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#editor"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "min-h-14 text-base")}
            >
              Empezar mi curriculum
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "min-h-14 border-2 text-base")}
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-6">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[0.72fr_0.28fr]">
          <div className="space-y-5">
            {content.sections.map((section) => (
              <article key={section.title} className="border-2 border-border-strong bg-panel p-6">
                <h2 className="text-2xl font-extrabold">{section.title}</h2>
                <p className="mt-3 text-base leading-8 text-text-muted">{section.body}</p>
              </article>
            ))}
          </div>

          <aside className="border-2 border-border-strong bg-panel-muted p-5 md:sticky md:top-4 md:self-start">
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-text-muted">
              También puede servirle
            </h2>
            <p className="mt-3 text-base font-extrabold text-action-strong">
              {content.primaryKeyword}
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-text-muted">
              {content.relatedKeywords.map((keyword) => (
                <li key={keyword} className="border-t border-border-subtle pt-2 first:border-t-0 first:pt-0">
                  {keyword}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-t border-border-subtle bg-panel px-4 py-10 md:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-extrabold">Preguntas frecuentes</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {content.faq.map((item) => (
              <article key={item.question} className="border border-border-subtle bg-app-bg p-5">
                <h3 className="font-extrabold">{item.question}</h3>
                <p className="mt-2 text-base leading-7 text-text-muted">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
