import "server-only"
import fs from "fs/promises"
import path from "path"
import { getRow, updateRow } from "./queries"
import { uploadCorporateStayPhoto, fetchAndUploadCorporateStayPhoto } from "./photoStorage"

type RemoteSource = { kind: "url"; url: string; filename: string }
type LocalSource = { kind: "file"; relativePath: string; contentType: string }
type PhotoSource = RemoteSource | LocalSource

/**
 * One-off backfill manifest for the 8 corporate_stay_properties rows that
 * existed with no photos at all (see the 2026-11-11 photo-storage task).
 * 6 properties' photos are re-hosted from their own public Airbnb/Booking.com
 * listing photos (never hotlinked long-term — downloaded once here and
 * stored in our own `corporate-stay-photos` bucket); the remaining 2 (no
 * listing_url) use the photo files handed off directly, committed under
 * src/data/corporate-stay-photo-backfill/. Intended to run once, from the
 * admin's own "Backfill photos" page, which uses this app's own
 * service-role credentials — nothing here needs secrets of its own.
 */
const BACKFILL_MANIFEST: Record<string, { label: string; sources: PhotoSource[] }> = {
  "aaed3f49-e77a-4004-b9af-b8d586e4576d": {
    label: "Adare 4-Bed House",
    sources: [
      "16cccfad-475b-4f0d-b373-eeb740b5f86e",
      "38790998-d51b-410d-9c71-9010f3910512",
      "85c85603-e4ea-40b9-a58f-65feb92c5d1b",
      "b8ea4c41-bd9a-414e-a3ab-786913e0f7c3",
    ].map((id, i) => ({
      kind: "url" as const,
      url: `https://a0.muscache.com/im/pictures/hosting/Hosting-1497053182297198709/original/${id}.jpeg`,
      filename: `photo-${i + 1}.jpeg`,
    })),
  },
  "0ae255ea-6796-4d22-8e94-774bca61d00b": {
    label: "An tOileán",
    sources: [
      "1cdeaad4-9abc-4cc6-8188-f165d2160670",
      "d0bbbaef-b06b-46fb-b162-74a1716babc6",
      "146b14c6-c29b-48ec-b82b-8c1d53d756f1",
      "adf71db9-70ee-4443-9629-74484b07e7b8",
    ].map((id, i) => ({
      kind: "url" as const,
      url: `https://a0.muscache.com/im/pictures/hosting/Hosting-1716851800501799118/original/${id}.jpeg`,
      filename: `photo-${i + 1}.jpeg`,
    })),
  },
  "944dc9e2-0042-4835-9781-87143e662dc8": {
    label: "Peaceful Haven Cottage",
    sources: [
      "2ed87b59-6473-4105-ab83-5a900dab9a5b",
      "8359c63a-f1f6-41f7-9ccd-0f47ad9406f4",
      "7e04b640-132d-4361-8865-526058649608",
      "b28b7b94-febc-45e4-af86-59c9248b9237",
    ].map((id, i) => ({
      kind: "url" as const,
      url: `https://a0.muscache.com/im/pictures/hosting/Hosting-13424010/original/${id}.jpeg`,
      filename: `photo-${i + 1}.jpeg`,
    })),
  },
  "37641750-3b53-46e5-b819-e01fc93896be": {
    label: "Home in Carran",
    sources: [
      "73b628d2-e25e-40dc-971e-b6663378acf0",
      "8a75773f-9561-4b8d-bb9a-69b593808e67",
      "4d1ae77f-bb3d-4fc5-b11a-ea27e37b9088",
      "fff1bf68-bee4-4a0a-91ef-298ea13293b5",
    ].map((id, i) => ({
      kind: "url" as const,
      url: `https://a0.muscache.com/im/pictures/hosting/Hosting-42658887/original/${id}.jpeg`,
      filename: `photo-${i + 1}.jpeg`,
    })),
  },
  "84c5a73c-340a-4cb7-93f8-84bc1c443570": {
    label: "Self Catering Ennis Apartment",
    sources: [
      "v1731342589/odpil0o8chu5i5idrudn.png",
      "v1731343290/yxoymvtwyk4mw8qx4ajh.png",
      "v1731343300/xrh2ncf8yxww7uj82pba.png",
      "v1731343303/f5z75mmeigd51egickp5.png",
    ].map((suffix, i) => ({
      kind: "url" as const,
      url: `https://res.cloudinary.com/amenitiz/image/upload/${suffix}`,
      filename: `photo-${i + 1}.png`,
    })),
  },
  "2ef901df-f07f-4295-82cc-2dafe6796688": {
    label: "Larchlodge",
    sources: [
      { id: "842685477", size: "max1024x768", k: "c93c3b5ce08f24207a37da245427857c234bee197e44adc816e824c640cd0cb3" },
      { id: "623774311", size: "max500", k: "069f3b29fc9bb41595647572a56367a3c3c2e7712d012cd99294ccbd0425bfa4" },
      { id: "623775005", size: "max500", k: "54fc3b7f4f58afa6346b73c558a22e4f64810d68a299582b794c9290339188fa" },
      { id: "432923765", size: "max300", k: "78c6ad9811396e3422180fb51ec976cd27ce337f135e62ccc3914ce7d0a4374b" },
    ].map((p, i) => ({
      kind: "url" as const,
      url: `https://cf.bstatic.com/xdata/images/hotel/${p.size}/${p.id}.jpg?k=${p.k}&o=`,
      filename: `photo-${i + 1}.jpg`,
    })),
  },
  "5e8c55ec-97ef-49da-b06f-43741abba3ad": {
    label: "Tinil House",
    sources: [
      {
        kind: "file",
        relativePath: "tinil-house-collage.webp",
        contentType: "image/webp",
      },
    ],
  },
  "27cd1353-52f2-4f36-bb52-45a8e112ebb1": {
    label: "Cosy Cottage Broadford",
    sources: [
      { kind: "file", relativePath: "cosy-cottage-broadford-1.jpg", contentType: "image/jpeg" },
      { kind: "file", relativePath: "cosy-cottage-broadford-2.jpg", contentType: "image/jpeg" },
    ],
  },
}

export interface BackfillPropertyResult {
  propertyId: string
  label: string
  uploaded: number
  error?: string
}

export async function runCorporateStayPhotoBackfill(): Promise<BackfillPropertyResult[]> {
  const results: BackfillPropertyResult[] = []

  for (const [propertyId, entry] of Object.entries(BACKFILL_MANIFEST)) {
    try {
      const row = await getRow("corporate_stay_properties", propertyId)
      if (!row) {
        results.push({ propertyId, label: entry.label, uploaded: 0, error: "Property not found." })
        continue
      }

      const existing = Array.isArray(row.photo_urls) ? (row.photo_urls as string[]) : []
      const uploaded: string[] = []

      for (const source of entry.sources) {
        if (source.kind === "url") {
          uploaded.push(await fetchAndUploadCorporateStayPhoto(propertyId, source.url, source.filename))
        } else {
          const absolutePath = path.join(
            process.cwd(),
            "src/data/corporate-stay-photo-backfill",
            source.relativePath
          )
          const buffer = await fs.readFile(absolutePath)
          uploaded.push(
            await uploadCorporateStayPhoto(propertyId, source.relativePath, buffer, source.contentType)
          )
        }
      }

      await updateRow("corporate_stay_properties", propertyId, {
        photo_urls: [...existing, ...uploaded],
      })
      results.push({ propertyId, label: entry.label, uploaded: uploaded.length })
    } catch (err) {
      results.push({
        propertyId,
        label: entry.label,
        uploaded: 0,
        error: err instanceof Error ? err.message : "Unknown error.",
      })
    }
  }

  return results
}
