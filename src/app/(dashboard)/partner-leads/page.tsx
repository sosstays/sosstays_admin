import { PipelineView } from "@/components/pipeline-view"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function PartnerLeadsPage() {
  const rows = await listRows("partner_leads")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Partner Leads</h1>
      <PipelineView
        config={tableConfigs.partner_leads}
        rows={rows}
        titleFields={["business_name"]}
        subtitleFields={["contact_name", "email"]}
      />
    </div>
  )
}
