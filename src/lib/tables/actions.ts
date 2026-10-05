"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { tableConfigs, type TableKey } from "./config"
import { updateRow, insertRow, deleteRow } from "./queries"
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

  try {
    await updateRow(tableKey, id, patch)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save changes." }
  }

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
