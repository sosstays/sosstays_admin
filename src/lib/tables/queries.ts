import "server-only"
import { supabaseAdmin } from "@/lib/supabase/server"
import { tableConfigs, type TableKey } from "./config"

export type Row = Record<string, unknown>

function buildEmbeds(config: (typeof tableConfigs)[TableKey]): string {
  return (config.relations ?? [])
    .map((r) => {
      const targetConfig = tableConfigs[r.targetTable as TableKey]
      const columns = Array.from(new Set([targetConfig.primaryKey, ...r.labelFields]))
      return `${r.targetTable}!${r.field}(${columns.join(",")})`
    })
    .join(",")
}

function defaultOrderColumn(config: (typeof tableConfigs)[TableKey]): string {
  const hasCreatedAt = config.fields.some((f) => f.key === "created_at")
  return hasCreatedAt ? "created_at" : config.primaryKey
}

/** Fetches every row for a table, embedding any forward relations for display. */
export async function listRows(tableKey: TableKey): Promise<Row[]> {
  const config = tableConfigs[tableKey]
  const embeds = buildEmbeds(config)
  const select = embeds ? `*,${embeds}` : "*"

  const { data, error } = await supabaseAdmin
    .from(tableKey)
    .select(select)
    .order(defaultOrderColumn(config), { ascending: false, nullsFirst: false })

  if (error) throw new Error(`Failed to list ${config.key}: ${error.message}`)
  return (data ?? []) as unknown as Row[]
}

/** Fetches a single row by primary key, embedding any forward relations. */
export async function getRow(tableKey: TableKey, id: string): Promise<Row | null> {
  const config = tableConfigs[tableKey]
  const embeds = buildEmbeds(config)
  const select = embeds ? `*,${embeds}` : "*"

  const { data, error } = await supabaseAdmin
    .from(tableKey)
    .select(select)
    .eq(config.primaryKey, id)
    .maybeSingle()

  if (error) throw new Error(`Failed to load ${config.key} ${id}: ${error.message}`)
  return (data ?? null) as unknown as Row | null
}

/** Fetches every related row pointing back at `id` via a RelatedListConfig. */
export async function listRelated(
  sourceTable: TableKey,
  foreignKey: string,
  id: string
): Promise<Row[]> {
  const config = tableConfigs[sourceTable]
  const embeds = buildEmbeds(config)
  const select = embeds ? `*,${embeds}` : "*"
  const { data, error } = await supabaseAdmin
    .from(sourceTable)
    .select(select)
    .eq(foreignKey, id)
    .order(defaultOrderColumn(config), { ascending: false, nullsFirst: false })

  if (error) {
    throw new Error(
      `Failed to list related ${config.key} where ${foreignKey}=${id}: ${error.message}`
    )
  }
  return (data ?? []) as unknown as Row[]
}

/** Updates the editable fields of a row and returns the updated record. */
export async function updateRow(
  tableKey: TableKey,
  id: string,
  patch: Record<string, unknown>
): Promise<Row> {
  const config = tableConfigs[tableKey]
  const editableKeys = new Set(
    config.fields.filter((f) => f.editable).map((f) => f.key)
  )
  const safePatch: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(patch)) {
    if (editableKeys.has(key)) safePatch[key] = value
  }

  const { data, error } = await supabaseAdmin
    .from(tableKey)
    // Patch is built dynamically from per-table field config, so it can't be
    // statically typed as one of the generated per-table Update shapes.
    .update(safePatch as never)
    .eq(config.primaryKey, id)
    .select("*")
    .single()

  if (error) throw new Error(`Failed to update ${config.key} ${id}: ${error.message}`)
  return data as Row
}

export async function countRows(tableKey: TableKey): Promise<number> {
  const config = tableConfigs[tableKey]
  const { count, error } = await supabaseAdmin
    .from(tableKey)
    .select("*", { count: "exact", head: true })

  if (error) throw new Error(`Failed to count ${config.key}: ${error.message}`)
  return count ?? 0
}
