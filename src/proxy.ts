import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware()

export const config = {
  // El middleware de Clerk solo corre donde se usa auth: el editor y las rutas
  // de API. Las paginas publicas (home y SEO) quedan fuera para no pagar el
  // costo de Clerk en cada request ni en el cold start.
  matcher: [
    "/editor/:path*",
    "/editor",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
}
