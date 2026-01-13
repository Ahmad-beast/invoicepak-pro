import jsPDF from 'jspdf';
import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';

export const generateInvoicePDF = (invoice: Invoice): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  
  // Colors
  const accentColor: [number, number, number] = [249, 115, 22]; // #F97316
  const darkText: [number, number, number] = [15, 23, 42]; // #0F172A
  const grayText: [number, number, number] = [100, 116, 139]; // #64748B
  const lightGray: [number, number, number] = [226, 232, 240]; // #E2E8F0
  const veryLightGray: [number, number, number] = [248, 250, 252]; // #F8FAFC
  
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
    const { fontSize = 10, color = darkText, fontStyle = 'normal', align = 'left' } = options || {};
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
  
  const addLine = (y: number, color: [number, number, number] = lightGray, width: number = 0.3) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(width);
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
  
  // ============ HEADER SECTION ============
  // InvoicePK Logo/Brand on left
  addText('InvoicePK', margin, yPosition, { 
    fontSize: 26, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  
  // INVOICE title on right
  addText('INVOICE', pageWidth - margin, yPosition, { 
    fontSize: 32, 
    color: darkText, 
    fontStyle: 'bold',
    align: 'right'
  });
  
  yPosition += 8;
  
  addText('Professional Invoice Management', margin, yPosition, { 
    fontSize: 9, 
    color: grayText 
  });
  
  yPosition += 12;
  
  // Header accent line
  doc.setFillColor(...accentColor);
  doc.rect(margin, yPosition, contentWidth, 1.5, 'F');
  
  yPosition += 20;
  
  // ============ INVOICE META SECTION ============
  // Left side - Invoice details
  addText('Invoice Number', margin, yPosition, { 
    fontSize: 8, 
    color: grayText 
  });
  addText(invoice.invoiceNumber, margin, yPosition + 5, { 
    fontSize: 11, 
    fontStyle: 'bold' 
  });
  
  // Right side - Date
  addText('Issue Date', pageWidth - margin, yPosition, { 
    fontSize: 8, 
    color: grayText,
    align: 'right'
  });
  addText(format(new Date(invoice.createdAt), 'MMMM dd, yyyy'), pageWidth - margin, yPosition + 5, { 
    fontSize: 11, 
    fontStyle: 'bold',
    align: 'right'
  });
  
  yPosition += 12;
  
  addText('Status', margin, yPosition, { 
    fontSize: 8, 
    color: grayText 
  });
  addText(invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1), margin, yPosition + 5, { 
    fontSize: 11, 
    fontStyle: 'bold',
    color: invoice.status === 'paid' ? [34, 197, 94] : invoice.status === 'sent' ? [59, 130, 246] : grayText
  });
  
  yPosition += 25;
  
  // Section divider
  addLine(yPosition);
  yPosition += 20;
  
  // ============ FROM / TO SECTION ============
  const columnWidth = (contentWidth - 20) / 2;
  
  // FROM Section
  addText('FROM', margin, yPosition, { 
    fontSize: 8, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  
  // TO Section
  addText('BILL TO', margin + columnWidth + 20, yPosition, { 
    fontSize: 8, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  
  yPosition += 8;
  
  // From details
  addText('InvoicePK', margin, yPosition, { 
    fontSize: 12, 
    fontStyle: 'bold' 
  });
  yPosition += 6;
  addText('Invoice Management Platform', margin, yPosition, { 
    fontSize: 9, 
    color: grayText 
  });
  yPosition += 5;
  addText('hello@invoicepk.com', margin, yPosition, { 
    fontSize: 9, 
    color: grayText 
  });
  
  // To details (aligned with FROM section start)
  const toStartY = yPosition - 11;
  addText(invoice.clientName, margin + columnWidth + 20, toStartY, { 
    fontSize: 12, 
    fontStyle: 'bold' 
  });
  
  yPosition += 20;
  
  // Section divider
  addLine(yPosition);
  yPosition += 20;
  
  // ============ SERVICE DESCRIPTION SECTION ============
  addText('DESCRIPTION', margin, yPosition, { 
    fontSize: 8, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  
  yPosition += 10;
  
  // Description box
  doc.setFillColor(...veryLightGray);
  doc.roundedRect(margin, yPosition - 4, contentWidth, 30, 2, 2, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'normal');
  const splitDescription = doc.splitTextToSize(invoice.serviceDescription, contentWidth - 16);
  doc.text(splitDescription, margin + 8, yPosition + 4);
  
  yPosition += 40;
  
  // ============ AMOUNT BREAKDOWN SECTION ============
  addText('AMOUNT DETAILS', margin, yPosition, { 
    fontSize: 8, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  
  yPosition += 12;
  
  // Amount table header
  doc.setFillColor(...veryLightGray);
  doc.rect(margin, yPosition - 4, contentWidth, 10, 'F');
  
  addText('Description', margin + 8, yPosition + 2, { 
    fontSize: 8, 
    color: grayText,
    fontStyle: 'bold'
  });
  addText('Amount', pageWidth - margin - 8, yPosition + 2, { 
    fontSize: 8, 
    color: grayText,
    fontStyle: 'bold',
    align: 'right'
  });
  
  yPosition += 14;
  
  // Original amount row
  addText(`Amount (${invoice.currency})`, margin + 8, yPosition, { 
    fontSize: 10
  });
  addText(formatCurrency(invoice.amount, invoice.currency), pageWidth - margin - 8, yPosition, { 
    fontSize: 11, 
    fontStyle: 'bold',
    align: 'right'
  });
  
  yPosition += 10;
  addLine(yPosition, lightGray, 0.2);
  yPosition += 8;
  
  // Conversion rate row
  addText('Conversion Rate', margin + 8, yPosition, { 
    fontSize: 9,
    color: grayText
  });
  addText(`1 USD = ${invoice.conversionRate.toFixed(2)} PKR`, pageWidth - margin - 8, yPosition, { 
    fontSize: 9, 
    color: grayText,
    align: 'right'
  });
  
  yPosition += 10;
  addLine(yPosition, lightGray, 0.2);
  yPosition += 8;
  
  // Converted amount row
  const convertedCurrency = invoice.currency === 'USD' ? 'PKR' : 'USD';
  addText(`Converted Amount (${convertedCurrency})`, margin + 8, yPosition, { 
    fontSize: 10
  });
  addText(formatCurrency(invoice.convertedAmount, convertedCurrency), pageWidth - margin - 8, yPosition, { 
    fontSize: 11, 
    fontStyle: 'bold',
    color: accentColor,
    align: 'right'
  });
  
  yPosition += 18;
  
  // ============ TOTALS SECTION ============
  // Totals box with stronger visual emphasis
  doc.setFillColor(...veryLightGray);
  doc.roundedRect(margin, yPosition, contentWidth, 40, 2, 2, 'F');
  
  // Total in original currency
  addText(`Total (${invoice.currency})`, margin + 12, yPosition + 12, { 
    fontSize: 10,
    color: grayText
  });
  addText(formatCurrency(invoice.amount, invoice.currency), pageWidth - margin - 12, yPosition + 12, { 
    fontSize: 14, 
    fontStyle: 'bold',
    align: 'right'
  });
  
  // Divider inside totals box
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.3);
  doc.line(margin + 12, yPosition + 20, pageWidth - margin - 12, yPosition + 20);
  
  // Total in PKR (always show PKR equivalent)
  const pkrAmount = invoice.currency === 'PKR' ? invoice.amount : invoice.convertedAmount;
  addText('Total (PKR)', margin + 12, yPosition + 32, { 
    fontSize: 10,
    color: grayText
  });
  addText(formatCurrency(pkrAmount, 'PKR'), pageWidth - margin - 12, yPosition + 32, { 
    fontSize: 14, 
    fontStyle: 'bold',
    color: accentColor,
    align: 'right'
  });
  
  yPosition += 55;
  
  // ============ FOOTER SECTION ============
  // Position footer near bottom of page
  const footerY = pageHeight - 30;
  
  addLine(footerY - 10, lightGray, 0.3);
  
  addText('Thank you for your business!', pageWidth / 2, footerY, { 
    fontSize: 11, 
    color: darkText,
    fontStyle: 'bold',
    align: 'center'
  });
  
  addText('Generated by InvoicePK • Professional Invoice Management', pageWidth / 2, footerY + 8, { 
    fontSize: 8, 
    color: grayText,
    align: 'center'
  });
  
  // Save the PDF
  doc.save(`${invoice.invoiceNumber}.pdf`);
};
