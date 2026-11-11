import { PipelineView } from "@/components/pipeline-view"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function BespokeTripLeadsPage() {
  const rows = await listRows("bespoke_trip_leads")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Bespoke Trip Leads</h1>
      <PipelineView
        config={tableConfigs.bespoke_trip_leads}
        rows={rows}
        titleFields={["name"]}
        subtitleFields={["email", "ideal_month"]}
      />
    </div>
  )
}
