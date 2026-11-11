import { DataTable } from "@/components/data-table"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function ShopOrdersPage() {
  const rows = await listRows("shop_orders")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Shop Orders</h1>
      <DataTable config={tableConfigs.shop_orders} rows={rows} />
    </div>
  )
}
