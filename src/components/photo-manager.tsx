"use client"

import { useState, useTransition } from "react"
import {
  addCorporateStayPhotos,
  removeCorporateStayPhoto,
  reorderCorporateStayPhotos,
} from "@/lib/tables/actions"

/**
 * Upload/remove/reorder widget for a corporate stay property's photo_urls
 * array. Persists immediately on each action (upload, remove, reorder)
 * rather than waiting for the surrounding RecordForm's "Save changes" —
 * there's no pending/unsaved state to lose here, each action is already
 * durable the moment it completes.
 */
export function PhotoManager({
  propertyId,
  initialUrls,
}: {
  propertyId: string
  initialUrls: string[]
}) {
  const [urls, setUrls] = useState(initialUrls)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    const formData = new FormData()
    for (const file of Array.from(files)) formData.append("files", file)
    e.target.value = ""

    setError(null)
    startTransition(async () => {
      const result = await addCorporateStayPhotos(propertyId, formData)
      if (result.error) setError(result.error)
      if (result.urls) setUrls(result.urls)
    })
  }

  function handleRemove(url: string) {
    setError(null)
    startTransition(async () => {
      const result = await removeCorporateStayPhoto(propertyId, url)
      if (result.error) setError(result.error)
      if (result.urls) setUrls(result.urls)
    })
  }

  function handleMove(url: string, direction: -1 | 1) {
    const index = urls.indexOf(url)
    const swapIndex = index + direction
    if (swapIndex < 0 || swapIndex >= urls.length) return
    const next = [...urls]
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
    setUrls(next)
    startTransition(async () => {
      const result = await reorderCorporateStayPhotos(propertyId, next)
      if (result.error) setError(result.error)
    })
  }

  return (
    <div className="flex flex-col gap-3 sm:col-span-2">
      {urls.length === 0 ? (
        <p className="text-sm text-muted-foreground">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {urls.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--border-soft)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary Supabase Storage URL, not a next/image-whitelisted host */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-start justify-between p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(url, -1)}
                      disabled={pending}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                      aria-label="Move earlier"
                    >
                      ‹
                    </button>
                  )}
                  {index < urls.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(url, 1)}
                      disabled={pending}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                      aria-label="Move later"
                    >
                      ›
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  disabled={pending}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                  aria-label="Remove photo"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border-soft)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--ink)] hover:border-[var(--sage)]">
        {pending ? "Working..." : "Add photos"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={pending}
          onChange={handleUpload}
        />
      </label>
      {error && <p className="text-sm text-[var(--error)]">{error}</p>}
    </div>
  )
}
