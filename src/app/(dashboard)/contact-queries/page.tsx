import { DataTable } from "@/components/data-table"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function ContactQueriesPage() {
  const rows = await listRows("contact_queries")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Contact Queries</h1>
      <DataTable config={tableConfigs.contact_queries} rows={rows} />
    </div>
  )
}
