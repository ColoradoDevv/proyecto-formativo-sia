import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePdfReport({
    headers,
    rows,
    reportTitle,
    generatedBy = "Usuario no disponible",
    generatedAt = new Date(),
    fileName = "reporte.pdf",
}) {
    const doc = new jsPDF();

    const dateTime = new Intl.DateTimeFormat("es-CO", {
        dateStyle: "long",
        timeStyle: "medium",
    }).format(generatedAt);

    doc.setFontSize(11);
    doc.setTextColor(12, 45, 72); // #0C2D48
    doc.text("SGI - Sistema de Gestión de Inventario", 14, 14);

    doc.setFontSize(16);
    doc.setTextColor(12, 45, 72); // #0C2D48
    doc.text(reportTitle, 14, 22);

    doc.setFontSize(9);
    doc.setTextColor(82, 107, 123); // #526B7B
    doc.text(`Generado por: ${generatedBy}`, 14, 29);
    doc.text(`Fecha y hora: ${dateTime}`, 14, 35);

    autoTable(doc, {
        startY: 42,
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
