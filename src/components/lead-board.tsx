"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { setRowStatus } from "@/lib/tables/actions";
import { getField, type TableConfig } from "@/lib/tables/types";
import type { TableKey } from "@/lib/tables/config";
import { formatValue } from "@/lib/tables/format";
import type { Row } from "@/lib/tables/queries";

/** Human labels for the shared 5-stage lead pipeline (new/contacted/qualified/converted/declined). */
const STAGE_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  declined: "Declined",
};

/**
 * Kanban-style board for any table that has a `status` column matching the
 * lead pipeline enum. Moving a card's dropdown writes the new status via
 * `setRowStatus` and updates the local copy optimistically.
 */
export function LeadBoard({
  config,
  rows,
  stages,
  titleFields,
  subtitleFields,
}: {
  config: TableConfig;
  rows: Row[];
  stages: string[];
  titleFields: string[];
  subtitleFields?: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const [localRows, setLocalRows] = useState(rows);
  const [error, setError] = useState<string | null>(null);

  function title(row: Row): string {
    return (
      titleFields
        .map((f) => row[f])
        .filter(Boolean)
        .join(" ") || "—"
    );
  }

  function subtitle(row: Row): string {
    return (subtitleFields ?? [])
      .map((f) => formatValue(row[f], getField(config, f).type))
      .filter((v) => v && v !== "—")
      .join(" · ");
  }

  function moveStage(id: string, nextStatus: string) {
    const previous = localRows;
    setError(null);
    setLocalRows((current) =>
      current.map((r) =>
        String(r[config.primaryKey]) === id ? { ...r, status: nextStatus } : r,
      ),
    );
    startTransition(async () => {
      const result = await setRowStatus(config.key as TableKey, id, nextStatus);
      // Roll the card back if the save didn't go through.
      if (result.error) {
        setLocalRows(previous);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <p className="rounded-md bg-[var(--error-bg)] px-3 py-2 text-sm text-[var(--error)]">
          {error}
        </p>
      ) : null}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stages.map((stage) => {
          const stageRows = localRows.filter(
            (r) => String(r.status ?? "") === stage,
          );
          return (
            <div key={stage} className="flex w-72 shrink-0 flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
                  {STAGE_LABELS[stage] ?? stage}
                </h3>
                <span className="rounded-full bg-[var(--warm-cream)] px-2 py-0.5 text-xs font-medium text-[var(--ink-soft)]">
                  {stageRows.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {stageRows.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--border-soft)] p-4 text-center text-xs text-muted-foreground">
                    Empty
                  </div>
                ) : (
                  stageRows.map((row) => {
                    const id = String(row[config.primaryKey]);
                    return (
                      <div
                        key={id}
                        className="flex flex-col gap-2 rounded-xl border border-[var(--border-soft)] bg-white p-3 shadow-sm"
                      >
                        <Link
                          href={`${config.route}/${id}`}
                          className="font-medium text-[var(--ink)] hover:underline"
                        >
                          {title(row)}
                        </Link>
                        {subtitle(row) ? (
                          <p className="text-xs text-[var(--ink-soft)]">
                            {subtitle(row)}
                          </p>
                        ) : null}
                        <select
                          value={stage}
                          disabled={isPending}
                          onChange={(e) => moveStage(id, e.target.value)}
                          className="mt-1 rounded-lg border border-[var(--border-soft)] bg-white px-2 py-1 text-xs outline-none focus:border-[var(--sage)] disabled:opacity-50"
                        >
                          {stages.map((s) => (
                            <option key={s} value={s}>
                              {STAGE_LABELS[s] ?? s}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
