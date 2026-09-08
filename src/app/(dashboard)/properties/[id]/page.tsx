import { notFound } from "next/navigation"
import { RecordForm } from "@/components/record-form"
import { RelatedList } from "@/components/related-list"
import { DetailHeader } from "@/components/detail-header"
import { tableConfigs } from "@/lib/tables/config"
import { getRow, listRelated } from "@/lib/tables/queries"
import { updateRecord } from "@/lib/tables/actions"

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const config = tableConfigs.properties
  const row = await getRow("properties", id)
  if (!row) notFound()

  const bookings = await listRelated("bookings", "property_id", id)
  const action = updateRecord.bind(null, "properties", id)

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader backHref="/properties" backLabel="properties" title={String(row.name)} />
      <RecordForm config={config} row={row} action={action} />
      {config.relatedLists?.map((rl) => (
        <RelatedList
          key={rl.label}
          label={rl.label}
          sourceTable={rl.sourceTable as "bookings"}
          columns={rl.columns}
          rows={bookings}
        />
      ))}
    </div>
  )
}
