import { DataTable } from "@/components/data-table"
import { listContacts, ROLE_LABELS } from "@/lib/contacts"
import type { TableConfig } from "@/lib/tables/types"

// `contacts` is a database view, not an editable table, so it has no entry in
// tableConfigs — this is just the display config the shared DataTable needs.
// The search box covers the visible columns, so typing a role ("landlord")
// filters by role.
const contactsConfig: TableConfig = {
  key: "contacts",
  label: "Contact",
  pluralLabel: "Contacts",
  route: "/contacts",
  primaryKey: "slug",
  listFields: ["name", "email", "phone", "roles", "touchpoints", "last_seen"],
  avatarFields: ["name"],
  fields: [
    { key: "slug", label: "Slug", type: "text", editable: false },
    { key: "name", label: "Name", type: "text", editable: false },
    { key: "email", label: "Email", type: "text", editable: false },
    { key: "phone", label: "Phone", type: "text", editable: false },
    { key: "roles", label: "Roles", type: "text", editable: false },
    { key: "touchpoints", label: "Touchpoints", type: "text", editable: false },
    { key: "first_seen", label: "First seen", type: "datetime", editable: false },
    { key: "last_seen", label: "Last seen", type: "datetime", editable: false },
  ],
}

export default async function ContactsPage() {
  const contacts = await listContacts()

  const rows = contacts.map((c) => ({
    slug: encodeURIComponent(c.email),
    name: c.name,
    email: c.email,
    phone: c.phone,
    roles: c.roles.map((r) => ROLE_LABELS[r] ?? r).join(", "),
    touchpoints: String(c.touchpoints),
    first_seen: c.first_seen,
    last_seen: c.last_seen,
  }))

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">Contacts</h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Everyone who has ever given us their email — guests, landlords, partners, corporate
          enquiries, contact messages and newsletter signups — one row per person. Guests with no
          email on file aren&apos;t listed here.
        </p>
      </div>
      <DataTable config={contactsConfig} rows={rows} />
    </div>
  )
}
