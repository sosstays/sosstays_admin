import "server-only"
import { supabaseAdmin } from "@/lib/supabase/server"

const BUCKET = "corporate-stay-photos"
const PUBLIC_URL_MARKER = `/object/public/${BUCKET}/`

/** Slugifies a filename segment so it's safe as a Storage object path component. */
function safeFilename(filename: string): string {
  const cleaned = filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "")
  return cleaned || "photo"
}

/**
 * Uploads one photo into `corporate-stay-photos/<propertyId>/<...>` and
 * returns its public URL. The bucket is public-read (see the
 * create_corporate_stay_photos_bucket migration) with writes restricted to
 * the service role, so this must only ever run server-side.
 */
export async function uploadCorporateStayPhoto(
  propertyId: string,
  filename: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  const path = `${propertyId}/${Date.now()}-${safeFilename(filename)}`
  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, data, {
    contentType,
    upsert: true,
  })
  if (error) throw new Error(`Failed to upload photo: ${error.message}`)

  const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
  return pub.publicUrl
}

/** Best-effort: removes the underlying Storage object for a public photo URL. */
export async function deleteCorporateStayPhotoByUrl(url: string): Promise<void> {
  const markerIndex = url.indexOf(PUBLIC_URL_MARKER)
  if (markerIndex === -1) return
  const path = url.slice(markerIndex + PUBLIC_URL_MARKER.length)
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path])
  if (error) console.error(`Failed to delete corporate stay photo at ${path}`, error)
}

/** Downloads a photo from a public URL (e.g. an Airbnb/Booking.com CDN URL) and re-hosts it in our own bucket. */
export async function fetchAndUploadCorporateStayPhoto(
  propertyId: string,
  sourceUrl: string,
  filename: string
): Promise<string> {
  const res = await fetch(sourceUrl)
  if (!res.ok) throw new Error(`Failed to fetch ${sourceUrl}: ${res.status}`)
  const contentType = res.headers.get("content-type") || "image/jpeg"
  const buffer = Buffer.from(await res.arrayBuffer())
  return uploadCorporateStayPhoto(propertyId, filename, buffer, contentType)
}
