import type { FieldType } from "./types"

export function formatValue(value: unknown, type: FieldType): string {
  if (value === null || value === undefined || value === "") return "—"

  switch (type) {
    case "boolean":
      return value ? "Yes" : "No"
    case "date":
      return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    case "datetime":
      return new Date(String(value)).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    case "time":
      return String(value).slice(0, 5)
    case "number":
      return typeof value === "number"
        ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : String(value)
    default:
      return String(value)
  }
}
