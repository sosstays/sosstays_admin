import { notFound } from "next/navigation"
import { RecordForm } from "@/components/record-form"
import { DetailHeader } from "@/components/detail-header"
import { tableConfigs } from "@/lib/tables/config"
import { getRow } from "@/lib/tables/queries"
import { updateRecord } from "@/lib/tables/actions"

export default async function PartnerLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const config = tableConfigs.partner_leads
  const row = await getRow("partner_leads", id)
  if (!row) notFound()

  const action = updateRecord.bind(null, "partner_leads", id)

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader backHref="/partner-leads" backLabel="partner leads" title={String(row.business_name ?? row.contact_name ?? row.email)} />
      <RecordForm config={config} row={row} action={action} />
    </div>
  )
}
