# Project Context

Este archivo es la fuente primaria de contexto del proyecto. Antes de grepear o asumir arquitectura, revisa y actualiza este documento. Si el codigo cambia de forma relevante, este archivo tambien debe cambiar.

## Resumen

`curriculum-gratis` es un generador gratuito de curriculum vitae y cartas de presentacion para Chile. La edicion principal funciona localmente sin cuentas ni base de datos: los datos viven en el navegador mediante Zustand persist y `localStorage`. Algunas funciones opcionales usan backend de Next.js dentro del mismo repo para email e IA.

Promesa actual del producto:

- Crear CV gratis sin registro.
- Crear carta de presentacion.
- Personalizar plantilla, color, fuente, idioma y orden de secciones.
- Ver preview en tiempo real.
- Descargar PDF.
- Exportar CV o carta como TXT/Markdown para copiar a portales laborales u otros editores.
- Importar/exportar datos como JSON.
- Guardar y restaurar copias locales del CV/carta en el mismo navegador.
- Enviar el CV por correo usando backend Next/Vercel cuando `RESEND_API_KEY` esta configurada.
- Mejorar redaccion del perfil profesional con Gemini cuando `GEMINI_API_KEY` esta configurada, con sugerencia revisable, regeneracion y copia local antes de aplicar.
- Generar cuerpo de carta de presentacion con Gemini desde CV, empresa, cargo y oferta opcional, con sugerencia revisable, regeneracion y copia local antes de aplicar.
- Analizar match ATS localmente contra una oferta laboral.
- Revisar calidad basica del CV con checklist local.
- Mantener privacidad por defecto: edicion, copias locales, checklist, ATS y descarga funcionan en el navegador; email e IA envian datos solo cuando el usuario activa esas funciones opcionales y el servidor no guarda esos datos.

## Stack

- Next.js 16 App Router.
- React 19.
- TypeScript.
- Tailwind CSS v4.
- Zustand para estado local persistido.
- jsPDF para PDF con texto nativo.
- html2canvas-pro para capturar plantillas visuales.
- Phosphor Icons.
- Vercel Analytics.

## Reglas Importantes

- Leer `node_modules/next/dist/docs/` antes de tocar APIs o convenciones de Next.js 16.
- Mantener nombres propios del dominio en espanol cuando el codigo ya sigue ese patron.
- No duplicar estilos visuales si existe un atomo reutilizable.
- No afirmar que todo es frontend-only: email e IA usan backend opcional. Mantener claro que la edicion principal sigue siendo local.
- Si se agrega backend de Next, debe vivir en este repo mediante Route Handlers o Server Actions y desplegar en Vercel junto con la app.
- No agregar secrets al repo. API keys van en variables de entorno de Vercel/local.

## Entrada Principal

- `src/app/page.tsx`: landing principal. Incluye JSON-LD de WebApplication, FAQ y HowTo, bloques SEO/trust, links a paginas SEO y CTA hacia `/editor`.
- `src/app/editor/page.tsx`: ruta dedicada del editor. No usa header ni footer global; renderiza `AplicarPlantillaUrl` + `Editor` y tiene metadata noindex.
- `src/app/layout.tsx`: metadata global, tema inicial antes de hidratacion, JSON-LD SoftwareApplication y Vercel Analytics.
- `src/editor/Editor.tsx`: shell client-side del editor dedicado. Controla modo `cv`/`carta`, tab mobile `editar`/`preview`, barra superior, panel de formulario y panel de vista previa.
- `src/components/molecules/SiteHeader.tsx` y `src/components/molecules/SiteFooter.tsx`: navegacion y cierre global para home/paginas SEO, con CTA al editor y copy de privacidad.
- `src/components/molecules/MarketingValueCard.tsx`: card reusable para bloques de valor en paginas de marketing/SEO.
- `src/components/molecules/TemplateOptionCard.tsx`: card reusable para mostrar plantillas y CTA con plantilla preseleccionada.
- `src/components/molecules/AiSuggestionPanel.tsx`: panel reusable para sugerencias IA; centraliza aviso, aplicar, regenerar y descartar.
- `src/editor/AplicarPlantillaUrl.tsx`: aplica `?plantilla=<id>` al store cuando carga `/editor`.

## Estado y Datos

- `src/lib/store.ts`: store central Zustand persistido con clave `curriculum-gratis`.
- `src/types/index.ts`: tipos compartidos del dominio: `DatosCurriculum`, `DatosPersonales`, `Experiencia`, `Educacion`, `Curso`, `Proyecto`, `Idioma`, `Referencia`, `Carta`, `Personalizacion`, `PlantillaId`, `SeccionOrdenable`, etc.
- `src/lib/constantes.ts`: datos iniciales, carta inicial, orden inicial de secciones, etiquetas, colores, plantillas, fuentes e idioma.
- `src/lib/importar-exportar.ts`: normaliza datos al importar, completa campos faltantes, valida enums y exporta/importa JSON.

Estado persistido actual:

- `datos`: contenido del CV.
- `personalizacion`: plantilla, color, fuente, idioma y orden de secciones.
- `carta`: contenido de carta de presentacion.

## Formularios del Editor

- `src/editor/PanelFormulario.tsx`: compone todas las secciones del formulario de CV.
- `src/editor/FormPersonalizacion.tsx`: idioma, plantilla, color, fuente y orden de secciones. Ya existe drag and drop basico + flechas para reordenar secciones.
- `src/editor/FormCalidadCv.tsx`: checklist local de calidad del CV con puntaje, urgentes y recomendaciones. En CV vacio no marca como listas reglas que aun no tienen datos para evaluar.
- `src/editor/FormDatosPersonales.tsx`: datos personales y enlaces.
- `src/editor/FormPerfil.tsx`: perfil profesional y mejora acotada con IA.
- `src/editor/FormExperiencia.tsx`: experiencia laboral repetible.
- `src/editor/FormEducacion.tsx`: educacion repetible.
- `src/editor/FormCursos.tsx`: cursos/certificaciones repetibles.
- `src/editor/FormProyectos.tsx`: proyectos repetibles.
- `src/editor/FormHabilidades.tsx`: habilidades como lista de strings.
- `src/editor/FormIdiomas.tsx`: idiomas repetibles con nivel.
- `src/editor/FormReferencias.tsx`: referencias repetibles.
- `src/editor/FormInfoAdicional.tsx`: disponibilidad y pretensiones de renta.
- `src/editor/FormAnalisisAts.tsx`: pega una oferta laboral y calcula coincidencia local de keywords contra el CV.
- `src/editor/PanelFormularioCarta.tsx` y `src/editor/FormCarta.tsx`: formulario de carta de presentacion y generacion IA del cuerpo.

## Preview y Render de Documentos

- `src/editor/PanelVistaPrevia.tsx`: preview responsive del CV. Escala A4 segun ancho disponible y advierte si el CV supera una pagina.
- `src/editor/PanelVistaCarta.tsx`: preview responsive de carta.
- `src/cv/CurriculumVista.tsx`: selecciona plantilla segun `personalizacion.plantilla` y define dimensiones A4 en pixeles.
- `src/cv/VistaCarta.tsx`: render de carta.
- `src/cv/PlantillaClasico.tsx`: plantilla ATS sobria tipo Harvard.
- `src/cv/PlantillaMinimalista.tsx`: plantilla ATS plana/elegante.
- `src/cv/PlantillaModerno.tsx`: plantilla visual con sidebar.
- `src/cv/PlantillaColorido.tsx`: plantilla visual con header/formas.

## PDF

- `src/lib/generar-pdf.ts`: orquesta descarga del CV. Usa camino ATS o captura visual segun plantilla.
- `src/lib/generar-pdf-ats.ts`: genera PDF con texto nativo para plantillas ATS.
- `src/lib/generar-pdf-ats-helpers.ts`: helpers para layout/texto del PDF ATS.
- `src/lib/generar-pdf-carta.ts`: genera PDF de carta.

Regla actual:

- `clasico` y `minimalista` son ATS y deben priorizar texto nativo.
- `moderno` y `colorido` son visuales y pueden depender de captura.

## Acciones Globales

- `src/editor/BarraAcciones.tsx`: descargar PDF, reiniciar datos, cambiar tema, abrir ejemplo, exportar JSON, exportar TXT/Markdown e importar JSON.
- `src/editor/DialogCopiasLocales.tsx`: lista, restaura y elimina copias locales.
- `src/editor/DialogEnviarCv.tsx`: genera el PDF en cliente y lo envia a `POST /api/send-cv` como adjunto base64.
- `src/editor/DialogEjemploCv.tsx`: muestra/gestiona ejemplo de CV.
- `src/editor/datos-ejemplo.ts`: datos mock; tambien se cargan con tap secreto en el titulo.
- `src/lib/useTema.ts`: tema claro/oscuro/sistema persistido en `localStorage` con clave `tema`.
- `src/lib/useHidratado.ts`: evita render sensible a `localStorage` antes de hidratacion.
- `src/lib/copias-locales.ts`: snapshots locales de CV/carta con clave `curriculum-gratis:copias-locales`.
- `src/lib/exportar-texto.ts`: genera y descarga CV o carta en TXT/Markdown desde el documento activo del editor.
- `src/lib/rate-limit.ts`: rate limit compartido para Route Handlers. Usa Redis REST persistente si existen `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` o `KV_REST_API_URL`/`KV_REST_API_TOKEN`; si no, cae a memoria local para desarrollo.

## ATS Local

- `src/lib/analisis-ats.ts`: tokeniza oferta laboral, elimina stopwords, calcula hasta 30 keywords frecuentes, marca si aparecen en el CV y genera recomendaciones locales por seccion.
- `src/lib/calidad-cv.ts`: reglas puras para evaluar calidad basica del CV sin backend ni IA.
- No usa backend ni IA.
- `FormAnalisisAts.tsx` lo presenta como porcentaje y badges de keywords presentes/faltantes.

## UI y Design System

- `src/app/globals.css`: tokens CSS globales para colores, superficies, texto, bordes y estados.
- `src/components/atoms/Button.tsx`: fuente unica para botones y variantes.
- `src/components/atoms/Text.tsx`: estilos tipograficos.
- `src/components/atoms/Surface.tsx`: superficies/paneles/tarjetas/popovers.
- `src/components/atoms/Badge.tsx`: etiquetas y estados.
- `src/components/atoms/Input.tsx`, `Textarea.tsx`, `Select.tsx`, `SelectorFecha.tsx`: controles de formulario.
- `src/components/atoms/Chip.tsx`: chips.
- `src/components/molecules/SeccionFormulario.tsx`: contenedor reutilizable de secciones con tips; por defecto las secciones del editor parten colapsadas.
- `src/components/molecules/EntradaRepetible.tsx`: wrapper para items repetibles.
- `src/components/ui/cn.ts`: merge de clases.

Regla visual:

- Si se necesita boton, texto, panel, badge o input, usar atomos existentes.
- Estilos sueltos solo para layout especifico de pantalla/componente.

## SEO

- `src/app/page.tsx`: home con contenido SEO y schema.
- `src/app/seo-pages.tsx`: plantilla compartida para paginas SEO.
- `src/app/crear-cv-gratis/page.tsx`: pagina SEO keyword crear CV gratis.
- `src/app/plantillas-cv-gratis/page.tsx`: pagina SEO plantillas.
- `src/app/cv-chile/page.tsx`: pagina SEO CV Chile.
- `src/app/formato-cv-harvard/page.tsx`: pagina SEO formato Harvard.
- `src/app/sitemap.ts`: sitemap.
- `src/app/robots.ts`: robots.
- `src/app/opengraph-image.tsx`: OG image generada.
- `src/app/icon.tsx`: icono generado.

Roles SEO actuales:

- `/crear-cv-gratis`: entrada directa al editor.
- `/plantillas-cv-gratis`: comparador/selector de plantillas con CTAs preseleccionados.
- `/formato-cv-harvard`: pagina educativa con CTA a plantilla `clasico` y comparacion ATS.
- `/cv-chile`: guia local para postulaciones en Chile con CTA general al editor.

## Backend Actual y Futuro

Estado actual:

- `src/app/api/send-cv/route.ts`: envia CV por correo via Resend. Requiere `RESEND_API_KEY`; `RESEND_FROM_EMAIL` es opcional. Limitado a 5 envios por IP/hora.
- `src/app/api/ai/improve-profile/route.ts`: reescribe el perfil profesional con Gemini. Requiere `GEMINI_API_KEY`; `GEMINI_MODEL` es opcional y por defecto usa `gemini-2.5-flash`. Limitado a 10 solicitudes por IP/hora.
- `src/app/api/ai/generate-cover-letter/route.ts`: genera cuerpo de carta con Gemini desde resumen del CV y oferta opcional. Limitado a 8 solicitudes por IP/hora.
- Rate limit persistente: configurar `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` o `KV_REST_API_URL` + `KV_REST_API_TOKEN`. `RATE_LIMIT_SALT` es opcional para hashear identificadores de IP con salt propio.
- No hay base de datos.
- No hay auth.

Si se agregan features con backend, preferir:

- Route Handlers en `src/app/api/.../route.ts` para emails, IA, webhooks o endpoints JSON.
- Server Actions solo cuando calcen naturalmente con formularios y mutaciones server-side.
- Runtime Node.js por defecto salvo necesidad clara de Edge.
- Mantener rate limit externo para funciones con costo/abuso usando Redis REST; no depender solo de memoria en produccion.

Features que probablemente requieren backend:

- Enviar CV por correo.
- Gemini/IA.
- Guardar CVs entre dispositivos.
- Cuenta de usuario.
- Portal publico del CV.
- Importar PDF/DOCX con parsing robusto.

Features que pueden seguir frontend-only:

- Checklist de calidad local.
- Mejoras de plantillas.
- Reordenamiento de secciones.
- Duplicar CV con `localStorage`.
- Historial local.
- Adaptacion simple a oferta por keywords.

## Roadmap Vivo

- La nota de Obsidian `Curriculum gratis/Ideas proximas.md` contiene ideas y priorizacion por dificultad/valor.
- Si una idea se convierte en spec, mantener el enlace o estado en esa nota.
- Si una feature se implementa, actualizar este archivo con nuevos paths y comportamiento.

## Comandos

- `pnpm dev`: desarrollo local.
- `pnpm lint`: ESLint.
- `pnpm build`: build de produccion.
- `pnpm start`: servir build.

## Criterio de Priorizacion Actual

Mientras el producto siga frontend-only, priorizar features con alta percepcion de valor y bajo costo operativo:

- Calidad del CV y recomendaciones locales.
- Mejor experiencia de edicion.
- Plantillas y exportacion.
- Mejoras SEO y conversion.

Postergar features que agregan costo, abuso o infraestructura hasta que haya decision explicita de usar backend Next en Vercel.
