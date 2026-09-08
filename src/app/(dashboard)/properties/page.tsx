import Link from "next/link"
import { Building2 } from "lucide-react"
import { listRows } from "@/lib/tables/queries"

export default async function PropertiesPage() {
  const [properties, bookings] = await Promise.all([listRows("properties"), listRows("bookings")])

  const bookingCounts = new Map<string, number>()
  for (const booking of bookings) {
    const propertyId = booking.property_id as string | null
    if (!propertyId) continue
    bookingCounts.set(propertyId, (bookingCounts.get(propertyId) ?? 0) + 1)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Properties</h1>

      {properties.length === 0 ? (
        <p className="text-sm text-muted-foreground">No properties found.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link
              key={property.id as string}
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
                <KeyValue
                  label="Bookings"
                  value={String(bookingCounts.get(property.id as string) ?? 0)}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
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
