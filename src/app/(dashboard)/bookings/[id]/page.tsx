import { notFound } from "next/navigation"
import { RecordForm } from "@/components/record-form"
import { tableConfigs } from "@/lib/tables/config"
import { getRow } from "@/lib/tables/queries"
import { updateRecord } from "@/lib/tables/actions"

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

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Booking {String(row.uplisting_reservation_id)}</h1>
      <RecordForm config={config} row={row} action={action} />
    </div>
  )
}
