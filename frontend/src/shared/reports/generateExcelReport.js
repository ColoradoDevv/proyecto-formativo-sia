import * as XLSX from "xlsx";

export function generateExcelReport({ headers, rows, reportTitle, fileName = "reporte.xlsx" }) {
    const date = new Date().toLocaleDateString("es-CO");
    const titleRow = [`---------- ${reportTitle.toUpperCase()} · ${date} ----------`];

    const sheetData = [titleRow, [], headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    const colCount = headers.length;
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: Math.max(colCount - 1, 0) } }];
    ws["!cols"] = Array(colCount).fill({ wch: 30 });
    ws["!rows"] = [{ hpx: 28 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, fileName);
}
