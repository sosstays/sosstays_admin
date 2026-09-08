import { DataTable } from "@/components/data-table"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function PropertiesPage() {
  const rows = await listRows("properties")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Properties</h1>
      <DataTable config={tableConfigs.properties} rows={rows} />
    </div>
  )
}
