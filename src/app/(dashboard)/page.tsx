import Link from "next/link"
import {
  Building2,
  Users,
  CalendarDays,
  Handshake,
  MessageSquare,
  Store,
  Briefcase,
  Mail,
  ArrowRight,
} from "lucide-react"
import { countRows, listRows } from "@/lib/tables/queries"
import { formatValue } from "@/lib/tables/format"
import { StatusBadge } from "@/components/status-badge"

const STAT_ICONS = {
  properties: Building2,
  guests: Users,
  bookings: CalendarDays,
  landlord_leads: Handshake,
  contact_queries: MessageSquare,
  partner_leads: Store,
  corporate_leads: Briefcase,
  newsletter_subscribers: Mail,
} as const

export default async function DashboardHomePage() {
  const [
    propertyCount,
    guestCount,
    bookingCount,
    leadCount,
    queryCount,
    partnerCount,
    corporateCount,
    subscriberCount,
    recentBookings,
  ] = await Promise.all([
    countRows("properties"),
    countRows("guests"),
    countRows("bookings"),
    countRows("landlord_leads"),
    countRows("contact_queries"),
    countRows("partner_leads"),
    countRows("corporate_leads"),
    countRows("newsletter_subscribers"),
    listRows("bookings"),
  ])

  const latestBookings = recentBookings.slice(0, 5)

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard href="/properties" label="Properties" count={propertyCount} statKey="properties" />
        <StatCard href="/guests" label="Guests" count={guestCount} statKey="guests" />
        <StatCard href="/bookings" label="Bookings" count={bookingCount} statKey="bookings" />
        <StatCard href="/leads" label="Landlord Leads" count={leadCount} statKey="landlord_leads" />
        <StatCard
          href="/contact-queries"
          label="Contact Queries"
          count={queryCount}
          statKey="contact_queries"
        />
        <StatCard
          href="/partner-leads"
          label="Partner Leads"
          count={partnerCount}
          statKey="partner_leads"
        />
        <StatCard
          href="/corporate-leads"
          label="Corporate Leads"
          count={corporateCount}
          statKey="corporate_leads"
        />
        <StatCard
          href="/newsletter"
          label="Newsletter Subscribers"
          count={subscriberCount}
          statKey="newsletter_subscribers"
        />
      </div>

      <div>
        <h2 className="section-title mb-3 text-lg font-semibold text-[var(--ink)]">
          Most recent bookings
        </h2>
        <div className="overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white">
          <div className="grid grid-cols-4 gap-4 bg-[var(--warm-cream)] px-5 py-3 text-xs font-medium uppercase tracking-wide text-[var(--ink-soft)]">
            <span>Property</span>
            <span>Guest</span>
            <span>Dates</span>
            <span>Status</span>
          </div>
          {latestBookings.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No bookings yet.</p>
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
                  className="grid grid-cols-4 items-center gap-4 border-t border-[var(--border-soft)] px-5 py-3.5 text-sm transition-colors hover:bg-[var(--sage-pale)]"
                >
                  <span className="font-medium text-[var(--ink)]">{property?.name ?? "—"}</span>
                  <span className="text-[var(--ink-soft)]">{guestName || "—"}</span>
                  <span className="text-[var(--ink-soft)]">
                    {formatValue(booking.check_in, "date")} – {formatValue(booking.check_out, "date")}
                  </span>
                  <StatusBadge status={booking.status as string | null} />
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  href,
  label,
  count,
  statKey,
}: {
  href: string
  label: string
  count: number
  statKey: keyof typeof STAT_ICONS
}) {
  const Icon = STAT_ICONS[statKey]

  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border border-[var(--border-soft)] bg-white p-5 transition-colors hover:border-[var(--sage)]"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sage-pale)] text-[var(--forest-deep)]">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-[var(--forest-deep)] opacity-0 transition-opacity group-hover:opacity-100">
          View all <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </div>
      <div>
        <p className="text-sm text-[var(--ink-soft)]">{label}</p>
        <p className="font-heading text-[38px] font-bold leading-tight text-[var(--ink)]">
          {count}
        </p>
      </div>
    </Link>
  )
}
