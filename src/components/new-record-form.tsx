"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { TableConfig } from "@/lib/tables/types"
import type { UpdateState } from "@/lib/tables/actions"

export function NewRecordForm({
  config,
  action,
}: {
  config: TableConfig
  action: (state: UpdateState, formData: FormData) => Promise<UpdateState>
}) {
  const [state, formAction, pending] = useActionState(action, {})
  const editableFields = config.fields.filter((f) => f.editable)

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {editableFields.map((field) => {
            if (field.type === "boolean") {
              return (
                <div key={field.key} className="flex items-center gap-2 pt-6">
                  <input
                    id={field.key}
                    name={field.key}
                    type="checkbox"
                    className="h-4 w-4 rounded border-input accent-[var(--forest)]"
                  />
                  <Label htmlFor={field.key}>{field.label}</Label>
                </div>
              )
            }

            if (field.type === "textarea") {
              return (
                <div key={field.key} className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Textarea id={field.key} name={field.key} rows={4} />
                </div>
              )
            }

            if (field.type === "select") {
              return (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <select
                    id={field.key}
                    name={field.key}
                    defaultValue={field.options?.[0] ?? ""}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus:border-[var(--sage)]"
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }

            const inputType =
              field.type === "date"
                ? "date"
                : field.type === "time"
                  ? "time"
                  : field.type === "number"
                    ? "number"
                    : "text"

            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  name={field.key}
                  type={inputType}
                  step={field.type === "number" ? "0.01" : undefined}
                />
              </div>
            )
          })}
        </div>
      </div>

      {state.error ? (
        <p className="rounded-md bg-[var(--error-bg)] px-3 py-2 text-sm text-[var(--error)]">
          {state.error}
        </p>
      ) : null}

      <div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-[var(--forest)] text-[var(--cream)] hover:bg-[var(--forest-deep)]"
        >
          {pending ? "Creating..." : `Create ${config.label.toLowerCase()}`}
        </Button>
      </div>
    </form>
  )
}
