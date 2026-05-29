import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { AplicarPlantillaUrl } from "@/editor/AplicarPlantillaUrl"
import { Editor } from "@/editor/Editor"

export const metadata: Metadata = {
  title: "Editor de CV Gratis (clasico)",
  description: "Version clasica del editor de curriculum vitae gratis, con todas las secciones en una sola vista.",
  alternates: { canonical: "/legacy/editor" },
  robots: {
    index: false,
    follow: false,
  },
}

export default function LegacyEditorPage() {
  return (
    <ClerkProvider>
      <main aria-label="Editor clasico de curriculum vitae gratis">
        <AplicarPlantillaUrl />
        <Editor />
      </main>
    </ClerkProvider>
  )
}
