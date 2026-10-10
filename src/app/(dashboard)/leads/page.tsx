import { PipelineView } from "@/components/pipeline-view"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function LeadsPage() {
  const rows = await listRows("landlord_leads")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Landlord Leads</h1>
      <PipelineView
        config={tableConfigs.landlord_leads}
        rows={rows}
        titleFields={["name"]}
        subtitleFields={["email", "area"]}
      />
    </div>
  )
}
