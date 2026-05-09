"use client"

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"

interface AuthActionsProps {
  compact?: boolean
}

export function AuthActions({ compact = false }: AuthActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button type="button" variant="secondary" size="sm" className="min-h-10 whitespace-nowrap">
            <span className="hidden sm:inline">Iniciar sesion</span>
            <span className="sm:hidden">Entrar</span>
          </Button>
        </SignInButton>
        {!compact && (
          <SignUpButton mode="modal">
            <Button type="button" variant="ghost" size="sm" className="min-h-10 whitespace-nowrap">
              Crear cuenta
            </Button>
          </SignUpButton>
        )}
      </Show>
      <Show when="signed-in">
        <Badge variant="success" className="hidden sm:inline-flex">
          Free
        </Badge>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "h-9 w-9 border-2 border-border-strong shadow-[2px_2px_0_var(--color-border-strong)]",
            },
          }}
        />
      </Show>
    </div>
  )
}
