import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { countRows, listRows } from "@/lib/tables/queries"
import { tableConfigs } from "@/lib/tables/config"
import { formatValue } from "@/lib/tables/format"

export default async function DashboardHomePage() {
  const [propertyCount, guestCount, bookingCount, recentBookings] = await Promise.all([
    countRows("properties"),
    countRows("guests"),
    countRows("bookings"),
    listRows("bookings"),
  ])

  const latestBookings = recentBookings.slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard href="/properties" label="Properties" count={propertyCount} />
        <StatCard href="/guests" label="Guests" count={guestCount} />
        <StatCard href="/bookings" label="Bookings" count={bookingCount} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Most recent bookings</h2>
        <div className="flex flex-col divide-y rounded-md border">
          {latestBookings.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            latestBookings.map((booking) => {
              const property = booking.properties as { name?: string } | null
              const guest = booking.guests as
                | { first_name?: string; last_name?: string }
                | null
              const guestName =
                [guest?.first_name, guest?.last_name].filter(Boolean).join(" ") ||
                (booking.guest_name_raw as string | null)

              return (
                <Link
                  key={booking.id as string}
                  href={`/bookings/${booking.id}`}
                  className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-muted/50"
                >
                  <span className="font-medium">{property?.name ?? "—"}</span>
                  <span className="text-muted-foreground">{guestName || "—"}</span>
                  <span>
                    {formatValue(booking.check_in, "date")} –{" "}
                    {formatValue(booking.check_out, "date")}
                  </span>
                  <span className="capitalize">{String(booking.status ?? "—")}</span>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ href, label, count }: { href: string; label: string; count: number }) {
  const config = tableConfigs[label.toLowerCase() as keyof typeof tableConfigs]
  return (
    <Link href={href}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardDescription>{config?.pluralLabel ?? label}</CardDescription>
          <CardTitle className="text-3xl">{count}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  )
}
