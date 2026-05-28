import type { Metadata } from "next"
import Script from "next/script"
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { JsonLd } from "@/components/seo/JsonLd"
import { LOGO_URL, ORGANIZATION, SITE_NAME, SITE_URL } from "@/lib/seo"
import "./globals.css"

const TITLE = "Curriculum Vitae Gratis Chile 2026 | Crear CV en PDF"
const DESCRIPTION =
  "Crea tu curriculum vitae gratis en Chile. Usa plantillas CV profesionales, formato Harvard o ATS, personaliza tu CV y descargalo en PDF sin registro."

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@id": `${SITE_URL}/#organization`,
  ...ORGANIZATION,
}

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@id": `${SITE_URL}/#website`,
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "es-CL",
  publisher: { "@id": `${SITE_URL}/#organization` },
}

const SOFTWARE_JSON_LD = {
  "@context": "https://schema.org",
  "@id": `${SITE_URL}/#app`,
  "@type": "SoftwareApplication",
  name: "Curriculum Gratis",
  url: SITE_URL,
  image: LOGO_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CLP" },
  inLanguage: "es-CL",
  description: DESCRIPTION,
}

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s | Curriculum Gratis",
  },
  description: DESCRIPTION,
  authors: [{ name: "Curriculum Gratis" }],
  creator: "Curriculum Gratis",
  metadataBase: new URL(SITE_URL),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/logo-180.png", type: "image/png", sizes: "180x180" }],
    other: [{ rel: "icon", url: "/logo-512.png", type: "image/png", sizes: "512x512" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ClerkProvider>
          <Script id="tema-inicial" strategy="beforeInteractive">
            {`(function(){try{var t=localStorage.getItem("tema");var d=t==="oscuro"||(t!=="claro"&&matchMedia("(prefers-color-scheme:dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})()`}
          </Script>
          <JsonLd data={ORGANIZATION_JSON_LD} />
          <JsonLd data={WEBSITE_JSON_LD} />
          <JsonLd data={SOFTWARE_JSON_LD} />
          {children}
          <Analytics />
          <SpeedInsights />
        </ClerkProvider>
      </body>
    </html>
  )
}
