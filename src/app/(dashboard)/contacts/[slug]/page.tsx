import { notFound } from "next/navigation"
import { DetailHeader } from "@/components/detail-header"
import { RelatedList } from "@/components/related-list"
import { ActivityTimeline } from "@/components/activity-timeline"
import { buildTimeline } from "@/lib/timeline"
import { listActivities } from "@/lib/activities"
import { getContact, listByEmail, ROLE_LABELS } from "@/lib/contacts"
import { formatValue } from "@/lib/tables/format"
import { listRelated } from "@/lib/tables/queries"
import type { TableKey } from "@/lib/tables/config"

// One section per table a person can appear in, in the order they're shown.
const SECTIONS: { table: TableKey; label: string; columns: string[] }[] = [
  {
    table: "guests",
    label: "Guest profile",
    columns: ["first_name", "last_name", "phone", "email_verified", "created_at"],
  },
  {
    table: "landlord_leads",
    label: "Landlord leads",
    columns: ["name", "status", "source", "area", "current_revenue", "created_at"],
  },
  {
    table: "partner_leads",
    label: "Partner leads",
    columns: ["business_name", "contact_name", "status", "category", "created_at"],
  },
  {
    table: "corporate_leads",
    label: "Corporate leads",
    columns: ["name", "company", "status", "number_of_workers", "created_at"],
  },
  {
    table: "contact_queries",
    label: "Contact messages",
    columns: ["topic", "status", "message", "created_at"],
  },
  {
    table: "newsletter_subscribers",
    label: "Newsletter",
    columns: ["status", "source", "created_at"],
  },
]

function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const email = decodeSlug(slug)

  const contact = await getContact(email)
  if (!contact) notFound()

  const sections = await Promise.all(
    SECTIONS.map(async (s) => ({ ...s, rows: await listByEmail(s.table, contact.email) }))
  )

  // A guest's stays, across every guest row that carries this email.
  const guestRows = sections.find((s) => s.table === "guests")?.rows ?? []
  const bookings = (
    await Promise.all(guestRows.map((g) => listRelated("bookings", "guest_id", String(g.id))))
  ).flat()

  const activities = await listActivities(
    contact.email,
    bookings.map((b) => String(b.id))
  )
  const events = buildTimeline(sections, bookings, activities)

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref="/contacts"
        backLabel="contacts"
        title={contact.name || contact.email}
      />

      <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-6">
        <dl className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Email" value={contact.email} />
          <Fact label="Phone" value={contact.phone ?? "—"} />
          <Fact label="First seen" value={formatValue(contact.first_seen, "datetime")} />
          <Fact label="Last seen" value={formatValue(contact.last_seen, "datetime")} />
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          {contact.roles.map((role) => (
            <span
              key={role}
              className="inline-flex items-center rounded-full bg-[var(--sage-pale)] px-3 py-1 text-xs font-medium text-[var(--forest-deep)]"
            >
              {ROLE_LABELS[role] ?? role}
            </span>
          ))}
        </div>
      </div>

      <ActivityTimeline events={events} email={contact.email} />

      {sections
        .filter((s) => s.rows.length > 0)
        .map((s) => (
          <RelatedList
            key={s.table}
            label={s.label}
            sourceTable={s.table}
            columns={s.columns}
            rows={s.rows}
          />
        ))}

      {bookings.length > 0 ? (
        <RelatedList
          label="Bookings"
          sourceTable="bookings"
          columns={["property_id", "check_in", "check_out", "status", "channel", "revenue"]}
          rows={bookings}
        />
      ) : null}
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--ink-soft)]">
        {label}
      </dt>
      <dd className="mt-1 break-all text-[var(--ink)]">{value}</dd>
    </div>
  )
}
