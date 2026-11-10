import Link from "next/link"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function CorporateStayPropertiesPage() {
  const rows = await listRows("corporate_stay_properties")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--ink)]">Corporate Stay Properties</h1>
        <Link
          href="/corporate-stay-properties/new"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--forest)] px-3.5 py-2 text-sm font-medium text-[var(--cream)] transition-colors hover:bg-[var(--forest-deep)]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          New property
        </Link>
      </div>
      <DataTable config={tableConfigs.corporate_stay_properties} rows={rows} />
    </div>
  )
}
