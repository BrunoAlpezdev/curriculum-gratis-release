"use client"

import { useEffect, useEffectEvent, useRef } from "react"
import { cn } from "@/components/ui/cn"

interface DialogoModalProps {
  abierto: boolean
  onCerrar: () => void
  ariaLabel: string
  className?: string
  /** "centro" (modal clasico) o "abajo" (hoja inferior para mobile). */
  alineacion?: "centro" | "abajo"
  children: React.ReactNode
}

/**
 * Wrapper del `<dialog>` nativo. La plataforma nos regala focus inicial, trap de
 * foco y retorno al cerrar; aqui solo sincronizamos abierto/cerrado, escuchamos
 * ESC/click-en-backdrop y bloqueamos el scroll del body. Unico lugar del design
 * system que implementa estas conductas para modales (PreviewOverlay es la
 * excepcion deliberada por depender del DOM montado para generar el PDF).
 */
export function DialogoModal({
  abierto,
  onCerrar,
  ariaLabel,
  className,
  alineacion = "centro",
  children,
}: DialogoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cerrar = useEffectEvent(onCerrar)

  // Abrir/cerrar segun `abierto` + scroll-lock del body mientras esta abierto.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!abierto) {
      if (dialog.open) dialog.close()
      return
    }
    // El guard evita un segundo showModal (lanzaria) en StrictMode.
    if (!dialog.open) dialog.showModal()
    const overflowPrev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = overflowPrev
    }
  }, [abierto])

  // ESC y click en backdrop -> cerrar. El evento "close" nativo cubre ESC, el
  // cierre programatico y el click en backdrop (que dispara dialog.close()).
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    function alCerrar() {
      cerrar()
    }
    function alClick(e: MouseEvent) {
      if (e.target === dialog) dialog!.close()
    }
    dialog.addEventListener("close", alCerrar)
    dialog.addEventListener("click", alClick)
    return () => {
      dialog.removeEventListener("close", alCerrar)
      dialog.removeEventListener("click", alClick)
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-label={ariaLabel}
      className={cn(
        "fixed inset-0 z-50 m-0 h-dvh max-h-dvh w-full max-w-none bg-transparent p-0 text-text-main",
        // `flex` (display:flex) sobreescribe el `display:none` que el UA da a
        // `dialog:not([open])`, asi que un modal cerrado taparia la pantalla e
        // interceptaria clicks. Aplicar el display solo cuando esta abierto.
        abierto && "flex",
        alineacion === "abajo"
          ? "items-end justify-center"
          : "items-end justify-center md:items-center md:p-6",
        className,
      )}
    >
      {abierto && children}
    </dialog>
  )
}
