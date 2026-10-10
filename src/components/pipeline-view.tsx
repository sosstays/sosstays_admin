"use client"

import { useState } from "react"
import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { LeadBoard } from "@/components/lead-board"
import type { TableConfig } from "@/lib/tables/types"
import type { Row } from "@/lib/tables/queries"

/** The one pipeline shared by landlord_leads, partner_leads and corporate_leads (matches their DB check constraint). */
export const PIPELINE_STAGES = ["new", "contacted", "qualified", "converted", "declined"]

/**
 * Toggles between the existing flat DataTable and a kanban-style pipeline
 * board for any lead table. Defaults to the board view.
 */
export function PipelineView({
  config,
  rows,
  titleFields,
  subtitleFields,
}: {
  config: TableConfig
  rows: Row[]
  titleFields: string[]
  subtitleFields?: string[]
}) {
  const [view, setView] = useState<"board" | "list">("board")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant={view === "board" ? "default" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={() => setView("board")}
        >
          <LayoutGrid className="h-4 w-4" strokeWidth={1.9} />
          Pipeline
        </Button>
        <Button
          type="button"
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={() => setView("list")}
        >
          <List className="h-4 w-4" strokeWidth={1.9} />
          List
        </Button>
      </div>

      {view === "board" ? (
        <LeadBoard
          config={config}
          rows={rows}
          stages={PIPELINE_STAGES}
          titleFields={titleFields}
          subtitleFields={subtitleFields}
        />
      ) : (
        <DataTable config={config} rows={rows} />
      )}
    </div>
  )
}
