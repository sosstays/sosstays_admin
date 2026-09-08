"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { FieldConfig, TableConfig } from "@/lib/tables/types"
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

  function renderField(field: FieldConfig) {
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
          <Label className="text-[var(--ink-soft)]">{field.label}</Label>
          <p className="rounded-lg bg-[var(--warm-cream)] px-3 py-2 text-sm">
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
          <Label className="text-[var(--ink-soft)]">{field.label}</Label>
          <p className="rounded-lg bg-[var(--warm-cream)] px-3 py-2 text-sm text-[var(--ink)]">
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
  }

  const groups = config.formGroups ?? [
    { label: "Details", fields: config.fields.map((f) => f.key) },
  ]

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {groups.map((group) => (
        <div
          key={group.label}
          className="rounded-2xl border border-[var(--border-soft)] bg-white p-6"
        >
          <h2 className="section-title mb-4 text-lg font-semibold text-[var(--ink)]">
            {group.label}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {group.fields.map((key) => renderField(config.fields.find((f) => f.key === key)!))}
          </div>
        </div>
      ))}

      {state.error ? (
        <p className="rounded-md bg-[var(--error-bg)] px-3 py-2 text-sm text-[var(--error)]">
          {state.error}
        </p>
      ) : null}
      {state.success ? <p className="text-sm text-[var(--forest-deep)]">Saved.</p> : null}

      <div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-[var(--forest)] text-[var(--cream)] hover:bg-[var(--forest-deep)]"
        >
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
