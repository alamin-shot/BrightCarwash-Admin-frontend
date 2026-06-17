// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToCSV(
  data: any[],
  columns: { key: string; header: string }[],
  filename: string
): void {
  const headers = columns.map((c) => `"${c.header}"`).join(",");
  const rows = data.map((row) =>
    columns.map((c) => `"${String(row[c.key] ?? "")}"`).join(",")
  );
  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}