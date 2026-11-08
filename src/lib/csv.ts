/** Quotes a CSV field and neutralises spreadsheet formula injection. */
function escapeField(value: string): string {
  // A cell starting with = + - @ (or tab/CR) can run as a formula when the CSV
  // is opened in Excel/Sheets, and these fields hold form input from the public.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

export function toCsv(headers: string[], rows: string[][]): string {
  return [headers, ...rows].map((row) => row.map(escapeField).join(",")).join("\r\n")
}

/** Starts a browser download of `csv` (with a BOM so Excel reads UTF-8 correctly). */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
