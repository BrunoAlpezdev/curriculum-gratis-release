"use client"

import { FormPersonalizacion } from "@/editor/FormPersonalizacion"
import { FormDatosPersonales } from "@/editor/FormDatosPersonales"
import { FormPerfil } from "@/editor/FormPerfil"
import { FormExperiencia } from "@/editor/FormExperiencia"
import { FormEducacion } from "@/editor/FormEducacion"
import { FormCursos } from "@/editor/FormCursos"
import { FormProyectos } from "@/editor/FormProyectos"
import { FormHabilidades } from "@/editor/FormHabilidades"
import { FormIdiomas } from "@/editor/FormIdiomas"
import { FormReferencias } from "@/editor/FormReferencias"
import { FormInfoAdicional } from "@/editor/FormInfoAdicional"
import { FormAnalisisAts } from "@/editor/FormAnalisisAts"
import { GithubLogoIcon, ShieldCheckIcon, HeartIcon } from "@phosphor-icons/react"

export function PanelFormulario() {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto bg-app-bg p-3 sm:p-4">
      <FormPersonalizacion />
      <FormDatosPersonales />
      <FormPerfil />
      <FormExperiencia />
      <FormEducacion />
      <FormCursos />
      <FormProyectos />
      <FormHabilidades />
      <FormIdiomas />
      <FormReferencias />
      <FormInfoAdicional />
      <FormAnalisisAts />

      <div className="mt-8 border border-border-subtle bg-panel p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 bg-action-soft p-1.5 text-action-strong">
            <ShieldCheckIcon size={20} weight="fill" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-semibold text-text-main">
              Privacidad garantizada
            </h4>
            <p className="text-sm text-text-muted leading-relaxed">
              Tus datos nunca salen de tu dispositivo. No guardamos ninguna
              información en bases de datos ni servidores externos.
            </p>
            <p className="text-sm font-semibold text-action-strong">
              Dedicado a Camila Valenzuela &lt;3
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2">
              <a
                href="https://github.com/BrunoAlpezdev/curriculum-gratis-release"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-main hover:text-action-strong transition-colors"
              >
                <GithubLogoIcon size={18} weight="fill" />
                GitHub
              </a>
              <a
                href="https://ko-fi.com/brunoalpezdev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-action-primary hover:text-action-strong transition-colors"
              >
                <HeartIcon size={18} weight="fill" />
                Apoyar en Ko-fi
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
