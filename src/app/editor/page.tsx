import type { Metadata } from "next"
import { AplicarPlantillaUrl } from "@/editor/AplicarPlantillaUrl"
import { Editor } from "@/editor/Editor"

export const metadata: Metadata = {
  title: "Editor de CV Gratis",
  description: "Editor dedicado para crear, revisar y descargar tu curriculum vitae gratis.",
  alternates: { canonical: "/editor" },
  robots: {
    index: false,
    follow: true,
  },
}

export default function EditorPage() {
  return (
    <main aria-label="Editor de curriculum vitae gratis">
      <AplicarPlantillaUrl />
      <Editor />
    </main>
  )
}
