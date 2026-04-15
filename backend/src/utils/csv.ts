export function escapeCsvValue(value: unknown): string {
  const stringValue = String(value ?? "");
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}
export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) {
    return "";
  }
  const headers = Object.keys(rows[0]);
  const headerRow = headers.join(",");
  const dataRows = rows.map((row) =>
    headers.map((header) => escapeCsvValue(row[header])).join(",")
  );
  return [headerRow, ...dataRows].join("\n");
}