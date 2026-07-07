"use client"

import { Text } from "@/components/atoms/Text"
import { CamposEducacion } from "@/editor/campos/CamposEducacion"
import { CamposCursos } from "@/editor/campos/CamposCursos"
import { CamposHabilidades } from "@/editor/campos/CamposHabilidades"
import { CamposIdiomas } from "@/editor/campos/CamposIdiomas"
import { CamposProyectos } from "@/editor/campos/CamposProyectos"
import { CamposReferencias } from "@/editor/campos/CamposReferencias"
import { CamposInfoAdicional } from "@/editor/campos/CamposInfoAdicional"
import { CamposPersonalizacion } from "@/editor/campos/CamposPersonalizacion"

/**
 * Sub-bloque dentro de un paso que agrupa varias secciones. Mantiene una jerarquia
 * clara ("Educacion", "Cursos") sin volver a un acordeon ni ahogar en texto.
 */
function SubSeccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <Text as="h3" variant="strong" className="text-sm uppercase tracking-wide text-text-muted">
        {titulo}
      </Text>
      {children}
    </section>
  )
}

export function ContenidoDisenoCv() {
  return (
    <div className="flex flex-col gap-6">
      <CamposPersonalizacion modo="cv" />
    </div>
  )
}

export function ContenidoDisenoCarta() {
  return (
    <div className="flex flex-col gap-6">
      <CamposPersonalizacion modo="carta" />
    </div>
  )
}

export function ContenidoFormacion() {
  return (
    <div className="flex flex-col gap-8">
      <SubSeccion titulo="Educación">
        <CamposEducacion />
      </SubSeccion>
      <SubSeccion titulo="Cursos y certificaciones">
        <CamposCursos />
      </SubSeccion>
    </div>
  )
}

export function ContenidoAptitudes() {
  return (
    <div className="flex flex-col gap-8">
      <SubSeccion titulo="Competencias">
        <CamposHabilidades />
      </SubSeccion>
      <SubSeccion titulo="Idiomas">
        <CamposIdiomas />
      </SubSeccion>
    </div>
  )
}

export function ContenidoExtras() {
  return (
    <div className="flex flex-col gap-8">
      <SubSeccion titulo="Proyectos">
        <CamposProyectos />
      </SubSeccion>
      <SubSeccion titulo="Referencias">
        <CamposReferencias />
      </SubSeccion>
      <SubSeccion titulo="Información adicional">
        <CamposInfoAdicional />
      </SubSeccion>
    </div>
  )
}
