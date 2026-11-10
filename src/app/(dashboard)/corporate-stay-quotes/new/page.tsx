import { NewRecordForm } from "@/components/new-record-form"
import { DetailHeader } from "@/components/detail-header"
import { tableConfigs } from "@/lib/tables/config"
import { getRow } from "@/lib/tables/queries"
import { createRecord } from "@/lib/tables/actions"

export default async function NewCorporateStayQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ property_id?: string }>
}) {
  const { property_id: propertyId } = await searchParams
  const config = tableConfigs.corporate_stay_quotes
  const action = createRecord.bind(null, "corporate_stay_quotes")
  const property = propertyId ? await getRow("corporate_stay_properties", propertyId) : null

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref={property ? `/corporate-stay-properties/${propertyId}` : "/corporate-stay-quotes"}
        backLabel={property ? String(property.property_name) : "corporate stay quotes"}
        title={property ? `New quote for ${property.property_name}` : "New corporate stay quote"}
      />
      <NewRecordForm
        config={config}
        action={action}
        initialValues={propertyId ? { property_id: propertyId } : undefined}
      />
    </div>
  )
}
