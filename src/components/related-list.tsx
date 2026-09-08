import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { tableConfigs, type TableKey } from "@/lib/tables/config"
import { getField } from "@/lib/tables/types"
import { formatValue } from "@/lib/tables/format"
import { StatusBadge } from "@/components/status-badge"
import type { Row } from "@/lib/tables/queries"

export function RelatedList({
  label,
  sourceTable,
  columns,
  rows,
}: {
  label: string
  sourceTable: TableKey
  columns: string[]
  rows: Row[]
}) {
  const config = tableConfigs[sourceTable]
  const relationByField = new Map((config.relations ?? []).map((r) => [r.field, r]))

  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-6">
      <h2 className="section-title mb-4 text-lg font-semibold text-[var(--ink)]">{label}</h2>
      <div className="overflow-hidden overflow-x-auto rounded-xl border border-[var(--border-soft)]">
        <Table>
          <TableHeader>
            <TableRow className="!border-b-0 bg-[var(--warm-cream)] hover:bg-[var(--warm-cream)]">
              {columns.map((key) => (
                <TableHead
                  key={key}
                  className="text-xs font-medium uppercase tracking-wide text-[var(--ink-soft)]"
                >
                  {getField(config, key).label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                  None.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={String(row[config.primaryKey])}
                  className="border-t border-[var(--border-soft)] hover:bg-[var(--sage-pale)]"
                >
                  {columns.map((key) => {
                    const relation = relationByField.get(key)
                    let content: React.ReactNode

                    if (key === "status") {
                      content = <StatusBadge status={row[key] as string | null} />
                    } else if (relation) {
                      const related = row[relation.targetTable] as Row | null
                      content = related
                        ? relation.labelFields.map((f) => related[f]).filter(Boolean).join(" ")
                        : "—"
                    } else {
                      content = formatValue(row[key], getField(config, key).type) || "—"
                    }

                    return (
                      <TableCell key={key} className="p-0">
                        <Link
                          href={`${config.route}/${row[config.primaryKey]}`}
                          className="block px-4 py-3"
                        >
                          {content}
                        </Link>
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
