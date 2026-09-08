import { notFound } from "next/navigation"
import { Building2, User } from "lucide-react"
import { RecordForm } from "@/components/record-form"
import { DetailHeader } from "@/components/detail-header"
import { LinkedRecordCard } from "@/components/linked-record-card"
import { tableConfigs } from "@/lib/tables/config"
import { getRow } from "@/lib/tables/queries"
import { updateRecord } from "@/lib/tables/actions"
import type { Row } from "@/lib/tables/queries"

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const config = tableConfigs.bookings
  const row = await getRow("bookings", id)
  if (!row) notFound()

  const action = updateRecord.bind(null, "bookings", id)

  const property = row.properties as Row | null
  const guest = row.guests as Row | null
  const guestName = guest ? [guest.first_name, guest.last_name].filter(Boolean).join(" ") : null

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref="/bookings"
        backLabel="bookings"
        title={`Booking ${String(row.uplisting_reservation_id)}`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <LinkedRecordCard
          icon={Building2}
          label="Property"
          value={property ? (property.name as string) : null}
          href={property ? `/properties/${property.id}` : null}
        />
        <LinkedRecordCard
          icon={User}
          label="Guest"
          value={guestName || null}
          href={guest ? `/guests/${guest.id}` : null}
        />
      </div>

      <RecordForm config={config} row={row} action={action} />
    </div>
  )
}
