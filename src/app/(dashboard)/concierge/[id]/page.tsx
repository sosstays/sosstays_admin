import { notFound } from "next/navigation"
import { Building2, CalendarDays } from "lucide-react"
import { RecordForm } from "@/components/record-form"
import { DetailHeader } from "@/components/detail-header"
import { LinkedRecordCard } from "@/components/linked-record-card"
import { tableConfigs } from "@/lib/tables/config"
import { getRow } from "@/lib/tables/queries"
import { updateRecord } from "@/lib/tables/actions"
import type { Row } from "@/lib/tables/queries"

export default async function ConciergeGuestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const config = tableConfigs.concierge_signups
  const row = await getRow("concierge_signups", id)
  if (!row) notFound()

  const action = updateRecord.bind(null, "concierge_signups", id)
  const property = row.properties as Row | null
  const booking = row.bookings as Row | null

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref="/concierge"
        backLabel="concierge guests"
        title={String(row.name || row.email)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <LinkedRecordCard
          icon={Building2}
          label="Property"
          value={property ? (property.name as string) : null}
          href={property ? `/properties/${property.id}` : null}
        />
        <LinkedRecordCard
          icon={CalendarDays}
          label="Booking"
          value={booking ? `${booking.check_in} → ${booking.check_out}` : null}
          href={booking ? `/bookings/${booking.id}` : null}
        />
      </div>

      <RecordForm config={config} row={row} action={action} />
    </div>
  )
}
