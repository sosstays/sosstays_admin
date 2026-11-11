"use client"

import { useState, useTransition } from "react"
import { DetailHeader } from "@/components/detail-header"
import { Button } from "@/components/ui/button"
import { runPhotoBackfill } from "@/lib/tables/actions"
import type { BackfillPropertyResult } from "@/lib/tables/corporateStayPhotoBackfill"

export default function BackfillCorporateStayPhotosPage() {
  const [pending, startTransition] = useTransition()
  const [results, setResults] = useState<BackfillPropertyResult[] | null>(null)

  function handleRun() {
    startTransition(async () => {
      setResults(await runPhotoBackfill())
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref="/corporate-stay-properties"
        backLabel="corporate stay properties"
        title="Backfill photos (one-off)"
      />

      <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-6">
        <p className="mb-4 text-sm leading-relaxed text-[var(--ink-soft)]">
          Downloads real photos for the 8 properties that launched with none: 6 from their own public
          Airbnb/Booking.com listing photos (re-hosted here, never hotlinked), and 2 (Tinil House, Cosy
          Cottage Broadford — no listing link) from the files handed off directly. Safe to run more than
          once — it appends to each property&apos;s existing photos rather than replacing them.
        </p>
        <Button
          onClick={handleRun}
          disabled={pending}
          className="bg-[var(--forest)] text-[var(--cream)] hover:bg-[var(--forest-deep)]"
        >
          {pending ? "Running..." : "Run backfill"}
        </Button>
      </div>

      {results && (
        <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-6">
          <h2 className="section-title mb-4 text-lg font-semibold text-[var(--ink)]">Results</h2>
          <ul className="flex flex-col divide-y divide-[var(--border-soft)] text-sm">
            {results.map((r) => (
              <li key={r.propertyId} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-[var(--ink)]">{r.label}</span>
                {r.error ? (
                  <span className="text-[var(--error)]">{r.error}</span>
                ) : (
                  <span className="text-[var(--forest-deep)]">{r.uploaded} photo(s) uploaded</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
