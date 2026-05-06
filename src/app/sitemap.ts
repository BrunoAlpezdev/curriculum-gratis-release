import type { MetadataRoute } from "next"

const BASE_URL = "https://curriculum-gratis.cl"
const LAST_MODIFIED = new Date("2026-05-06")

const ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
}> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/crear-cv-gratis", priority: 0.9, changeFrequency: "monthly" },
  { path: "/plantillas-cv-gratis", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cv-chile", priority: 0.85, changeFrequency: "monthly" },
  { path: "/formato-cv-harvard", priority: 0.8, changeFrequency: "monthly" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
