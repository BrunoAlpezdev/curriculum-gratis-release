import Link from "next/link"
import { Badge } from "@/components/atoms/Badge"
import { buttonVariants } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
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
    <Surface as="main" variant="page" className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Surface as="section" variant="stripAccent" className="px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-5xl">
          <Badge variant="accent" size="md" className="mb-4">
            {content.eyebrow}
          </Badge>
          <Text as="h1" variant="pageTitle" className="max-w-4xl">
            {content.title}
          </Text>
          <Text variant="bodyLarge" className="mt-5 max-w-3xl">
            {content.description}
          </Text>
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
      </Surface>

      <section className="px-4 py-10 md:px-6">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[0.72fr_0.28fr]">
          <div className="space-y-5">
            {content.sections.map((section) => (
              <Surface as="article" key={section.title} variant="cardStrong" className="p-6">
                <Text as="h2" variant="panelTitle">{section.title}</Text>
                <Text className="mt-3 leading-8">{section.body}</Text>
              </Surface>
            ))}
          </div>

          <Surface as="aside" variant="panelMuted" className="border-2 border-border-strong p-5 md:sticky md:top-4 md:self-start">
            <Text as="h2" variant="eyebrow" className="text-text-muted">
              También puede servirle
            </Text>
            <Text className="mt-3 font-extrabold text-action-strong">
              {content.primaryKeyword}
            </Text>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-text-muted">
              {content.relatedKeywords.map((keyword) => (
                <li key={keyword} className="border-t border-border-subtle pt-2 first:border-t-0 first:pt-0">
                  {keyword}
                </li>
              ))}
            </ul>
          </Surface>
        </div>
      </section>

      <Surface as="section" variant="strip" className="px-4 py-10 md:px-6">
        <div className="mx-auto max-w-5xl">
          <Text as="h2" variant="sectionTitle" className="md:text-3xl">Preguntas frecuentes</Text>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {content.faq.map((item) => (
              <Surface as="article" key={item.question} variant="cardOnPage" className="border p-5">
                <Text as="h3" variant="strong" className="font-extrabold">{item.question}</Text>
                <Text className="mt-2">{item.answer}</Text>
              </Surface>
            ))}
          </div>
        </div>
      </Surface>
    </Surface>
  )
}
