import jsPDF from 'jspdf';
import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';

export const generateInvoicePDF = (invoice: Invoice, removeBranding: boolean = false): void => {
  // A5 size: 148mm x 210mm
  const doc = new jsPDF({
    format: 'a5',
    unit: 'mm',
  });
  
  const pageWidth = doc.internal.pageSize.getWidth(); // 148mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  
  // Colors
  const accentColor: [number, number, number] = [249, 115, 22]; // #F97316 - soft amber
  const darkText: [number, number, number] = [15, 23, 42]; // #0F172A
  const grayText: [number, number, number] = [100, 116, 139]; // #64748B
  const lightGray: [number, number, number] = [226, 232, 240]; // #E2E8F0
  
  let yPosition = margin;
  
  // Helper functions
  const addText = (
    text: string, 
    x: number, 
    y: number, 
    options?: { 
      fontSize?: number; 
      color?: [number, number, number]; 
      fontStyle?: 'normal' | 'bold';
      align?: 'left' | 'center' | 'right';
    }
  ) => {
    const { fontSize = 8, color = darkText, fontStyle = 'normal', align = 'left' } = options || {};
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    doc.setFont('helvetica', fontStyle);
    
    let xPos = x;
    if (align === 'right') {
      xPos = pageWidth - margin;
    } else if (align === 'center') {
      xPos = pageWidth / 2;
    }
    
    doc.text(text, xPos, y, { align });
  };
  
  const addLine = (y: number, color: [number, number, number] = lightGray) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  // Header - Branding (conditionally shown based on subscription)
  if (!removeBranding) {
    addText('InvoicePK', margin, yPosition, { 
      fontSize: 16, 
      color: accentColor, 
      fontStyle: 'bold' 
    });
  }
  
  addText('INVOICE', pageWidth - margin, yPosition, { 
    fontSize: 18, 
    color: darkText, 
    fontStyle: 'bold',
    align: 'right'
  });
  
  yPosition += 6;
  
  if (!removeBranding) {
    addText('Professional Invoice Management', margin, yPosition, { 
      fontSize: 7, 
      color: grayText 
    });
  }
  
  yPosition += 3;
  addLine(yPosition, accentColor);
  yPosition += 8;
  
  // Invoice Details Section - 2 column layout
  const leftCol = margin;
  const rightCol = pageWidth / 2 + 5;
  
  addText('Invoice #:', leftCol, yPosition, { fontSize: 7, color: grayText });
  addText(invoice.invoiceNumber, leftCol + 20, yPosition, { fontSize: 7, fontStyle: 'bold' });
  
  addText('Invoice Date:', rightCol, yPosition, { fontSize: 7, color: grayText });
  addText(format(new Date(invoice.invoiceDate), 'MMM dd, yyyy'), rightCol + 22, yPosition, { fontSize: 7, fontStyle: 'bold' });
  
  yPosition += 5;
  
  addText('Status:', leftCol, yPosition, { fontSize: 7, color: grayText });
  addText(invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1), leftCol + 20, yPosition, { 
    fontSize: 7, 
    fontStyle: 'bold',
    color: invoice.status === 'paid' ? [34, 197, 94] : invoice.status === 'sent' ? [59, 130, 246] : grayText
  });
  
  addText('Due Date:', rightCol, yPosition, { fontSize: 7, color: grayText });
  addText(format(new Date(invoice.dueDate), 'MMM dd, yyyy'), rightCol + 22, yPosition, { fontSize: 7, fontStyle: 'bold' });
  
  yPosition += 10;
  
  // From & Bill To Section - Side by side
  const boxHeight = 18;
  const boxWidth = (contentWidth - 4) / 2;
  
  // From box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPosition - 3, boxWidth, boxHeight, 2, 2, 'F');
  
  addText('FROM', margin + 4, yPosition + 2, { 
    fontSize: 7, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  addText(invoice.senderName || 'Sender', margin + 4, yPosition + 8, { 
    fontSize: 9, 
    fontStyle: 'bold' 
  });
  
  // Bill To box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + boxWidth + 4, yPosition - 3, boxWidth, boxHeight, 2, 2, 'F');
  
  addText('BILL TO', margin + boxWidth + 8, yPosition + 2, { 
    fontSize: 7, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  addText(invoice.clientName, margin + boxWidth + 8, yPosition + 8, { 
    fontSize: 9, 
    fontStyle: 'bold' 
  });
  
  yPosition += boxHeight + 6;
  
  // Service Description Section
  addText('SERVICE DESCRIPTION', margin, yPosition, { 
    fontSize: 7, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  
  yPosition += 4;
  addLine(yPosition - 1);
  yPosition += 3;
  
  // Handle long descriptions with text wrapping
  doc.setFontSize(8);
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'normal');
  const splitDescription = doc.splitTextToSize(invoice.serviceDescription, contentWidth);
  const maxLines = 4; // Limit lines to keep A5 compact
  const truncatedDescription = splitDescription.slice(0, maxLines);
  doc.text(truncatedDescription, margin, yPosition);
  yPosition += truncatedDescription.length * 4 + 8;
  
  // Amount Section
  addLine(yPosition);
  yPosition += 6;
  
  // Amount breakdown box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPosition - 3, contentWidth, 32, 2, 2, 'F');
  
  // Original Amount
  addText('Amount (' + invoice.currency + ')', margin + 4, yPosition + 3, { 
    fontSize: 7, 
    color: grayText 
  });
  addText(formatCurrency(invoice.amount, invoice.currency), pageWidth - margin - 4, yPosition + 3, { 
    fontSize: 10, 
    fontStyle: 'bold',
    align: 'right'
  });
  
  yPosition += 10;
  
  // Conversion Rate
  addText('Conversion Rate', margin + 4, yPosition, { 
    fontSize: 7, 
    color: grayText 
  });
  addText(`1 USD = ${invoice.conversionRate.toFixed(2)} PKR`, pageWidth - margin - 4, yPosition, { 
    fontSize: 7,
    align: 'right'
  });
  
  yPosition += 8;
  
  // Converted Amount
  const convertedCurrency = invoice.currency === 'USD' ? 'PKR' : 'USD';
  addText(`Converted Amount (${convertedCurrency})`, margin + 4, yPosition, { 
    fontSize: 7, 
    color: grayText 
  });
  addText(formatCurrency(invoice.convertedAmount, convertedCurrency), pageWidth - margin - 4, yPosition, { 
    fontSize: 10, 
    fontStyle: 'bold',
    color: accentColor,
    align: 'right'
  });
  
  yPosition += 12;
  
  // Total Section
  doc.setFillColor(...accentColor);
  doc.roundedRect(margin, yPosition, contentWidth, 14, 2, 2, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AMOUNT', margin + 4, yPosition + 9);
  
  doc.setFontSize(12);
  doc.text(formatCurrency(invoice.amount, invoice.currency), pageWidth - margin - 4, yPosition + 9, { align: 'right' });
  
  yPosition += 20;
  
  // Notes Section (if exists)
  if (invoice.notes && invoice.notes.trim()) {
    addText('NOTES', margin, yPosition, { 
      fontSize: 7, 
      color: accentColor, 
      fontStyle: 'bold' 
    });
    
    yPosition += 4;
    addLine(yPosition - 1);
    yPosition += 3;
    
    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(invoice.notes, contentWidth);
    const truncatedNotes = splitNotes.slice(0, 3);
    doc.text(truncatedNotes, margin, yPosition);
    yPosition += truncatedNotes.length * 3 + 6;
  }
  
  // Footer - position at bottom
  const footerY = pageHeight - 15;
  addLine(footerY, lightGray);
  
  addText('Thank you for your business!', pageWidth / 2, footerY + 5, { 
    fontSize: 8, 
    color: grayText,
    align: 'center'
  });
  
  if (!removeBranding) {
    addText('Generated by InvoicePK', pageWidth / 2, footerY + 9, { 
      fontSize: 6, 
      color: grayText,
      align: 'center'
    });
  }
  
  // Save the PDF
  doc.save(`${invoice.invoiceNumber}.pdf`);
};
