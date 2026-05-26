import type { Metadata } from "next"

export const SITE_URL = "https://curriculum-gratis.cl"
export const SITE_NAME = "Curriculum Gratis"
export const LOGO_URL = `${SITE_URL}/logo-512.png`
export const OG_IMAGE_URL = `${SITE_URL}/opengraph-image`
export const OG_IMAGE_ALT = "Curriculum Gratis - Crea tu CV Profesional y Descargalo en PDF"

export const ORGANIZATION = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: LOGO_URL,
}

export function absoluteUrl(path = "") {
  if (!path || path === "/") return SITE_URL
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function createBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function createPageMetadata({
  path,
  title,
  description,
}: {
  path: string
  title: string
  description: string
}): Metadata {
  const url = absoluteUrl(path)

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_CL",
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: OG_IMAGE_URL, alt: OG_IMAGE_ALT }],
    },
  }
}
