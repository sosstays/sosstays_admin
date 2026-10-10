import "server-only"
import type { SupabaseClient } from "@supabase/supabase-js"
import { supabaseAdmin } from "@/lib/supabase/server"

export type ActivityChannel = "whatsapp" | "email" | "sms" | "call" | "note" | "system"
export type ActivityStatus =
  | "sent"
  | "failed"
  | "skipped"
  | "delivered"
  | "read"
  | "received"
  | "logged"

export interface Activity {
  id: string
  email: string | null
  booking_id: string | null
  record_table: string | null
  record_id: string | null
  channel: ActivityChannel
  direction: "outbound" | "inbound"
  type: string
  status: ActivityStatus
  title: string
  body: string | null
  error: string | null
  external_id: string | null
  metadata: Record<string, unknown>
  created_by: string | null
  occurred_at: string
  created_at: string
}

export type NewActivity = Pick<Activity, "channel" | "type" | "title"> &
  Partial<
    Pick<
      Activity,
      | "email"
      | "booking_id"
      | "record_table"
      | "record_id"
      | "direction"
      | "status"
      | "body"
      | "error"
      | "external_id"
      | "metadata"
      | "created_by"
    >
  >

// The `activities` table (migration 0013) isn't in the generated Database
// types, so go through an untyped client.
const db = supabaseAdmin as unknown as SupabaseClient

// Postgres "undefined_table" / PostgREST "not in schema cache": the table
// hasn't been created on this project yet. Treat that as "no activity".
function isMissingTable(error: { code?: string } | null): boolean {
  return error?.code === "42P01" || error?.code === "PGRST205"
}

/** Activity rows for a contact: matched by email or by any of their bookings. */
export async function listActivities(email: string, bookingIds: string[]): Promise<Activity[]> {
  const byEmail = await db.from("activities").select("*").eq("email", email.toLowerCase())
  if (byEmail.error) {
    if (isMissingTable(byEmail.error)) return []
    throw new Error(`Failed to list activities: ${byEmail.error.message}`)
  }

  const rows = new Map<string, Activity>()
  for (const row of (byEmail.data ?? []) as Activity[]) rows.set(row.id, row)

  if (bookingIds.length > 0) {
    const byBooking = await db.from("activities").select("*").in("booking_id", bookingIds)
    if (byBooking.error) throw new Error(`Failed to list activities: ${byBooking.error.message}`)
    for (const row of (byBooking.data ?? []) as Activity[]) rows.set(row.id, row)
  }

  return [...rows.values()]
}

/** Most recent failed or skipped activities, for the dashboard "needs attention" card. */
export async function listAttention(limit = 8): Promise<Activity[]> {
  const { data, error } = await db
    .from("activities")
    .select("*")
    .in("status", ["failed", "skipped"])
    .order("occurred_at", { ascending: false })
    .limit(limit)

  if (error) {
    if (isMissingTable(error)) return []
    throw new Error(`Failed to list activities needing attention: ${error.message}`)
  }
  return (data ?? []) as Activity[]
}

/** Inserts one activity row. Returns an error message instead of throwing. */
export async function recordActivity(activity: NewActivity): Promise<{ error?: string }> {
  const { error } = await db.from("activities").insert({
    ...activity,
    email: activity.email?.trim().toLowerCase() || null,
  })

  if (!error) return {}
  if (isMissingTable(error)) return { error: "The activity log isn't set up on this database yet." }
  return { error: error.message }
}
