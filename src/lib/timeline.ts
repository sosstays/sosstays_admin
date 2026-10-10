import type { TableKey } from "@/lib/tables/config"
import { tableConfigs } from "@/lib/tables/config"
import type { Row } from "@/lib/tables/queries"

export type TimelineKind = "profile" | "booking" | "message" | "lead" | "newsletter" | "sync"

export interface TimelineEvent {
  id: string
  /** ISO timestamp. */
  at: string
  kind: TimelineKind
  title: string
  detail?: string
  /** Record this event belongs to, for click-through. */
  href?: string
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
  bookings: Row[]
): TimelineEvent[] {
  const events: TimelineEvent[] = []

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
    add("bookings", booking, "confirmation_sent_at", "message", "WhatsApp booking confirmation sent", where)
    add("bookings", booking, "reminder_sent_at", "message", "WhatsApp check-in reminder sent", where)
  }

  return events.sort((a, b) => b.at.localeCompare(a.at))
}
