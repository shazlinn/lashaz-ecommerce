// lashaz-ecommerce/lib/invoice.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order: any) => {
  const doc = new jsPDF();
  
  // Luxury Theme Colors
  const BRAND_COLOR = [243, 233, 220] as [number, number, number]; 
  const BLACK_COLOR = [0, 0, 0] as [number, number, number];

  // 1. Header & Branding
  doc.setFillColor(...BLACK_COLOR); 
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('LA SHAZ', 20, 25);
  
  doc.setFontSize(8);
  doc.text('VIRTUAL IDENTITY PROTOCOL', 20, 32);

  // 2. Metadata Alignment
  // This handles both the Admin flattened row and the Customer Prisma object
  const customerDisplayName = order.customerName || order.user?.name || 'Valued Client';
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`INVOICE: #${order.id.slice(-6).toUpperCase()}`, 20, 55);
  doc.text(`DATE: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 60);
  doc.text(`CUSTOMER: ${customerDisplayName}`, 20, 65);

  // 3. Product Table Logic
  const tableBody = order.items?.map((item: any) => {
    // If it's a string (from the Admin Ledger), treat as one item
    if (typeof item === 'string') {
      return [item, 1, `RM ${Number(order.total).toFixed(2)}`, `RM ${Number(order.total).toFixed(2)}` ];
    }
    // If it's a Prisma object (from the Profile page)
    return [
      item.product?.name || 'Beauty Product',
      item.quantity || 1,
      `RM ${Number(item.price || order.total).toFixed(2)}`,
      `RM ${Number((item.quantity || 1) * (item.price || order.total)).toFixed(2)}`
    ];
  }) || [['Order Total', '-', '-', `RM ${Number(order.total).toFixed(2)}`]];

  autoTable(doc, {
    startY: 80,
    head: [['Product', 'Quantity', 'Price', 'Subtotal']],
    body: tableBody,
    headStyles: { 
      fillColor: BLACK_COLOR,
      textColor: [255, 255, 255] as [number, number, number],
      fontSize: 10,
      fontStyle: 'bold' 
    },
    alternateRowStyles: { 
      fillColor: BRAND_COLOR 
    },
    margin: { left: 20, right: 20 }
  });

  // 4. Final Total
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL AMOUNT: RM ${Number(order.total).toFixed(2)}`, 140, finalY + 20);

  doc.save(`LaShaz_Invoice_${order.id.slice(-6)}.pdf`);
};