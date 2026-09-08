import { DataTable } from "@/components/data-table"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function GuestsPage() {
  const rows = await listRows("guests")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Guests</h1>
      <DataTable config={tableConfigs.guests} rows={rows} />
    </div>
  )
}
