"use client"

import { useActionState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addActivityNote } from "@/lib/activities-actions"
import type { UpdateState } from "@/lib/tables/actions"

/** Logs a manual note or call on a contact's timeline. */
export function AddActivityForm({ email }: { email: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState(
    async (prev: UpdateState, formData: FormData) => {
      const result = await addActivityNote(email, prev, formData)
      if (result.success) formRef.current?.reset()
      return result
    },
    {}
  )

  return (
    <form ref={formRef} action={formAction} className="mb-6 flex flex-col gap-2">
      <Textarea
        name="body"
        rows={2}
        maxLength={2000}
        placeholder="Add a note, or log a call…"
        required
      />
      <div className="flex flex-wrap items-center gap-2">
        <select
          name="kind"
          defaultValue="note"
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-[var(--sage)]"
        >
          <option value="note">Note</option>
          <option value="call_out">Outbound call</option>
          <option value="call_in">Inbound call</option>
        </select>
        <Button
          type="submit"
          size="sm"
          disabled={pending}
          className="bg-[var(--forest)] text-[var(--cream)] hover:bg-[var(--forest-deep)]"
        >
          {pending ? "Saving..." : "Add to timeline"}
        </Button>
        {state.error ? <span className="text-sm text-[var(--error)]">{state.error}</span> : null}
      </div>
    </form>
  )
}
