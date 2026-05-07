# Contribuir

Gracias por querer aportar a Curriculum Gratis.

## Licencia de aportes

Al enviar un pull request, issue con codigo, parche o cualquier otro aporte al proyecto, aceptas que tu contribucion se distribuya bajo la misma licencia del repositorio: PolyForm Noncommercial License 1.0.0.

Esto permite usar, estudiar, modificar y compartir el proyecto para fines no comerciales. El uso comercial requiere autorizacion previa del titular del proyecto.

## Reglas generales

- Mantener nombres de variables, funciones, tipos y archivos en espanol cuando sea codigo propio del dominio.
- Leer `node_modules/next/dist/docs/` antes de tocar APIs de Next.js 16.
- Reutilizar atomos y tokens existentes antes de crear estilos nuevos.
- No editar `pnpm-lock.yaml` manualmente.
- No agregar datos sensibles ni archivos `.env`.
- Ejecutar antes de proponer cambios:

```bash
pnpm lint
pnpm build
```
