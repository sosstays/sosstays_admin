import { NewRecordForm } from "@/components/new-record-form"
import { DetailHeader } from "@/components/detail-header"
import { tableConfigs } from "@/lib/tables/config"
import { createRecord } from "@/lib/tables/actions"

export default function NewPropertyPage() {
  const config = tableConfigs.properties
  const action = createRecord.bind(null, "properties")

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader backHref="/properties" backLabel="properties" title="New property" />
      <NewRecordForm config={config} action={action} />
    </div>
  )
}
