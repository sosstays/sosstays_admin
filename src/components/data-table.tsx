import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getField, type TableConfig } from "@/lib/tables/types"
import { formatValue } from "@/lib/tables/format"
import type { Row } from "@/lib/tables/queries"

export function DataTable({ config, rows }: { config: TableConfig; rows: Row[] }) {
  const relationByField = new Map(
    (config.relations ?? []).map((r) => [r.field, r])
  )

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {config.listFields.map((key) => (
              <TableHead key={key}>{getField(config, key).label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={config.listFields.length}
                className="text-center text-muted-foreground"
              >
                No {config.pluralLabel.toLowerCase()} found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={String(row[config.primaryKey])} className="cursor-pointer">
                {config.listFields.map((key) => {
                  const relation = relationByField.get(key)
                  let content: React.ReactNode

                  if (relation) {
                    const related = row[relation.targetTable] as Row | null
                    content = related
                      ? relation.labelFields.map((f) => related[f]).filter(Boolean).join(" ")
                      : "—"
                  } else {
                    content = formatValue(row[key], getField(config, key).type)
                  }

                  return (
                    <TableCell key={key}>
                      <Link
                        href={`${config.route}/${row[config.primaryKey]}`}
                        className="block"
                      >
                        {content || "—"}
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
  )
}
