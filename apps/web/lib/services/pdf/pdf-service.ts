import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = {
  primary: [5, 150, 105] as [number, number, number],
  black: [17, 24, 39] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],
  lightGray: [229, 231, 235] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  red: [239, 68, 68] as [number, number, number],
  green: [16, 185, 129] as [number, number, number],
  yellow: [245, 158, 11] as [number, number, number],
  indigo: [79, 70, 229] as [number, number, number],
};

const FONTS = {
  title: 20,
  subtitle: 14,
  body: 11,
  small: 9,
  tiny: 8,
};

class GEGPDFService {
  createDocument(): jsPDF {
    return new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
  }

  get pageWidth(): number {
    return 210; // A4
  }

  get pageHeight(): number {
    return 297; // A4
  }

  addCoverPage(
    doc: jsPDF,
    options: {
      title: string;
      subtitle?: string;
      organization: string;
      date: string;
      confidential?: boolean;
      score?: string;
      accentColor?: [number, number, number];
    },
  ) {
    const {
      title,
      subtitle,
      organization,
      date,
      confidential,
      score,
      accentColor,
    } = options;
    const pw = this.pageWidth;
    const ph = this.pageHeight;
    const color = accentColor ?? COLORS.primary;

    doc.setFillColor(...COLORS.white);
    doc.rect(0, 0, pw, ph, 'F');

    // Top accent bar
    doc.setFillColor(...color);
    doc.rect(0, 0, pw, 3, 'F');

    // Logo
    doc.setFontSize(28);
    doc.setTextColor(...color);
    doc.setFont('helvetica', 'bold');
    doc.text('GreenEcoGenius', pw / 2, 50, { align: 'center' });

    // Separator
    doc.setDrawColor(...COLORS.lightGray);
    doc.setLineWidth(0.5);
    doc.line(60, 58, pw - 60, 58);

    // Title
    doc.setFontSize(FONTS.title);
    doc.setTextColor(...COLORS.black);
    doc.setFont('helvetica', 'bold');

    const titleLines = doc.splitTextToSize(title.toUpperCase(), pw - 60);
    doc.text(titleLines, pw / 2, 85, { align: 'center' });

    let yAfterTitle = 85 + titleLines.length * 8;

    if (subtitle) {
      doc.setFontSize(FONTS.subtitle);
      doc.setTextColor(...COLORS.gray);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, pw / 2, yAfterTitle + 5, { align: 'center' });
      yAfterTitle += 12;
    }

    if (score) {
      doc.setFontSize(48);
      doc.setTextColor(...color);
      doc.setFont('helvetica', 'bold');
      doc.text(score, pw / 2, yAfterTitle + 30, { align: 'center' });
    }

    // Bottom info
    const bottomY = ph - 60;
    doc.setFontSize(FONTS.body);
    doc.setTextColor(...COLORS.gray);
    doc.setFont('helvetica', 'normal');
    doc.text(`Entreprise : ${organization}`, pw / 2, bottomY, {
      align: 'center',
    });
    doc.text(`Date : ${date}`, pw / 2, bottomY + 8, { align: 'center' });

    if (confidential) {
      doc.setFontSize(FONTS.small);
      doc.setTextColor(...COLORS.red);
      doc.text('CONFIDENTIEL', pw / 2, bottomY + 20, { align: 'center' });
    }

    // Footer
    doc.setFontSize(FONTS.tiny);
    doc.setTextColor(...COLORS.gray);
    doc.text('GreenEcoGenius OU -- greenecogenius.tech', pw / 2, ph - 15, {
      align: 'center',
    });
    doc.text("Batir Aujourd'hui Pour Preserver Demain.", pw / 2, ph - 10, {
      align: 'center',
    });

    // Bottom accent bar
    doc.setFillColor(...color);
    doc.rect(0, ph - 3, pw, 3, 'F');
  }

  addHeader(doc: jsPDF, title: string): number {
    const pw = this.pageWidth;

    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pw, 2, 'F');

    doc.setFontSize(FONTS.small);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('GreenEcoGenius', 15, 12);

    doc.setFontSize(FONTS.small);
    doc.setTextColor(...COLORS.gray);
    doc.setFont('helvetica', 'normal');
    doc.text(title, pw - 15, 12, { align: 'right' });

    doc.setDrawColor(...COLORS.lightGray);
    doc.setLineWidth(0.3);
    doc.line(15, 16, pw - 15, 16);

    return 22;
  }

  addFooter(doc: jsPDF, pageNumber: number, totalPages?: number) {
    const pw = this.pageWidth;
    const ph = this.pageHeight;

    doc.setDrawColor(...COLORS.lightGray);
    doc.setLineWidth(0.3);
    doc.line(15, ph - 18, pw - 15, ph - 18);

    doc.setFontSize(FONTS.tiny);
    doc.setTextColor(...COLORS.gray);
    doc.text('GreenEcoGenius OU -- greenecogenius.tech', 15, ph - 12);

    const pageText = totalPages
      ? `${pageNumber}/${totalPages}`
      : `${pageNumber}`;
    doc.text(pageText, pw - 15, ph - 12, { align: 'right' });

    doc.setFontSize(6);
    doc.text(
      'Document genere par IA -- Les donnees blockchain sont verifiees on-chain',
      15,
      ph - 7,
    );
  }

  addTable(
    doc: jsPDF,
    startY: number,
    headers: string[],
    rows: string[][],
    options?: {
      columnStyles?: Record<number, object>;
      title?: string;
    },
  ): number {
    if (options?.title) {
      doc.setFontSize(FONTS.subtitle);
      doc.setTextColor(...COLORS.black);
      doc.setFont('helvetica', 'bold');
      doc.text(options.title, 15, startY);
      startY += 8;
    }

    autoTable(doc, {
      startY,
      head: [headers],
      body: rows,
      theme: 'plain',
      styles: {
        fontSize: FONTS.small,
        cellPadding: 4,
        textColor: COLORS.black,
        lineColor: COLORS.lightGray,
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: [249, 250, 251],
        textColor: COLORS.gray,
        fontStyle: 'bold',
        fontSize: FONTS.tiny,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: options?.columnStyles,
      margin: { left: 15, right: 15 },
    });

    return (
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 10
    );
  }

  addSectionTitle(doc: jsPDF, title: string, y: number): number {
    doc.setFontSize(FONTS.subtitle);
    doc.setTextColor(...COLORS.black);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, y);

    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.8);
    doc.line(15, y + 2, 15 + Math.min(title.length * 3.2, 120), y + 2);

    return y + 10;
  }

  addScoreGauge(
    doc: jsPDF,
    score: number,
    x: number,
    y: number,
    label: string,
  ) {
    // Background bar
    doc.setFillColor(...COLORS.lightGray);
    doc.roundedRect(x, y, 60, 4, 2, 2, 'F');

    // Fill
    const color =
      score >= 80 ? COLORS.green : score >= 60 ? COLORS.yellow : COLORS.red;
    const fillWidth = Math.max(60 * (score / 100), 4);
    doc.setFillColor(...color);
    doc.roundedRect(x, y, fillWidth, 4, 2, 2, 'F');

    // Score text
    doc.setFontSize(FONTS.body);
    doc.setTextColor(...COLORS.black);
    doc.setFont('helvetica', 'bold');
    doc.text(`${score}%`, x + 65, y + 3.5);

    // Label
    doc.setFontSize(FONTS.small);
    doc.setTextColor(...COLORS.gray);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x, y - 2);
  }

  addKeyValue(
    doc: jsPDF,
    key: string,
    value: string,
    x: number,
    y: number,
  ): number {
    doc.setFontSize(FONTS.body);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.black);
    doc.text(`${key} :`, x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, x + 40, y);
    return y + 7;
  }

  addParagraph(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
  ): number {
    doc.setFontSize(FONTS.body);
    doc.setTextColor(...COLORS.black);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * 5 + 4;
  }

  addNewPageWithHeader(doc: jsPDF, title: string): number {
    doc.addPage();
    return this.addHeader(doc, title);
  }

  checkPageBreak(
    doc: jsPDF,
    currentY: number,
    requiredSpace: number,
    headerTitle: string,
  ): number {
    if (currentY + requiredSpace > this.pageHeight - 25) {
      return this.addNewPageWithHeader(doc, headerTitle);
    }
    return currentY;
  }

  toBuffer(doc: jsPDF): Uint8Array {
    const arrayBuffer = doc.output('arraybuffer');
    return new Uint8Array(arrayBuffer);
  }
}

export const pdfService = new GEGPDFService();
export { COLORS, FONTS };
