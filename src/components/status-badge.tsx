const STYLES: Record<string, string> = {
  // Bookings
  confirmed: "bg-[var(--sage-pale)] text-[var(--forest-deep)]",
  pending: "bg-[var(--warm-cream)] text-[var(--maroon-muted)]",
  cancelled: "bg-[var(--error-bg)] text-[var(--error)]",
  // Landlord leads
  new: "bg-[var(--warm-cream)] text-[var(--maroon-muted)]",
  contacted: "bg-[var(--sage-pale)] text-[var(--forest-deep)]",
  qualified: "bg-[var(--sage-pale)] text-[var(--forest-deep)]",
  converted: "bg-[var(--sage-300)] text-[var(--forest-deep)]",
  declined: "bg-[var(--error-bg)] text-[var(--error)]",
  // Contact queries
  in_progress: "bg-[var(--sage-pale)] text-[var(--forest-deep)]",
  resolved: "bg-[var(--sage-300)] text-[var(--forest-deep)]",
}

const DEFAULT_STYLE = "bg-[var(--warm-cream)] text-[var(--ink-soft)]"

export function StatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) return <span className="text-sm text-muted-foreground">—</span>

  const style = STYLES[status.toLowerCase()] ?? DEFAULT_STYLE

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  )
}
