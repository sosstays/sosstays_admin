import Link from "next/link"
import type { CorporateLeadPropertyMatch } from "@/lib/tables/queries"

function scorePercent(score: number | null): string {
  return `${Math.round((score ?? 0) * 100)}%`
}

/**
 * Renders rows from the read-only `corporate_lead_property_matches` view.
 * Used both ways: a lead's suggested properties, and a property's interested
 * leads — `variant` picks which side of the match to link through to.
 */
export function CorporateMatchPanel({
  label,
  emptyLabel,
  matches,
  variant,
}: {
  label: string
  emptyLabel: string
  matches: CorporateLeadPropertyMatch[]
  variant: "properties-for-lead" | "leads-for-property"
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-6">
      <h2 className="section-title mb-4 text-lg font-semibold text-[var(--ink)]">{label}</h2>

      {matches.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {matches.map((match, index) => {
            const key =
              variant === "properties-for-lead"
                ? `${match.property_id}-${index}`
                : `${match.lead_id}-${index}`

            const content =
              variant === "properties-for-lead" ? (
                <>
                  <div>
                    <p className="font-medium text-[var(--ink)]">{match.property_name ?? "—"}</p>
                    <p className="text-sm text-[var(--ink-soft)]">
                      {[match.area, match.county].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--sage-pale)] px-2.5 py-1 text-xs font-semibold text-[var(--forest-deep)]">
                    {scorePercent(match.match_score)} match
                  </span>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium text-[var(--ink)]">{match.lead_company ?? "—"}</p>
                    <p className="text-sm text-[var(--ink-soft)]">
                      Needs: {match.location_needed ?? "—"}
                      {match.lead_status ? ` · ${match.lead_status}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--sage-pale)] px-2.5 py-1 text-xs font-semibold text-[var(--forest-deep)]">
                    {scorePercent(match.match_score)} match
                  </span>
                </>
              )

            const href =
              variant === "properties-for-lead"
                ? match.property_id
                  ? `/corporate-stay-properties/${match.property_id}`
                  : null
                : match.lead_id
                  ? `/corporate-leads/${match.lead_id}`
                  : null

            return href ? (
              <Link
                key={key}
                href={href}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-soft)] px-4 py-3 transition-colors hover:border-[var(--sage)] hover:bg-[var(--sage-pale)]"
              >
                {content}
              </Link>
            ) : (
              <div
                key={key}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-soft)] px-4 py-3"
              >
                {content}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
