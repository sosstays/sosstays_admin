import type { TableKey } from "@/lib/tables/config"
import { tableConfigs } from "@/lib/tables/config"
import type { Row } from "@/lib/tables/queries"
import type { Activity } from "@/lib/activities"

export type TimelineKind =
  | "profile"
  | "booking"
  | "message"
  | "lead"
  | "newsletter"
  | "sync"
  | "call"
  | "note"
  | "system"

export interface TimelineEvent {
  id: string
  /** ISO timestamp. */
  at: string
  kind: TimelineKind
  title: string
  detail?: string
  /** Record this event belongs to, for click-through. */
  href?: string
  /** Set for logged activities: "failed" / "skipped" are surfaced as problems. */
  status?: string
  error?: string
  /** Who logged it (manual entries only). */
  author?: string
  /** True when this came from the activities table rather than a derived column. */
  logged?: boolean
}

const CHANNEL_KIND: Record<Activity["channel"], TimelineKind> = {
  whatsapp: "message",
  email: "message",
  sms: "message",
  call: "call",
  note: "note",
  system: "system",
}

function activityHref(activity: Activity): string | undefined {
  if (activity.booking_id) return `/bookings/${activity.booking_id}`
  if (activity.record_table && activity.record_id) {
    const config = tableConfigs[activity.record_table as TableKey]
    if (config) return `${config.route}/${activity.record_id}`
  }
  return undefined
}

const LEAD_LABELS: Partial<Record<TableKey, string>> = {
  landlord_leads: "Landlord lead",
  partner_leads: "Partner lead",
  corporate_leads: "Corporate lead",
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function link(table: TableKey, row: Row): string {
  const config = tableConfigs[table]
  return `${config.route}/${row[config.primaryKey]}`
}

function truncate(text: string, max = 140): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

/**
 * Builds a read-only activity feed from timestamps that already exist on a
 * contact's records (created/synced/sent columns). Newest first. Nothing here
 * writes to the database; manual notes and delivery history need a real
 * activities table.
 */
export function buildTimeline(
  sections: { table: TableKey; rows: Row[] }[],
  bookings: Row[],
  activities: Activity[] = []
): TimelineEvent[] {
  const events: TimelineEvent[] = []

  // A logged confirmation/reminder is the better record of that send than the
  // booking's *_sent_at column, so don't show both.
  const loggedSends = new Set(
    activities
      .filter((a) => a.booking_id && a.status === "sent")
      .map((a) => `${a.booking_id}:${a.type}`)
  )

  function add(
    table: TableKey,
    row: Row,
    column: string,
    kind: TimelineKind,
    title: string,
    detail?: string | null
  ) {
    const at = str(row[column])
    if (!at) return
    events.push({
      id: `${table}:${row[tableConfigs[table].primaryKey]}:${column}`,
      at,
      kind,
      title,
      detail: detail ?? undefined,
      href: link(table, row),
    })
  }

  for (const { table, rows } of sections) {
    for (const row of rows) {
      switch (table) {
        case "guests":
          add(table, row, "created_at", "profile", "Guest profile created")
          add(table, row, "mailerlite_synced_at", "sync", "Synced to MailerLite")
          break
        case "landlord_leads":
        case "partner_leads":
        case "corporate_leads": {
          const label = LEAD_LABELS[table]!
          const status = str(row.status)
          add(table, row, "created_at", "lead", `${label} submitted`, status && `Status now: ${status}`)
          add(table, row, "marketing_consent_at", "lead", "Gave marketing consent")
          add(table, row, "mailerlite_synced_at", "sync", "Synced to MailerLite")
          break
        }
        case "contact_queries": {
          const topic = str(row.topic)
          const message = str(row.message)
          add(
            table,
            row,
            "created_at",
            "message",
            topic ? `Sent a message: ${topic}` : "Sent a message",
            message && truncate(message)
          )
          add(table, row, "mailerlite_synced_at", "sync", "Synced to MailerLite")
          break
        }
        case "newsletter_subscribers":
          add(table, row, "created_at", "newsletter", "Subscribed to the newsletter", str(row.source) && `Source: ${row.source}`)
          add(table, row, "mailerlite_synced_at", "sync", "Synced to MailerLite")
          break
      }
    }
  }

  for (const booking of bookings) {
    const property = (booking.properties as Row | null)?.name
    const where = typeof property === "string" ? property : "a property"
    const dates = [str(booking.check_in), str(booking.check_out)].filter(Boolean).join(" → ")
    const detail = [dates, str(booking.channel)].filter(Boolean).join(" · ")
    add("bookings", booking, "created_at", "booking", `Booking created at ${where}`, detail)
    if (!loggedSends.has(`${booking.id}:confirmation`)) {
      add("bookings", booking, "confirmation_sent_at", "message", "WhatsApp booking confirmation sent", where)
    }
    if (!loggedSends.has(`${booking.id}:reminder`)) {
      add("bookings", booking, "reminder_sent_at", "message", "WhatsApp check-in reminder sent", where)
    }
  }

  for (const activity of activities) {
    events.push({
      id: `activity:${activity.id}`,
      at: activity.occurred_at,
      kind: CHANNEL_KIND[activity.channel] ?? "system",
      title: activity.title,
      detail: activity.body ?? undefined,
      href: activityHref(activity),
      status: activity.status,
      error: activity.error ?? undefined,
      author: activity.channel === "note" || activity.channel === "call" ? (activity.created_by ?? undefined) : undefined,
      logged: true,
    })
  }

  return events.sort((a, b) => b.at.localeCompare(a.at))
}
