import { notFound } from "next/navigation"
import { RecordForm } from "@/components/record-form"
import { DetailHeader } from "@/components/detail-header"
import { tableConfigs } from "@/lib/tables/config"
import { getRow } from "@/lib/tables/queries"
import { updateRecord } from "@/lib/tables/actions"

export default async function ShopOrdersDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const config = tableConfigs.shop_orders
  const row = await getRow("shop_orders", id)
  if (!row) notFound()

  const action = updateRecord.bind(null, "shop_orders", id)

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader backHref="/shop-orders" backLabel="shop orders" title={String(row.product_name ?? row.buyer_email)} />
      <RecordForm config={config} row={row} action={action} />
    </div>
  )
}
