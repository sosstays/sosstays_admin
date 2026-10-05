import { DataTable } from "@/components/data-table"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function NewsletterPage() {
  const rows = await listRows("newsletter_subscribers")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Newsletter Subscribers</h1>
      <DataTable config={tableConfigs.newsletter_subscribers} rows={rows} />
    </div>
  )
}
