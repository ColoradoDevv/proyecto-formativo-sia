import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePdfReport({ headers, rows, reportTitle, fileName = "reporte.pdf" }) {
    const doc = new jsPDF();

    const date = new Date().toLocaleDateString("es-CO");

    doc.setFontSize(16);
    doc.setTextColor(12, 45, 72); // #0C2D48
    doc.text(reportTitle, 14, 18);

    doc.setFontSize(9);
    doc.setTextColor(82, 107, 123); // #526B7B
    doc.text(`Generado el ${date}`, 14, 26);

    autoTable(doc, {
        startY: 32,
        head: [headers],
        body: rows,
        theme: "grid",
        headStyles: {
            fillColor: [32, 63, 87],  // #203F57
            textColor: 255,
            fontSize: 10,
            fontStyle: "bold",
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: [245, 248, 250],
        },
        margin: { left: 14, right: 14 },
    });

    doc.save(fileName);
}
