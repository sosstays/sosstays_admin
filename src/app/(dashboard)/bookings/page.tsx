import { DataTable } from "@/components/data-table"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function BookingsPage() {
  const rows = await listRows("bookings")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Bookings</h1>
      <DataTable config={tableConfigs.bookings} rows={rows} />
    </div>
  )
}
