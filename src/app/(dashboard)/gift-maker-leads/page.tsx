import { PipelineView } from "@/components/pipeline-view"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function GiftMakerLeadsPage() {
  const rows = await listRows("gift_maker_leads")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Gift Maker Leads</h1>
      <PipelineView
        config={tableConfigs.gift_maker_leads}
        rows={rows}
        titleFields={["name"]}
        subtitleFields={["email", "package_label"]}
      />
    </div>
  )
}
