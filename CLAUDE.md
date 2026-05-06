@AGENTS.md

# Curriculum Gratis

Generador de curriculum vitae gratuito. App web donde el usuario llena sus datos personales, experiencia, educacion, habilidades e idiomas, personaliza el estilo visual y descarga el CV en PDF.

**Todo el codebase usa nombres en espanol** — variables, tipos, funciones, constantes. Mantener esta convencion en todo codigo nuevo.

## Comandos

```bash
pnpm dev          # Servidor de desarrollo (Next.js)
pnpm build        # Build de produccion
pnpm lint         # ESLint (eslint-config-next)
```

## Estructura del Proyecto

```
src/
├── app/                  — App Router (layout, page, globals.css)
├── components/
│   ├── atoms/            — Componentes base: Button, Input, Select, Textarea, Chip
│   ├── molecules/        — Compuestos: SeccionFormulario, EntradaRepetible
│   └── ui/               — Utilidades: cn() (clsx + tailwind-merge)
├── lib/
│   ├── store.ts          — Zustand store con persist (clave: "curriculum-gratis")
│   └── constantes.ts     — Datos iniciales, colores de tema, niveles de idioma
└── types/
    └── index.ts          — Interfaces: DatosCurriculum, Experiencia, Educacion, etc.
```

## Convenciones

### Stack
- **Next.js 16** con App Router — leer `node_modules/next/dist/docs/` antes de usar APIs nuevas
- **React 19** — usar las APIs nuevas (use, useActionState, etc.) cuando corresponda
- **Tailwind CSS v4** — importar con `@import "tailwindcss"`, usar `@theme inline` para tokens
- **Zustand** con `persist` middleware — estado global en `src/lib/store.ts`
- **CVA** (class-variance-authority) para variantes de componentes tipadas
- **Phosphor Icons** — todos los iconos vienen de `@phosphor-icons/react`
- **@react-pdf/renderer** para generacion de PDF

### Patrones existentes
- Path alias: `@/*` apunta a `./src/*`
- Utility `cn()` en `@/components/ui/cn` — usar siempre para merge de clases
- Componentes atoms extienden los HTMLAttributes nativos (`ButtonHTMLAttributes`, etc.)
- IDs de formulario auto-derivados del label: `id ?? label.toLowerCase().replace(/\s+/g, "-")`
- Entidades con `id: string` generado via `crypto.randomUUID()`

## Reglas de Calidad

- No usar `any` — usar `unknown` con type narrowing
- `useEffect` solo para sincronizacion externa (APIs, browser APIs, timers)
- Preferir event handlers para actualizar estado en respuesta a interacciones
- No agregar features, refactors o "mejoras" mas alla de lo pedido
- No crear abstracciones para operaciones que solo se usan una vez
- Archivos fuente <= 400 lineas — dividir cuando se excedan
- No introducir vulnerabilidades de seguridad (XSS, inyeccion, etc.)
