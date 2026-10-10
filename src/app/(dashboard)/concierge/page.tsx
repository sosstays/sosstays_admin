import { DataTable } from "@/components/data-table"
import { tableConfigs } from "@/lib/tables/config"
import { listRows } from "@/lib/tables/queries"

export default async function ConciergePage() {
  const rows = await listRows("concierge_signups")

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">Concierge Guests</h1>
        <p className="text-sm text-[var(--ink-soft)]">
          Everyone who signed in on a property&apos;s concierge page. Use &ldquo;No booking&rdquo; to
          see guests who arrived without a booking link.
        </p>
      </div>
      <DataTable config={tableConfigs.concierge_signups} rows={rows} />
    </div>
  )
}
