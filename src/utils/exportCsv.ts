type ExportCsvArgs<T> = {
  filename: string;
  headers: string[];
  rows: T[];
  getRowCells: (
    row: T,
  ) => Array<string | number | null | undefined | boolean>;
};

export const exportCsv = <T,>({
  filename,
  headers,
  rows,
  getRowCells,
}: ExportCsvArgs<T>) => {
  const headersLine = headers.join(",");
  const csvContent = rows
    .map((row) => getRowCells(row).join(","))
    .join("\n");

  const blob = new Blob([`${headersLine}\n${csvContent}`], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
};

