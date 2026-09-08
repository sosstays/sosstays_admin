"use server"

import { revalidatePath } from "next/cache"
import { tableConfigs, type TableKey } from "./config"
import { updateRow } from "./queries"

export interface UpdateState {
  error?: string
  success?: boolean
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
  const patch: Record<string, unknown> = {}

  for (const field of config.fields) {
    if (!field.editable) continue

    if (field.type === "boolean") {
      patch[field.key] = formData.get(field.key) === "on"
      continue
    }

    const raw = formData.get(field.key)
    if (raw === null) continue
    const value = String(raw).trim()

    if (field.type === "number") {
      patch[field.key] = value === "" ? null : Number(value)
    } else {
      patch[field.key] = value === "" ? null : value
    }
  }

  try {
    await updateRow(tableKey, id, patch)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save changes." }
  }

  revalidatePath(`${config.route}/${id}`)
  revalidatePath(config.route)
  return { success: true }
}
