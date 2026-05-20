import jsPDF from "jspdf";

export function exportPDF(
  title: string
) {
  const doc = new jsPDF();

  doc.text(title, 20, 20);

  doc.save(`${title}.pdf`);
}