import jsPDF from 'jspdf';
import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';

export const generateInvoicePDF = (invoice: Invoice, removeBranding: boolean = false): void => {
  // A5 size: 148mm x 210mm (Standard Notebook size)
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

  // --- PAGINATION HELPER ---
  // Ye function check karega ke jagah hai ya nahi. Agar nahi, to new page add karega.
  const checkPageBreak = (heightNeeded: number) => {
    if (yPosition + heightNeeded > pageHeight - margin) {
      doc.addPage();
      yPosition = margin; // Reset to top of new page
      return true; // Page break happened
    }
    return false;
  };
  
  // Header - Branding
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
  
  // Invoice Details Section
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
  
  // From & Bill To Section
  const boxHeight = 18;
  const boxWidth = (contentWidth - 4) / 2;
  
  // Check page break before boxes
  checkPageBreak(boxHeight + 10);

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
  
  // Project Title / Summary
  checkPageBreak(20); // Ensure minimal space for title

  addText('PROJECT DESCRIPTION', margin, yPosition, { 
    fontSize: 7, 
    color: accentColor, 
    fontStyle: 'bold' 
  });
  
  yPosition += 4;
  addLine(yPosition - 1);
  yPosition += 3;
  
  doc.setFontSize(8);
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'normal');
  const splitDescription = doc.splitTextToSize(invoice.serviceDescription, contentWidth);
  
  // Print description (handle page break if text is very long)
  // Simple approach: just print it, if it's huge, let's limit it or let it flow
  // Ideally, line-by-line check is better, but keeping it simple:
  doc.text(splitDescription, margin, yPosition);
  yPosition += splitDescription.length * 4 + 6;
  
  // Line Items Table Section
  const hasItems = invoice.items && invoice.items.length > 0;
  const currencySymbol = invoice.currency === 'USD' ? '$' : '₨';
  
  if (hasItems) {
    checkPageBreak(15); // Header space

    addText('LINE ITEMS', margin, yPosition, { 
      fontSize: 7, 
      color: accentColor, 
      fontStyle: 'bold' 
    });
    
    yPosition += 4;
    
    // Function to draw Table Header
    const drawTableHeader = (y: number) => {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y - 2, contentWidth, 7, 1, 1, 'F');
      
      const descCol = margin + 2;
      const qtyCol = margin + 70;
      const rateCol = margin + 85;
      const amountCol = pageWidth - margin - 2;
      
      addText('Description', descCol, y + 3, { fontSize: 6, color: grayText, fontStyle: 'bold' });
      addText('Qty', qtyCol, y + 3, { fontSize: 6, color: grayText, fontStyle: 'bold' });
      addText(`Rate (${currencySymbol})`, rateCol, y + 3, { fontSize: 6, color: grayText, fontStyle: 'bold' });
      addText(`Amount (${currencySymbol})`, amountCol, y + 3, { fontSize: 6, color: grayText, fontStyle: 'bold', align: 'right' });
    };

    drawTableHeader(yPosition);
    yPosition += 8;
    
    // Table Rows Loop
    invoice.items!.forEach((item, index) => {
      // Check if we need a new page for this row
      if (checkPageBreak(10)) {
        // If new page, draw header again
        drawTableHeader(yPosition);
        yPosition += 8;
      }
      
      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 253);
        doc.rect(margin, yPosition - 3, contentWidth, 7, 'F');
      }
      
      const descCol = margin + 2;
      const qtyCol = margin + 70;
      const rateCol = margin + 85;
      const amountCol = pageWidth - margin - 2;
      
      // Truncate long descriptions
      const maxDescLength = 40;
      const truncatedItemDesc = item.description.length > maxDescLength 
        ? item.description.substring(0, maxDescLength) + '...' 
        : item.description;
      
      addText(truncatedItemDesc, descCol, yPosition + 1, { fontSize: 7 });
      addText(item.quantity.toString(), qtyCol, yPosition + 1, { fontSize: 7 });
      addText(item.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), rateCol, yPosition + 1, { fontSize: 7 });
      addText(`${currencySymbol} ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, amountCol, yPosition + 1, { fontSize: 7, align: 'right' });
      
      yPosition += 7;
    });
    
    yPosition += 4;
  }
  
  // Calculate total
  const totalAmount = hasItems 
    ? invoice.items!.reduce((sum, item) => sum + item.amount, 0) 
    : invoice.amount;
  
  // TOTAL SECTION (Keep together)
  // Check if enough space for totals, if not, new page
  checkPageBreak(50); 

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
  addText(formatCurrency(totalAmount, invoice.currency), pageWidth - margin - 4, yPosition + 3, { 
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
  const convertedAmount = invoice.currency === 'USD' 
    ? totalAmount * invoice.conversionRate 
    : totalAmount / invoice.conversionRate;
    
  addText(`Converted Amount (${convertedCurrency})`, margin + 4, yPosition, { 
    fontSize: 7, 
    color: grayText 
  });
  addText(formatCurrency(convertedAmount, convertedCurrency), pageWidth - margin - 4, yPosition, { 
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
  doc.text(formatCurrency(totalAmount, invoice.currency), pageWidth - margin - 4, yPosition + 9, { align: 'right' });
  
  yPosition += 20;
  
  // Notes Section
  if (invoice.notes && invoice.notes.trim()) {
    checkPageBreak(30); // Check for notes space

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
    
    // Notes overflow check (simple)
    doc.text(splitNotes, margin, yPosition);
  }
  
  // Footer - always on current page bottom
  const footerY = pageHeight - 15;
  
  // If we are too close to footer, add new page for footer
  if (yPosition > footerY - 10) {
      doc.addPage();
  }

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
  doc.save(`${invoice.invoiceNumber || 'invoice'}.pdf`);
};
