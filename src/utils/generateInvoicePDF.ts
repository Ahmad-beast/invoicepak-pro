import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export const generateInvoicePDF = async (elementId: string, fileName: string) => {
  // Original element dhundein
  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    toast.error('Invoice element not found');
    return;
  }

  try {
    toast.info('Generating PDF...');

    // 1. CLONE BANAYEN: Taake original screen pe koi asar na pare
    const clone = originalElement.cloneNode(true) as HTMLElement;

    // 2. CLONE KO STYLE KAREIN: Taake wo full height open ho jaye
    clone.style.position = 'fixed';
    clone.style.top = '-9999px'; // Screen se bahar chupayen
    clone.style.left = '0';
    clone.style.width = '210mm'; // A4 Width fixed karein
    clone.style.height = 'auto'; // Height auto taake pura content khul jaye
    clone.style.zIndex = '-1';
    clone.style.background = 'white';
    
    // Agar koi specific class chahiye styling ke liye
    clone.classList.add('pdf-generating');

    // Clone ko body mein add karein
    document.body.appendChild(clone);

    // 3. CAPTURE KAREIN
    const canvas = await html2canvas(clone, {
      scale: 2, // High Quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight
    });

    // 4. CLEANUP: Clone ko remove karein
    document.body.removeChild(clone);

    // 5. PDF GENERATION (Standard Logic)
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // First Page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Extra Pages (Agar invoice lambi ho)
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${fileName}.pdf`);
    toast.success('PDF downloaded successfully');

  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF');
  }
};
