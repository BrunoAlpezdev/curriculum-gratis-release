import { ArrowsClockwiseIcon, ShieldCheckIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"

interface AiSuggestionPanelProps {
  title: string
  text: string
  applyLabel: string
  onApply: () => void
  onRegenerate: () => void
  onDismiss: () => void
  loading?: boolean
  multiline?: boolean
}

export function AiSuggestionPanel({
  title,
  text,
  applyLabel,
  onApply,
  onRegenerate,
  onDismiss,
  loading = false,
  multiline = false,
}: AiSuggestionPanelProps) {
  return (
    <Surface variant="notice" className="flex flex-col gap-3 px-3 py-3">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheckIcon size={16} weight="fill" className="text-action-primary" />
          <Text as="p" variant="strong" className="text-sm">
            {title}
          </Text>
        </div>
        <Text variant="caption" className="mt-1 leading-relaxed">
          Se guardara una copia local antes de aplicar. Revisa la sugerencia: la IA puede equivocarse u omitir matices.
        </Text>
        <Text variant="small" className={multiline ? "mt-3 whitespace-pre-line leading-relaxed" : "mt-3 leading-relaxed"}>
          {text}
        </Text>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={onApply}>
          {applyLabel}
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onRegenerate} disabled={loading}>
          <ArrowsClockwiseIcon size={15} />
          {loading ? "Regenerando..." : "Regenerar"}
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onDismiss}>
          Descartar
        </Button>
      </div>
    </Surface>
  )
}
