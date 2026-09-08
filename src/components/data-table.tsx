"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Search, Columns3 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getField, type TableConfig } from "@/lib/tables/types"
import { formatValue } from "@/lib/tables/format"
import { StatusBadge } from "@/components/status-badge"
import type { Row } from "@/lib/tables/queries"

function initials(row: Row, fields: string[]): string {
  return fields
    .map((f) => String(row[f] ?? "").trim().charAt(0))
    .filter(Boolean)
    .join("")
    .toUpperCase()
}

export function DataTable({ config, rows }: { config: TableConfig; rows: Row[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<string[]>(config.listFields)

  const storageKey = `sos-admin:columns:${config.key}`

  // Column choice is a per-viewer convenience — read the saved preference
  // after mount so the server-rendered markup (default listFields) matches
  // on first paint and there's no hydration mismatch.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const savedKeys: string[] = JSON.parse(saved)
      const validKeys = savedKeys.filter((k) => config.fields.some((f) => f.key === k))
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (validKeys.length > 0) setVisibleKeys(validKeys)
    } catch {
      // Ignore unavailable/blocked storage — falls back to listFields.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  function toggleColumn(key: string, checked: boolean) {
    setVisibleKeys((current) => {
      const next = checked ? [...current, key] : current.filter((k) => k !== key)
      // Preserve the table's declared field order regardless of toggle order.
      const ordered = config.fields.map((f) => f.key).filter((k) => next.includes(k))
      const safe = ordered.length > 0 ? ordered : current
      try {
        localStorage.setItem(storageKey, JSON.stringify(safe))
      } catch {
        // Ignore unavailable/blocked storage.
      }
      return safe
    })
  }

  const relationByField = new Map((config.relations ?? []).map((r) => [r.field, r]))
  const hasStatusColumn = config.listFields.includes("status")

  const statuses = useMemo(() => {
    if (!hasStatusColumn) return []
    return Array.from(new Set(rows.map((r) => String(r.status ?? "")).filter(Boolean)))
  }, [rows, hasStatusColumn])

  function cellText(row: Row, key: string): string {
    const relation = relationByField.get(key)
    if (relation) {
      const related = row[relation.targetTable] as Row | null
      return related ? relation.labelFields.map((f) => related[f]).filter(Boolean).join(" ") : ""
    }
    return formatValue(row[key], getField(config, key).type)
  }

  const filteredRows = rows.filter((row) => {
    if (statusFilter && String(row.status ?? "") !== statusFilter) return false
    if (!search.trim()) return true
    const haystack = visibleKeys.map((key) => cellText(row, key)).join(" ").toLowerCase()
    return haystack.includes(search.trim().toLowerCase())
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]" strokeWidth={1.9} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${config.pluralLabel.toLowerCase()}...`}
            className="w-full rounded-lg border border-[var(--border-soft)] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--sage)]"
          />
        </div>

        {hasStatusColumn && statuses.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            <FilterPill active={statusFilter === null} onClick={() => setStatusFilter(null)}>
              All
            </FilterPill>
            {statuses.map((status) => (
              <FilterPill
                key={status}
                active={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </FilterPill>
            ))}
          </div>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="ml-auto gap-1.5">
                <Columns3 className="h-4 w-4" strokeWidth={1.9} />
                Columns
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Show fields</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {config.fields.map((field) => (
                <DropdownMenuCheckboxItem
                  key={field.key}
                  checked={visibleKeys.includes(field.key)}
                  onCheckedChange={(checked) => toggleColumn(field.key, checked)}
                  closeOnClick={false}
                >
                  {field.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border-soft)] bg-white">
        <Table>
          <TableHeader>
            <TableRow className="!border-b-0 bg-[var(--warm-cream)] hover:bg-[var(--warm-cream)]">
              {visibleKeys.map((key) => (
                <TableHead
                  key={key}
                  className="whitespace-nowrap text-xs font-medium uppercase tracking-wide text-[var(--ink-soft)]"
                >
                  {getField(config, key).label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleKeys.length}
                  className="text-center text-muted-foreground"
                >
                  No {config.pluralLabel.toLowerCase()} found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row) => (
                <TableRow
                  key={String(row[config.primaryKey])}
                  className="cursor-pointer border-t border-[var(--border-soft)] hover:bg-[var(--sage-pale)]"
                >
                  {visibleKeys.map((key, index) => {
                    const isStatus = key === "status"
                    const showAvatar = index === 0 && (config.avatarFields?.length ?? 0) > 0

                    return (
                      <TableCell key={key} className="p-0">
                        <Link
                          href={`${config.route}/${row[config.primaryKey]}`}
                          className="flex items-center gap-2.5 whitespace-nowrap px-4 py-3"
                        >
                          {showAvatar ? (
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--sage-pale)] font-heading text-xs font-bold text-[var(--forest-deep)]">
                              {initials(row, config.avatarFields!)}
                            </span>
                          ) : null}
                          {isStatus ? (
                            <StatusBadge status={row[key] as string | null} />
                          ) : (
                            cellText(row, key) || "—"
                          )}
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

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-[var(--forest)] px-3 py-1 text-xs font-medium capitalize text-[var(--cream)]"
          : "rounded-full border border-[var(--border-soft)] bg-white px-3 py-1 text-xs font-medium capitalize text-[var(--ink-soft)] hover:border-[var(--sage)]"
      }
    >
      {children}
    </button>
  )
}
