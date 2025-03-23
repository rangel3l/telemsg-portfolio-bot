import { ImageItem } from '@/types';
import { pdf } from '@react-pdf/renderer';
import PortfolioPDF from '@/components/PortfolioPDF';

export interface GeneratePdfProps {
  images: ImageItem[];
  portfolioName: string;
  studentName: string;
  teacherName: string;
  download?: boolean;
}

const generatePdf = async ({
  images = [],
  portfolioName,
  studentName,
  teacherName,
  download = true
}: GeneratePdfProps): Promise<Blob | void> => {
  if (!images || images.length === 0) {
    throw new Error('No images provided for PDF generation');
  }

  try {
    const blob = await pdf(
      <PortfolioPDF
        images={images}
        portfolioName={portfolioName}
        studentName={studentName}
        teacherName={teacherName}
      />
    ).toBlob();

    if (download) {
      // Criar nome do arquivo sanitizado
      const fileName = `${portfolioName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_portfolio.pdf`;

      // Criar link de download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return blob; // Retorna o blob para uso no compartilhamento
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export { generatePdf as generatePortfolioPdf };
