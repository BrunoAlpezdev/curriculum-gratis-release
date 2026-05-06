import type { Metadata } from "next"
import { Inter, Roboto, Lato, Merriweather, Libre_Baskerville } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-roboto" })
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato" })
const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-merriweather" })
const libreBaskerville = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-libre-baskerville" })

const clasesVariablesFuentes = [
  inter.variable,
  roboto.variable,
  lato.variable,
  merriweather.variable,
  libreBaskerville.variable,
].join(" ")

const SITE_URL = "https://curriculum-gratis.cl"
const TITLE = "Curriculum Vitae Gratis Chile 2026 | Crear CV en PDF"
const DESCRIPTION =
  "Crea tu curriculum vitae gratis en Chile. Usa plantillas CV profesionales, formato Harvard o ATS, personaliza tu CV y descargalo en PDF sin registro."

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s | Curriculum Gratis",
  },
  description: DESCRIPTION,
  keywords: [
    "curriculum gratis",
    "curriculum vitae gratis",
    "curriculum vitae chile",
    "curriculum vitae 2026",
    "cv gratis",
    "cv chile",
    "cv 2026",
    "crear curriculum",
    "crear cv",
    "crear cv gratis",
    "hacer cv gratis",
    "curriculum pdf",
    "curriculum online",
    "cv online gratis",
    "plantilla curriculum",
    "plantilla cv gratis",
    "plantillas cv gratis",
    "curriculum profesional",
    "hacer curriculum gratis",
    "generador de curriculum",
    "curriculum sin registro",
    "curriculum chile",
    "curriculum latinoamerica",
    "curriculum descargar pdf",
    "formato cv gratis",
    "formato curriculum vitae gratis",
    "formato harvard cv",
    "cv ats",
  ],
  authors: [{ name: "Curriculum Gratis" }],
  creator: "Curriculum Gratis",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Curriculum Gratis",
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
    <html lang="es" className={`${inter.className} ${clasesVariablesFuentes}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("tema");var d=t==="oscuro"||(t!=="claro"&&matchMedia("(prefers-color-scheme:dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Curriculum Gratis",
              url: SITE_URL,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "CLP" },
              description: DESCRIPTION,
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
