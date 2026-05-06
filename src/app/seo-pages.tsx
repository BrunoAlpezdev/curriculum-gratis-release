import Link from "next/link"

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
    <main className="min-h-screen bg-ds-paper text-ds-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="border-b-4 border-ds-accent bg-ds-paper px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 inline-flex border border-ds-accent bg-ds-surface px-3 py-1 text-sm font-bold text-ds-accent-strong">
            {content.eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.06] tracking-tight md:text-6xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-ds-ink-muted">
            {content.description}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#editor"
              className="inline-flex min-h-14 items-center justify-center bg-ds-accent px-6 text-base font-bold text-ds-surface transition hover:bg-ds-accent-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ds-accent"
            >
              Empezar mi curriculum
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-14 items-center justify-center border-2 border-ds-line-strong bg-ds-surface px-6 text-base font-bold text-ds-ink transition hover:bg-ds-surface-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ds-line-strong"
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
              <article key={section.title} className="border-2 border-ds-line-strong bg-ds-surface p-6">
                <h2 className="text-2xl font-extrabold">{section.title}</h2>
                <p className="mt-3 text-base leading-8 text-ds-ink-muted">{section.body}</p>
              </article>
            ))}
          </div>

          <aside className="border-2 border-ds-line-strong bg-ds-surface-muted p-5 md:sticky md:top-4 md:self-start">
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-ds-ink-muted">
              También puede servirle
            </h2>
            <p className="mt-3 text-base font-extrabold text-ds-accent-strong">
              {content.primaryKeyword}
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-ds-ink-muted">
              {content.relatedKeywords.map((keyword) => (
                <li key={keyword} className="border-t border-ds-line pt-2 first:border-t-0 first:pt-0">
                  {keyword}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-t border-ds-line bg-ds-surface px-4 py-10 md:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-extrabold">Preguntas frecuentes</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {content.faq.map((item) => (
              <article key={item.question} className="border border-ds-line bg-ds-paper p-5">
                <h3 className="font-extrabold">{item.question}</h3>
                <p className="mt-2 text-base leading-7 text-ds-ink-muted">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
