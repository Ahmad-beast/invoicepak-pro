import jsPDF from 'jspdf';
import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';

export const generateInvoicePDF = (invoice: Invoice): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
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
  
  const addLine = (y: number, color: [number, number, number] = lightGray) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
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
  
  // Header - InvoicePK Branding
  addText('InvoicePK', margin, yPosition, { 
    fontSize: 24, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  
  addText('INVOICE', pageWidth - margin, yPosition, { 
    fontSize: 28, 
    color: darkText, 
    fontStyle: 'bold',
    align: 'right'
  });
  
  yPosition += 15;
  
  addText('Professional Invoice Management', margin, yPosition, { 
    fontSize: 10, 
    color: grayText 
  });
  
  yPosition += 5;
  addLine(yPosition, accentColor);
  yPosition += 15;
  
  // Invoice Details Section
  addText('Invoice Number:', margin, yPosition, { 
    fontSize: 10, 
    color: grayText 
  });
  addText(invoice.invoiceNumber, margin + 35, yPosition, { 
    fontSize: 10, 
    fontStyle: 'bold' 
  });
  
  addText('Date:', pageWidth - margin - 50, yPosition, { 
    fontSize: 10, 
    color: grayText 
  });
  addText(format(new Date(invoice.createdAt), 'MMM dd, yyyy'), pageWidth - margin, yPosition, { 
    fontSize: 10, 
    fontStyle: 'bold',
    align: 'right'
  });
  
  yPosition += 8;
  
  addText('Status:', margin, yPosition, { 
    fontSize: 10, 
    color: grayText 
  });
  addText(invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1), margin + 35, yPosition, { 
    fontSize: 10, 
    fontStyle: 'bold',
    color: invoice.status === 'paid' ? [34, 197, 94] : invoice.status === 'sent' ? [59, 130, 246] : grayText
  });
  
  yPosition += 20;
  
  // Bill To Section
  doc.setFillColor(248, 250, 252); // Very light gray background
  doc.roundedRect(margin, yPosition - 5, contentWidth, 35, 3, 3, 'F');
  
  addText('BILL TO', margin + 10, yPosition + 5, { 
    fontSize: 10, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  
  yPosition += 15;
  
  addText(invoice.clientName, margin + 10, yPosition, { 
    fontSize: 14, 
    fontStyle: 'bold' 
  });
  
  yPosition += 30;
  
  // Service Description Section
  addText('SERVICE DESCRIPTION', margin, yPosition, { 
    fontSize: 10, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  
  yPosition += 10;
  addLine(yPosition - 3);
  yPosition += 5;
  
  // Handle long descriptions with text wrapping
  doc.setFontSize(11);
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'normal');
  const splitDescription = doc.splitTextToSize(invoice.serviceDescription, contentWidth);
  doc.text(splitDescription, margin, yPosition);
  yPosition += splitDescription.length * 6 + 15;
  
  // Amount Section
  addLine(yPosition);
  yPosition += 15;
  
  // Amount breakdown box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPosition - 5, contentWidth, 60, 3, 3, 'F');
  
  // Original Amount
  addText('Amount (' + invoice.currency + ')', margin + 10, yPosition + 8, { 
    fontSize: 10, 
    color: grayText 
  });
  addText(formatCurrency(invoice.amount, invoice.currency), pageWidth - margin - 10, yPosition + 8, { 
    fontSize: 14, 
    fontStyle: 'bold',
    align: 'right'
  });
  
  yPosition += 18;
  
  // Conversion Rate
  addText('Conversion Rate', margin + 10, yPosition, { 
    fontSize: 10, 
    color: grayText 
  });
  addText(`1 USD = ${invoice.conversionRate.toFixed(2)} PKR`, pageWidth - margin - 10, yPosition, { 
    fontSize: 10,
    align: 'right'
  });
  
  yPosition += 12;
  
  // Converted Amount
  const convertedCurrency = invoice.currency === 'USD' ? 'PKR' : 'USD';
  addText(`Converted Amount (${convertedCurrency})`, margin + 10, yPosition, { 
    fontSize: 10, 
    color: grayText 
  });
  addText(formatCurrency(invoice.convertedAmount, convertedCurrency), pageWidth - margin - 10, yPosition, { 
    fontSize: 14, 
    fontStyle: 'bold',
    color: accentColor,
    align: 'right'
  });
  
  yPosition += 25;
  
  // Total Section
  doc.setFillColor(...accentColor);
  doc.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AMOUNT', margin + 10, yPosition + 16);
  
  doc.setFontSize(16);
  doc.text(formatCurrency(invoice.amount, invoice.currency), pageWidth - margin - 10, yPosition + 16, { align: 'right' });
  
  yPosition += 40;
  
  // Footer
  addLine(yPosition, lightGray);
  yPosition += 10;
  
  addText('Thank you for your business!', pageWidth / 2, yPosition, { 
    fontSize: 11, 
    color: grayText,
    align: 'center'
  });
  
  yPosition += 8;
  
  addText('Generated by InvoicePK', pageWidth / 2, yPosition, { 
    fontSize: 9, 
    color: grayText,
    align: 'center'
  });
  
  // Save the PDF
  doc.save(`${invoice.invoiceNumber}.pdf`);
};
