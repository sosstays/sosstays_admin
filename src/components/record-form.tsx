"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { TableConfig } from "@/lib/tables/types"
import type { Row } from "@/lib/tables/queries"
import { formatValue } from "@/lib/tables/format"
import type { UpdateState } from "@/lib/tables/actions"
import { tableConfigs } from "@/lib/tables/config"

export function RecordForm({
  config,
  row,
  action,
}: {
  config: TableConfig
  row: Row
  action: (state: UpdateState, formData: FormData) => Promise<UpdateState>
}) {
  const [state, formAction, pending] = useActionState(action, {})
  const relationByField = new Map((config.relations ?? []).map((r) => [r.field, r]))

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {config.fields.map((field) => {
          const value = row[field.key]
          const relation = relationByField.get(field.key)

          if (relation) {
            const related = row[relation.targetTable] as Row | null
            const relatedConfig = tableConfigs[relation.targetTable as keyof typeof tableConfigs]
            const display = related
              ? relation.labelFields.map((f) => related[f]).filter(Boolean).join(" ")
              : null

            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground">{field.label}</Label>
                <p className="rounded-md border border-transparent px-3 py-2 text-sm">
                  {display && related ? (
                    <Link
                      href={`${relatedConfig.route}/${related[relatedConfig.primaryKey]}`}
                      className="underline underline-offset-2"
                    >
                      {display}
                    </Link>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            )
          }

          if (!field.editable) {
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground">{field.label}</Label>
                <p className="rounded-md border border-transparent px-3 py-2 text-sm">
                  {formatValue(value, field.type)}
                </p>
              </div>
            )
          }

          if (field.type === "boolean") {
            return (
              <div key={field.key} className="flex items-center gap-2 pt-6">
                <input
                  id={field.key}
                  name={field.key}
                  type="checkbox"
                  defaultChecked={Boolean(value)}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor={field.key}>{field.label}</Label>
              </div>
            )
          }

          if (field.type === "textarea") {
            return (
              <div key={field.key} className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Textarea
                  id={field.key}
                  name={field.key}
                  defaultValue={(value as string) ?? ""}
                  rows={4}
                />
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
                defaultValue={(value as string | number) ?? ""}
              />
            </div>
          )
        })}
      </div>

      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-600">Saved.</p> : null}

      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
