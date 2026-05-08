import Link from "next/link"
import { GithubLogoIcon, HeartIcon } from "@phosphor-icons/react/dist/ssr"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"

const FOOTER_LINKS = [
  { href: "/crear-cv-gratis", label: "Crear CV gratis" },
  { href: "/plantillas-cv-gratis", label: "Plantillas" },
  { href: "/formato-cv-harvard", label: "Formato Harvard" },
  { href: "/cv-chile", label: "CV Chile" },
]

export function SiteFooter() {
  return (
    <Surface as="footer" variant="strip" className="border-t-2 border-border-strong px-4 py-8 md:px-6">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1fr_auto] md:items-start">
        <div className="max-w-2xl">
          <Text as="h2" variant="strong" className="text-lg font-extrabold">
            Curriculum Gratis
          </Text>
          <Text variant="small" className="mt-2 leading-6">
            Edita, revisa ATS, guarda copias locales y descarga tu CV desde el navegador. Las funciones de correo e IA son opcionales y solo envian datos cuando las usas.
          </Text>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://github.com/BrunoAlpezdev/curriculum-gratis-release"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-main hover:text-action-strong"
            >
              <GithubLogoIcon size={18} weight="fill" />
              GitHub
            </a>
            <a
              href="https://ko-fi.com/brunoalpezdev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-action-primary hover:text-action-strong"
            >
              <HeartIcon size={18} weight="fill" />
              Apoyar en Ko-fi
            </a>
          </div>
        </div>

        <nav aria-label="Links del sitio" className="grid gap-2 text-sm font-semibold text-text-muted sm:grid-cols-2 md:min-w-80">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="border-t border-border-subtle pt-2 hover:text-text-main">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </Surface>
  )
}
