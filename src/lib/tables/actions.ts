"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { tableConfigs, type TableKey } from "./config"
import { updateRow, insertRow, deleteRow, getRow } from "./queries"
import { recordActivity } from "@/lib/activities"
import type { FieldConfig } from "./types"

export interface UpdateState {
  error?: string
  success?: boolean
}

function parseFormData(fields: FieldConfig[], formData: FormData): Record<string, unknown> {
  const values: Record<string, unknown> = {}

  for (const field of fields) {
    if (!field.editable) continue

    if (field.type === "boolean") {
      values[field.key] = formData.get(field.key) === "on"
      continue
    }

    const raw = formData.get(field.key)
    if (raw === null) continue
    const value = String(raw).trim()

    if (field.type === "number") {
      values[field.key] = value === "" ? null : Number(value)
    } else {
      values[field.key] = value === "" ? null : value
    }
  }

  return values
}

/**
 * Generic update action for any configured table. Bind `tableKey` and `id`
 * with `.bind(null, tableKey, id)` before handing this to useActionState,
 * since a "use server" file can only export plain async functions.
 */
export async function updateRecord(
  tableKey: TableKey,
  id: string,
  _prevState: UpdateState,
  formData: FormData
): Promise<UpdateState> {
  const config = tableConfigs[tableKey]
  const patch = parseFormData(config.fields, formData)

  // Lead tables log stage changes made through the edit form too.
  const newStatus = typeof patch.status === "string" ? patch.status : null
  const trackStage = newStatus !== null && PIPELINE_TABLES.has(tableKey)

  let previous: Record<string, unknown> | null = null
  try {
    if (trackStage) previous = await getRow(tableKey, id)
    await updateRow(tableKey, id, patch)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save changes." }
  }
  if (trackStage && newStatus) await logStageChange(tableKey, id, previous, newStatus)

  revalidatePath(`${config.route}/${id}`)
  revalidatePath(config.route)
  return { success: true }
}

/**
 * Generic create action for any configured table. Bind `tableKey` with
 * `.bind(null, tableKey)` before handing this to useActionState. On success
 * it redirects to the new record's detail page.
 */
export async function createRecord(
  tableKey: TableKey,
  _prevState: UpdateState,
  formData: FormData
): Promise<UpdateState> {
  const config = tableConfigs[tableKey]
  const data = parseFormData(config.fields, formData)

  let created
  try {
    created = await insertRow(tableKey, data)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create record." }
  }

  revalidatePath(config.route)
  redirect(`${config.route}/${created[config.primaryKey]}`)
}

/**
 * Generic delete action for any configured table. On success it redirects to
 * the table's list page; on failure (e.g. a foreign key still references the
 * row) it returns the error so the caller can show it.
 */
export async function deleteRecord(tableKey: TableKey, id: string): Promise<UpdateState> {
  const config = tableConfigs[tableKey]

  try {
    await deleteRow(tableKey, id)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete record." }
  }

  revalidatePath(config.route)
  redirect(config.route)
}

/**
 * Best-effort: records "Stage changed: a -> b" on the contact timeline. A
 * logging problem (or the activity table not existing yet) must never fail
 * the status change itself.
 */
async function logStageChange(
  tableKey: TableKey,
  id: string,
  previous: Record<string, unknown> | null,
  next: string
) {
  const before = previous?.status
  if (typeof before !== "string" || before === next) return
  try {
    await recordActivity({
      email: typeof previous?.email === "string" ? previous.email : null,
      record_table: tableKey,
      record_id: id,
      channel: "system",
      type: "stage_change",
      status: "logged",
      title: `Stage changed: ${before} → ${next}`,
      metadata: { from: before, to: next },
      created_by: "admin",
    })
  } catch (err) {
    console.error("Failed to log stage change", err)
  }
}

const PIPELINE_TABLES = new Set<string>(["landlord_leads", "partner_leads", "corporate_leads"])
const PIPELINE_STAGES = ["new", "contacted", "qualified", "converted", "declined"]

/**
 * One-field update used by the pipeline board to move a lead between
 * stages without going through a full edit form.
 */
export async function setRowStatus(
  tableKey: TableKey,
  id: string,
  status: string
): Promise<UpdateState> {
  const config = tableConfigs[tableKey]

  // Only the lead tables share this pipeline; reject anything else so the
  // action can't be used to write arbitrary statuses to other tables.
  if (!PIPELINE_TABLES.has(tableKey) || !PIPELINE_STAGES.includes(status)) {
    return { error: "Invalid pipeline stage." }
  }

  let previous: Record<string, unknown> | null = null
  try {
    previous = await getRow(tableKey, id)
    await updateRow(tableKey, id, { status })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update status." }
  }
  await logStageChange(tableKey, id, previous, status)

  revalidatePath(`${config.route}/${id}`)
  revalidatePath(config.route)
  return { success: true }
}
