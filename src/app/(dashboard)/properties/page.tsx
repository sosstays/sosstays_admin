import Link from "next/link"
import { Building2, Plus } from "lucide-react"
import { listRows } from "@/lib/tables/queries"
import type { Row } from "@/lib/tables/queries"

interface PropertyGroup {
  key: string
  /** Shared checkin_subdomain for a multi-room property; null for a standalone property. */
  subdomain: string | null
  rooms: Row[]
}

// Properties sharing a checkin_subdomain are separate Uplisting listings for
// rooms within the same physical property (e.g. "rathescarguest" covers
// Rathescar's Room 1/2/3) — group them into one card instead of listing each
// room as its own property.
function groupProperties(properties: Row[]): PropertyGroup[] {
  const groups: PropertyGroup[] = []
  const byKey = new Map<string, PropertyGroup>()

  for (const property of properties) {
    const subdomain = (property.checkin_subdomain as string | null) || null
    const key = subdomain ?? `solo:${property.id}`
    let group = byKey.get(key)
    if (!group) {
      group = { key, subdomain, rooms: [] }
      byKey.set(key, group)
      groups.push(group)
    }
    group.rooms.push(property)
  }

  return groups
}

function groupLabel(group: PropertyGroup): string {
  if (!group.subdomain) return String(group.rooms[0].name)
  const base = group.subdomain.replace(/guest$/i, "") || group.subdomain
  return base.charAt(0).toUpperCase() + base.slice(1)
}

export default async function PropertiesPage() {
  const [properties, bookings] = await Promise.all([listRows("properties"), listRows("bookings")])

  const bookingCounts = new Map<string, number>()
  for (const booking of bookings) {
    const propertyId = booking.property_id as string | null
    if (!propertyId) continue
    bookingCounts.set(propertyId, (bookingCounts.get(propertyId) ?? 0) + 1)
  }

  const groups = groupProperties(properties)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--ink)]">Properties</h1>
        <Link
          href="/properties/new"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--forest)] px-3.5 py-2 text-sm font-medium text-[var(--cream)] transition-colors hover:bg-[var(--forest-deep)]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          New property
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="text-sm text-muted-foreground">No properties found.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) =>
            group.rooms.length === 1 ? (
              <SinglePropertyCard
                key={group.key}
                property={group.rooms[0]}
                bookingCount={bookingCounts.get(group.rooms[0].id as string) ?? 0}
              />
            ) : (
              <GroupedPropertyCard
                key={group.key}
                label={groupLabel(group)}
                subdomain={group.subdomain}
                rooms={group.rooms}
                bookingCounts={bookingCounts}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}

function SinglePropertyCard({ property, bookingCount }: { property: Row; bookingCount: number }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="flex flex-col gap-4 rounded-2xl border border-[var(--border-soft)] bg-white p-5 transition-colors hover:border-[var(--sage)]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sage-pale)] text-[var(--forest-deep)]">
        <Building2 className="h-5 w-5" strokeWidth={1.9} />
      </span>

      <div>
        <p className="font-heading text-[19px] font-bold text-[var(--ink)]">
          {String(property.name)}
        </p>
        {property.nickname ? (
          <p className="text-sm text-[var(--ink-soft)]">{String(property.nickname)}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-[var(--border-soft)] pt-4 text-sm">
        <KeyValue label="Uplisting ID" value={String(property.uplisting_listing_id)} />
        <KeyValue
          label="Check-in subdomain"
          value={(property.checkin_subdomain as string | null) ?? "—"}
        />
        <KeyValue label="Bookings" value={String(bookingCount)} />
      </div>
    </Link>
  )
}

function GroupedPropertyCard({
  label,
  subdomain,
  rooms,
  bookingCounts,
}: {
  label: string
  subdomain: string | null
  rooms: Row[]
  bookingCounts: Map<string, number>
}) {
  const totalBookings = rooms.reduce(
    (sum, room) => sum + (bookingCounts.get(room.id as string) ?? 0),
    0
  )

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-soft)] bg-white p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sage-pale)] text-[var(--forest-deep)]">
        <Building2 className="h-5 w-5" strokeWidth={1.9} />
      </span>

      <div>
        <p className="font-heading text-[19px] font-bold text-[var(--ink)]">{label}</p>
        <p className="text-sm text-[var(--ink-soft)]">
          {rooms.length} rooms{subdomain ? ` · ${subdomain}` : ""}
        </p>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-[var(--border-soft)] pt-4">
        {rooms.map((room) => (
          <Link
            key={room.id as string}
            href={`/properties/${room.id}`}
            className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-[var(--sage-pale)]"
          >
            <span className="text-[var(--ink)]">
              {(room.nickname as string | null) || String(room.name)}
            </span>
            <span className="text-[var(--ink-soft)]">
              {bookingCounts.get(room.id as string) ?? 0} bookings
            </span>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border-soft)] pt-3 text-sm">
        <span className="text-[var(--ink-soft)]">Total bookings</span>
        <span className="font-medium text-[var(--ink)]">{totalBookings}</span>
      </div>
    </div>
  )
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--ink-soft)]">{label}</span>
      <span className="font-medium text-[var(--ink)]">{value}</span>
    </div>
  )
}
