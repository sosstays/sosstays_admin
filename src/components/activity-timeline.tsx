"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BedDouble,
  Mail,
  MessageSquare,
  NotebookPen,
  Phone,
  RefreshCw,
  Settings2,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import type { TimelineEvent, TimelineKind } from "@/lib/timeline"
import { formatValue } from "@/lib/tables/format"
import { AddActivityForm } from "@/components/add-activity-form"

const ICONS: Record<TimelineKind, LucideIcon> = {
  profile: UserRound,
  booking: BedDouble,
  message: MessageSquare,
  lead: Target,
  newsletter: Mail,
  sync: RefreshCw,
  call: Phone,
  note: NotebookPen,
  system: Settings2,
}

const isProblem = (event: TimelineEvent) => event.status === "failed" || event.status === "skipped"

export function ActivityTimeline({
  events,
  email,
}: {
  events: TimelineEvent[]
  /** When set, shows the "add note / log call" form for this contact. */
  email?: string
}) {
  const [issuesOnly, setIssuesOnly] = useState(false)
  const problemCount = events.filter(isProblem).length
  const visible = issuesOnly ? events.filter(isProblem) : events

  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="section-title text-lg font-semibold text-[var(--ink)]">Activity</h2>
        {problemCount > 0 ? (
          <button
            type="button"
            onClick={() => setIssuesOnly((v) => !v)}
            className={
              issuesOnly
                ? "rounded-full bg-[var(--error)] px-3 py-1 text-xs font-medium text-white"
                : "rounded-full bg-[var(--error-bg)] px-3 py-1 text-xs font-medium text-[var(--error)]"
            }
          >
            {issuesOnly ? "Showing issues only" : `${problemCount} failed or skipped`}
          </button>
        ) : null}
      </div>

      {email ? <AddActivityForm email={email} /> : null}

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
      ) : (
        <ol className="flex flex-col">
          {visible.map((event, index) => {
            const Icon = ICONS[event.kind]
            const isLast = index === visible.length - 1
            const problem = isProblem(event)
            const body = (
              <>
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--ink)]">
                  {event.title}
                  {problem ? (
                    <span className="rounded-full bg-[var(--error-bg)] px-2 py-0.5 text-xs font-medium capitalize text-[var(--error)]">
                      {event.status}
                    </span>
                  ) : null}
                </p>
                {event.detail ? (
                  <p className="whitespace-pre-wrap text-xs text-[var(--ink-soft)]">{event.detail}</p>
                ) : null}
                {event.error ? <p className="text-xs text-[var(--error)]">{event.error}</p> : null}
                <p className="mt-0.5 text-xs text-[var(--ink-soft)]">
                  {formatValue(event.at, "datetime")}
                  {event.author ? ` · ${event.author}` : ""}
                </p>
              </>
            )

            return (
              <li key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={
                      problem
                        ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--error-bg)] text-[var(--error)]"
                        : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sage-pale)] text-[var(--forest-deep)]"
                    }
                  >
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
