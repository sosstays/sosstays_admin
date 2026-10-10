import { PipelineView } from "@/components/pipeline-view"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function CorporateLeadsPage() {
  const rows = await listRows("corporate_leads")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Corporate Leads</h1>
      <PipelineView
        config={tableConfigs.corporate_leads}
        rows={rows}
        titleFields={["name"]}
        subtitleFields={["company", "email"]}
      />
    </div>
  )
}
