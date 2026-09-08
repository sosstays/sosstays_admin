import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function DetailHeader({
  backHref,
  backLabel,
  title,
}: {
  backHref: string
  backLabel: string
  title: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Link
        href={backHref}
        className="flex items-center gap-1.5 text-sm text-[var(--ink-soft)] hover:text-[var(--forest-deep)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Back to {backLabel}
      </Link>
      <h1 className="font-heading text-2xl font-bold text-[var(--ink)]">{title}</h1>
    </div>
  )
}
