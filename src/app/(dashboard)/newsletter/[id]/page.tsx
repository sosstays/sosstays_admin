import { notFound } from "next/navigation"
import { RecordForm } from "@/components/record-form"
import { DetailHeader } from "@/components/detail-header"
import { tableConfigs } from "@/lib/tables/config"
import { getRow } from "@/lib/tables/queries"
import { updateRecord } from "@/lib/tables/actions"

export default async function SubscriberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const config = tableConfigs.newsletter_subscribers
  const row = await getRow("newsletter_subscribers", id)
  if (!row) notFound()

  const action = updateRecord.bind(null, "newsletter_subscribers", id)

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader backHref="/newsletter" backLabel="subscribers" title={String(row.email)} />
      <RecordForm config={config} row={row} action={action} />
    </div>
  )
}
