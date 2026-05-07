# Curriculum Gratis

Generador gratuito de curriculum vitae y cartas de presentacion para Chile. Permite completar datos profesionales, elegir plantilla, personalizar estilo y descargar documentos en PDF sin registro.

El proyecto esta pensado para ser simple de usar, privado por defecto y facil de mantener: los datos del usuario se guardan localmente en el navegador y la interfaz usa tokens/componentes reutilizables para evitar estilos sueltos.

## Caracteristicas

- Editor de CV con vista previa en tiempo real.
- Generador de carta de presentacion.
- Descarga PDF para CV y carta.
- Plantillas de CV clasica, minimalista, moderna y colorida.
- Plantillas ATS con PDF de texto nativo.
- Personalizacion de color, fuente, idioma y orden de secciones.
- Importacion/exportacion JSON.
- Analisis ATS local contra una oferta de trabajo.
- Paginas SEO para busquedas principales.
- Modo claro, oscuro y sistema.
- Sin registro: la informacion queda en `localStorage`.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand
- CVA
- jsPDF
- html2canvas-pro
- Phosphor Icons
- Vercel Analytics

## Requisitos

- Node.js compatible con Next.js 16
- pnpm

## Desarrollo

Instalar dependencias:

```bash
pnpm install
```

Levantar el servidor local:

```bash
pnpm dev
```

Abrir:

```text
http://localhost:3000
```

Comandos disponibles:

```bash
pnpm dev      # Servidor de desarrollo
pnpm build    # Build de produccion
pnpm start    # Servidor de produccion
pnpm lint     # ESLint
```

## Estructura

```text
src/
  app/          Rutas, metadata, sitemap, robots y paginas SEO
  components/   Atomos, moleculas y utilidades UI
  cv/           Plantillas renderizadas del CV y carta
  editor/       Formularios, preview y acciones del editor
  lib/          Store, constantes, PDF, formato, import/export
  types/        Tipos compartidos
```

## Arquitectura UI

La UI esta organizada para evitar estilos duplicados:

- `src/app/globals.css` define tokens semanticos globales: fondo, paneles, texto, bordes, acciones, estados, etc.
- `components/atoms/Button.tsx` centraliza todos los botones.
- `components/atoms/Text.tsx` centraliza estilos tipograficos.
- `components/atoms/Surface.tsx` centraliza fondos, paneles, tarjetas, barras y popovers.
- `components/atoms/Badge.tsx` centraliza etiquetas y estados visuales.
- `components/atoms/Input.tsx`, `Textarea.tsx`, `Select.tsx` y `SelectorFecha.tsx` centralizan controles de formulario.

Regla general: si una pantalla necesita verse como boton, tarjeta, panel, texto, badge o control, debe usar el atomo correspondiente. No agregar estilos visuales sueltos salvo que sean layout especifico de esa pantalla.

## Datos y privacidad

Los datos se almacenan en el navegador con Zustand persist usando la clave:

```text
curriculum-gratis
```

La importacion JSON normaliza datos antes de entrar al store para evitar estados invalidos o formatos antiguos incompletos.

## Generacion de PDF

Hay dos caminos:

- Plantillas ATS (`clasico`, `minimalista`): PDF con texto nativo mediante jsPDF.
- Plantillas visuales (`moderno`, `colorido`): captura visual con html2canvas-pro y exportacion con jsPDF.

Archivos principales:

```text
src/lib/generar-pdf.ts
src/lib/generar-pdf-ats.ts
src/lib/generar-pdf-carta.ts
```

## SEO

El sitio usa:

- Metadata de Next.js.
- Open Graph image generada con `next/og`.
- `sitemap.ts`.
- `robots.ts`.
- Paginas especificas para keywords principales:
  - `/crear-cv-gratis`
  - `/plantillas-cv-gratis`
  - `/cv-chile`
  - `/formato-cv-harvard`

## Ramas y despliegue

- `main`: rama estable.
- `dev`: cambios en revision y preview de Vercel.

Los cambios se trabajan primero en `dev` para revisar preview antes de llevarlos a `main`.

## Notas para contribuir

- Mantener nombres de variables, funciones, tipos y archivos en espanol cuando sea codigo propio del dominio.
- Leer `node_modules/next/dist/docs/` antes de tocar APIs de Next.js 16.
- No duplicar estilos de UI que ya existan en atomos.
- No editar `pnpm-lock.yaml` manualmente.
- No agregar datos sensibles ni archivos `.env`.
- Ejecutar antes de subir:

```bash
pnpm lint
pnpm build
```
