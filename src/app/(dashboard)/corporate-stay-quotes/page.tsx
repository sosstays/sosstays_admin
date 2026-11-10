import { DataTable } from "@/components/data-table"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function CorporateStayQuotesPage() {
  const rows = await listRows("corporate_stay_quotes")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Corporate Stay Quotes</h1>
      <DataTable config={tableConfigs.corporate_stay_quotes} rows={rows} />
    </div>
  )
}
