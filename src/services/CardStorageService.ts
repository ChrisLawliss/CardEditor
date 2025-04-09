import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CardData, CardTemplate } from '../types/card';

interface CardManifestEntry {
  id: string;
  templateId: string;
  name: string;
  pdfPath: string;
  createdAt: string;
  data: CardData;
}

export class CardStorageService {
  private static readonly MANIFEST_KEY = 'card-manifest';
  private static readonly PDF_DIRECTORY = 'cards';

  private static getManifest(): CardManifestEntry[] {
    const manifest = localStorage.getItem(this.MANIFEST_KEY);
    return manifest ? JSON.parse(manifest) : [];
  }

  private static saveManifest(manifest: CardManifestEntry[]) {
    localStorage.setItem(this.MANIFEST_KEY, JSON.stringify(manifest));
  }

  private static generateFileName(template: CardTemplate, data: CardData): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const cardName = (data.name as string) || 'unnamed';
    return `${template.name.toLowerCase().replace(/\s+/g, '-')}_${cardName.toLowerCase().replace(/\s+/g, '-')}_${timestamp}.pdf`;
  }

  public static async saveCardAsPDF(
    template: CardTemplate,
    data: CardData,
    cardElement: HTMLElement
  ): Promise<string> {
    // Generate PDF
    const canvas = await html2canvas(cardElement);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [63, 88] // Standard card size in mm
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = (pdfHeight - imgHeight * ratio) / 2;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

    // Generate filename and save
    const fileName = this.generateFileName(template, data);
    const pdfPath = `${this.PDF_DIRECTORY}/${fileName}`;
    
    // Save to localStorage (in a real app, this would be a server call)
    const pdfData = pdf.output('datauristring');
    localStorage.setItem(pdfPath, pdfData);

    // Update manifest
    const manifest = this.getManifest();
    const newEntry: CardManifestEntry = {
      id: `card-${Date.now()}`,
      templateId: template.id,
      name: data.name as string,
      pdfPath,
      createdAt: new Date().toISOString(),
      data
    };

    this.saveManifest([...manifest, newEntry]);

    return pdfPath;
  }

  public static getCardManifest(): CardManifestEntry[] {
    return this.getManifest();
  }

  public static getCardPDF(pdfPath: string): string | null {
    return localStorage.getItem(pdfPath);
  }

  public static deleteCard(cardId: string): void {
    const manifest = this.getManifest();
    const card = manifest.find(entry => entry.id === cardId);
    
    if (card) {
      // Remove from storage
      localStorage.removeItem(card.pdfPath);
      
      // Update manifest
      const updatedManifest = manifest.filter(entry => entry.id !== cardId);
      this.saveManifest(updatedManifest);
    }
  }
} 