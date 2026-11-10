import { notFound } from "next/navigation"
import { RecordForm } from "@/components/record-form"
import { RelatedList } from "@/components/related-list"
import { DetailHeader } from "@/components/detail-header"
import { CorporateMatchPanel } from "@/components/corporate-match-panel"
import { tableConfigs } from "@/lib/tables/config"
import { getRow, listRelated, listLeadMatchesForProperty } from "@/lib/tables/queries"
import { updateRecord } from "@/lib/tables/actions"

export default async function CorporateStayPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const config = tableConfigs.corporate_stay_properties
  const row = await getRow("corporate_stay_properties", id)
  if (!row) notFound()

  const [quotes, matches] = await Promise.all([
    listRelated("corporate_stay_quotes", "property_id", id),
    listLeadMatchesForProperty(id),
  ])
  const action = updateRecord.bind(null, "corporate_stay_properties", id)

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref="/corporate-stay-properties"
        backLabel="corporate stay properties"
        title={String(row.property_name)}
      />
      <RecordForm config={config} row={row} action={action} />
      {config.relatedLists?.map((rl) => (
        <RelatedList
          key={rl.label}
          label={rl.label}
          sourceTable={rl.sourceTable as "corporate_stay_quotes"}
          columns={rl.columns}
          rows={quotes}
          addHref={`/corporate-stay-quotes/new?property_id=${id}`}
          addLabel="Add quote"
        />
      ))}
      <CorporateMatchPanel
        label="Leads Interested in This Area"
        emptyLabel="No close matches yet."
        matches={matches}
        variant="leads-for-property"
      />
    </div>
  )
}
