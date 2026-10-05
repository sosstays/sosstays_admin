import { notFound } from "next/navigation"
import { RecordForm } from "@/components/record-form"
import { DetailHeader } from "@/components/detail-header"
import { tableConfigs } from "@/lib/tables/config"
import { getRow } from "@/lib/tables/queries"
import { updateRecord } from "@/lib/tables/actions"

export default async function CorporateLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const config = tableConfigs.corporate_leads
  const row = await getRow("corporate_leads", id)
  if (!row) notFound()

  const action = updateRecord.bind(null, "corporate_leads", id)

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader backHref="/corporate-leads" backLabel="corporate leads" title={String(row.company ?? row.name ?? row.email)} />
      <RecordForm config={config} row={row} action={action} />
    </div>
  )
}
