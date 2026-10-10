"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth/session"
import { recordActivity } from "@/lib/activities"
import type { UpdateState } from "@/lib/tables/actions"

const KINDS = {
  note: { channel: "note", direction: "outbound", title: "Note added" },
  call_out: { channel: "call", direction: "outbound", title: "Outbound call logged" },
  call_in: { channel: "call", direction: "inbound", title: "Inbound call logged" },
} as const

const MAX_BODY = 2000

/**
 * Logs a manual note or call against a contact. Bind `email` with
 * `.bind(null, email)` before handing this to useActionState.
 */
export async function addActivityNote(
  email: string,
  _prevState: UpdateState,
  formData: FormData
): Promise<UpdateState> {
  const session = await getSession()
  if (!session.isLoggedIn) return { error: "You need to be signed in." }

  const kind = KINDS[String(formData.get("kind")) as keyof typeof KINDS]
  if (!kind) return { error: "Choose what to log." }

  const body = String(formData.get("body") ?? "").trim()
  if (!body) return { error: "Write something first." }
  if (body.length > MAX_BODY) return { error: `Keep it under ${MAX_BODY} characters.` }

  const result = await recordActivity({
    email,
    channel: kind.channel,
    direction: kind.direction,
    type: kind.channel,
    status: "logged",
    title: kind.title,
    body,
    // No staff accounts yet, so entries can't be attributed to a person.
    created_by: "admin",
  })
  if (result.error) return { error: result.error }

  revalidatePath("/contacts/[slug]", "page")
  return { success: true }
}
