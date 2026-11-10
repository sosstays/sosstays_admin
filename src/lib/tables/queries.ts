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

/** Inserts a new row from the table's editable fields and returns the created record. */
export async function insertRow(tableKey: TableKey, data: Record<string, unknown>): Promise<Row> {
  const config = tableConfigs[tableKey]
  const editableKeys = new Set(config.fields.filter((f) => f.editable).map((f) => f.key))
  const safeData: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (editableKeys.has(key)) safeData[key] = value
  }

  const { data: row, error } = await supabaseAdmin
    .from(tableKey)
    // Data is built dynamically from per-table field config, so it can't be
    // statically typed as one of the generated per-table Insert shapes.
    .insert(safeData as never)
    .select("*")
    .single()

  if (error) throw new Error(`Failed to create ${config.key}: ${error.message}`)
  return row as Row
}

export async function countRows(tableKey: TableKey): Promise<number> {
  const config = tableConfigs[tableKey]
  const { count, error } = await supabaseAdmin
    .from(tableKey)
    .select("*", { count: "exact", head: true })

  if (error) throw new Error(`Failed to count ${config.key}: ${error.message}`)
  return count ?? 0
}

export interface CorporateLeadPropertyMatch {
  lead_id: string | null
  location_needed: string | null
  lead_company: string | null
  lead_status: string | null
  property_id: string | null
  property_name: string | null
  area: string | null
  county: string | null
  match_score: number | null
}

const MATCH_SCORE_THRESHOLD = 0.3

/**
 * Candidate corporate-stay properties for a lead, from the read-only
 * `corporate_lead_property_matches` view (fuzzy-matched on location). Not a
 * configured table — this view cross-joins two tables and doesn't fit the
 * single-FK RelatedListConfig shape, so it's queried directly here instead.
 */
export async function listPropertyMatchesForLead(leadId: string): Promise<CorporateLeadPropertyMatch[]> {
  const { data, error } = await supabaseAdmin
    .from("corporate_lead_property_matches")
    .select("*")
    .eq("lead_id", leadId)
    .gt("match_score", MATCH_SCORE_THRESHOLD)
    .order("match_score", { ascending: false })

  if (error) throw new Error(`Failed to list property matches for lead ${leadId}: ${error.message}`)
  return (data ?? []) as CorporateLeadPropertyMatch[]
}

/** The reverse of listPropertyMatchesForLead: corporate leads interested in a given property's area. */
export async function listLeadMatchesForProperty(propertyId: string): Promise<CorporateLeadPropertyMatch[]> {
  const { data, error } = await supabaseAdmin
    .from("corporate_lead_property_matches")
    .select("*")
    .eq("property_id", propertyId)
    .gt("match_score", MATCH_SCORE_THRESHOLD)
    .order("match_score", { ascending: false })

  if (error) throw new Error(`Failed to list lead matches for property ${propertyId}: ${error.message}`)
  return (data ?? []) as CorporateLeadPropertyMatch[]
}

/** Deletes a single row by primary key. */
export async function deleteRow(tableKey: TableKey, id: string): Promise<void> {
  const config = tableConfigs[tableKey]
  const { error } = await supabaseAdmin.from(tableKey).delete().eq(config.primaryKey, id)

  if (error) throw new Error(`Failed to delete ${config.key} ${id}: ${error.message}`)
}
