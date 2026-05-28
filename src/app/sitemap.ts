import type { MetadataRoute } from "next"

const BASE_URL = "https://www.curriculum-gratis.cl"

// Fecha del ultimo cambio de contenido. Se actualiza a mano cuando el contenido
// cambia de forma relevante; usar new Date() haria que cada crawl viera "todo
// cambio recien" y Google terminaria ignorando el lastModified.
const LAST_UPDATED = "2026-05-28"

const ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
}> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/crear-cv-gratis", priority: 0.9, changeFrequency: "monthly" },
  { path: "/plantillas-cv-gratis", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cv-chile", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cv-ats-gratis", priority: 0.85, changeFrequency: "monthly" },
  { path: "/formato-cv-harvard", priority: 0.8, changeFrequency: "monthly" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: LAST_UPDATED,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
