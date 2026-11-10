import { NewRecordForm } from "@/components/new-record-form"
import { DetailHeader } from "@/components/detail-header"
import { tableConfigs } from "@/lib/tables/config"
import { createRecord } from "@/lib/tables/actions"

export default function NewCorporateStayPropertyPage() {
  const config = tableConfigs.corporate_stay_properties
  const action = createRecord.bind(null, "corporate_stay_properties")

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref="/corporate-stay-properties"
        backLabel="corporate stay properties"
        title="New corporate stay property"
      />
      <NewRecordForm config={config} action={action} />
    </div>
  )
}
