import Link from "next/link"
import {
  BedDouble,
  Mail,
  MessageSquare,
  RefreshCw,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import type { TimelineEvent, TimelineKind } from "@/lib/timeline"
import { formatValue } from "@/lib/tables/format"

const ICONS: Record<TimelineKind, LucideIcon> = {
  profile: UserRound,
  booking: BedDouble,
  message: MessageSquare,
  lead: Target,
  newsletter: Mail,
  sync: RefreshCw,
}

export function ActivityTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-6">
      <h2 className="section-title mb-4 text-lg font-semibold text-[var(--ink)]">Activity</h2>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
      ) : (
        <ol className="flex flex-col">
          {events.map((event, index) => {
            const Icon = ICONS[event.kind]
            const isLast = index === events.length - 1
            const body = (
              <>
                <p className="text-sm font-medium text-[var(--ink)]">{event.title}</p>
                {event.detail ? (
                  <p className="text-xs text-[var(--ink-soft)]">{event.detail}</p>
                ) : null}
                <p className="mt-0.5 text-xs text-[var(--ink-soft)]">
                  {formatValue(event.at, "datetime")}
                </p>
              </>
            )

            return (
              <li key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sage-pale)] text-[var(--forest-deep)]">
                    <Icon className="h-4 w-4" strokeWidth={1.9} />
                  </span>
                  {isLast ? null : <span className="w-px flex-1 bg-[var(--border-soft)]" />}
                </div>
                <div className={isLast ? "pb-0" : "pb-5"}>
                  {event.href ? (
                    <Link href={event.href} className="block hover:underline">
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
