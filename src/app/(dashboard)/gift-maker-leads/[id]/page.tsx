import { notFound } from "next/navigation"
import { RecordForm } from "@/components/record-form"
import { DetailHeader } from "@/components/detail-header"
import { tableConfigs } from "@/lib/tables/config"
import { getRow } from "@/lib/tables/queries"
import { updateRecord } from "@/lib/tables/actions"

export default async function GiftMakerLeadsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const config = tableConfigs.gift_maker_leads
  const row = await getRow("gift_maker_leads", id)
  if (!row) notFound()

  const action = updateRecord.bind(null, "gift_maker_leads", id)

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader backHref="/gift-maker-leads" backLabel="gift maker leads" title={String(row.name ?? row.email)} />
      <RecordForm config={config} row={row} action={action} />
    </div>
  )
}
