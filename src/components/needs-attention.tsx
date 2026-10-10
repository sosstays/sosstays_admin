import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { listAttention, type Activity } from "@/lib/activities"
import { formatValue } from "@/lib/tables/format"

function hrefFor(activity: Activity): string | null {
  if (activity.email) return `/contacts/${encodeURIComponent(activity.email)}`
  if (activity.booking_id) return `/bookings/${activity.booking_id}`
  return null
}

/** Recent failed or skipped messages. Renders nothing when there are none. */
export async function NeedsAttention() {
  const items = await listAttention(8)
  if (items.length === 0) return null

  return (
    <div>
      <h2 className="section-title mb-3 flex items-center gap-2 text-lg font-semibold text-[var(--ink)]">
        <AlertTriangle className="h-5 w-5 text-[var(--error)]" strokeWidth={1.9} />
        Needs attention
      </h2>
      <div className="overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white">
        {items.map((item, index) => {
          const href = hrefFor(item)
          const row = (
            <>
              <span className="flex flex-col">
                <span className="font-medium text-[var(--ink)]">{item.title}</span>
                {item.error ? <span className="text-xs text-[var(--error)]">{item.error}</span> : null}
              </span>
              <span className="flex items-center gap-3 text-xs text-[var(--ink-soft)]">
                <span className="rounded-full bg-[var(--error-bg)] px-2 py-0.5 font-medium capitalize text-[var(--error)]">
                  {item.status}
                </span>
                {formatValue(item.occurred_at, "datetime")}
              </span>
            </>
          )
          const className = `flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${
            index > 0 ? "border-t border-[var(--border-soft)]" : ""
          }`
          return href ? (
            <Link
              key={item.id}
              href={href}
              className={`${className} transition-colors hover:bg-[var(--sage-pale)]`}
            >
              {row}
            </Link>
          ) : (
            <div key={item.id} className={className}>
              {row}
            </div>
          )
        })}
      </div>
    </div>
  )
}
