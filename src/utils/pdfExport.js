import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportPDF(elementId, filename = 'CV.pdf') {
  const parent = document.getElementById(elementId);
  if (!parent) return;

  const pages = parent.querySelectorAll('.mpPage');
  if (pages.length === 0) {
    const canvas = await html2canvas(parent, {
      scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff',
      height: parent.scrollHeight, width: parent.scrollWidth,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(filename);
    return;
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage();
    const canvas = await html2canvas(pages[i], {
      scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff',
    });
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
  }
  pdf.save(filename);
}
