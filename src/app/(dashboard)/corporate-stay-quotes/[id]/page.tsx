import { notFound } from "next/navigation"
import { RecordForm } from "@/components/record-form"
import { DetailHeader } from "@/components/detail-header"
import { tableConfigs } from "@/lib/tables/config"
import { getRow } from "@/lib/tables/queries"
import { updateRecord } from "@/lib/tables/actions"

export default async function CorporateStayQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const config = tableConfigs.corporate_stay_quotes
  const row = await getRow("corporate_stay_quotes", id)
  if (!row) notFound()

  const property = row.corporate_stay_properties as { property_name?: string } | null
  const action = updateRecord.bind(null, "corporate_stay_quotes", id)

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref="/corporate-stay-quotes"
        backLabel="corporate stay quotes"
        title={`Quote${property?.property_name ? ` — ${property.property_name}` : ""}`}
      />
      <RecordForm config={config} row={row} action={action} />
    </div>
  )
}
