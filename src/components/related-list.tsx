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

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">{label}</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((key) => (
                <TableHead key={key}>{getField(config, key).label}</TableHead>
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
                <TableRow key={String(row[config.primaryKey])}>
                  {columns.map((key) => (
                    <TableCell key={key}>
                      <Link href={`${config.route}/${row[config.primaryKey]}`} className="block">
                        {formatValue(row[key], getField(config, key).type)}
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
