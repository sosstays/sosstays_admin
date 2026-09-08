import Link from "next/link"
import type { LucideIcon } from "lucide-react"

export function LinkedRecordCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon
  label: string
  value: string | null
  href: string | null
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-white px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--sage-pale)] text-[var(--forest-deep)]">
        <Icon className="h-4 w-4" strokeWidth={1.9} />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-xs text-[var(--ink-soft)]">{label}</span>
        {value && href ? (
          <Link href={href} className="font-medium text-[var(--ink)] underline underline-offset-2">
            {value}
          </Link>
        ) : (
          <span className="font-medium text-[var(--ink-soft)]">—</span>
        )}
      </div>
    </div>
  )
}
