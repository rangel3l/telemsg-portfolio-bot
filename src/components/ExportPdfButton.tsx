import React, { useState } from 'react';
import { Button } from './ui/button';
import { FileDown, Share2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { generatePortfolioPdf } from '@/lib/pdfGenerator';
import { ImageItem, Portfolio } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ExportPdfButtonProps {
  images?: ImageItem[];
  portfolios?: Portfolio[];
  portfolioName?: string;
  variant?: "default" | "outline";
  className?: string;
}

const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({ 
  images,
  portfolios,
  portfolioName,
  variant = "default",
  className
}) => {
  const { toast } = useToast();
  const [studentName, setStudentName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    if (!images || images.length === 0) {
      console.log('Images:', images); // Debug log
      toast({
        description: "Não há imagens para gerar o PDF. Por favor, adicione algumas imagens primeiro.",
        variant: "destructive"
      });
      return;
    }

    if (!portfolioName) {
      toast({
        description: "Nome do portfólio não definido",
        variant: "destructive"
      });
      return;
    }

    if (!studentName || !teacherName) {
      toast({
        description: "Por favor, preencha os campos de discente e docente",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await generatePortfolioPdf({
        images,
        portfolioName,
        studentName,
        teacherName
      });
      toast({
        description: "PDF gerado com sucesso!",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!studentName || !teacherName) {
      toast({
        description: "Por favor, preencha os campos de discente e docente primeiro",
        variant: "destructive"
      });
      return;
    }

    if (!images || images.length === 0) {
      toast({
        description: "Não há imagens para compartilhar",
        variant: "destructive"
      });
      return;
    }

    try {
      const blob = await generatePortfolioPdf({
        images,
        portfolioName,
        studentName,
        teacherName,
        download: false
      });

      if (!blob) return;

      const file = new File([blob], `${portfolioName}_portfolio.pdf`, {
        type: 'application/pdf'
      });

      // Try native sharing first
      if (navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: `Portfólio: ${portfolioName}`,
            text: 'Confira este portfólio!'
          });
          return;
        } catch (shareError) {
          console.warn('Share cancelled or failed', shareError);
        }
      }

      // Try Windows share dialog
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file]
          });
          return;
        } catch (error) {
          console.warn('Share cancelled or failed', error);
        }
      }

      // Fallback to download only if sharing is not supported
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${portfolioName}_portfolio.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error sharing PDF:', error);
      toast({
        description: "Não foi possível compartilhar o PDF",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button 
            variant={variant}
            className={cn("gap-2", className)}
          >
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar Portfólio como PDF</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="studentName">Nome do Discente</Label>
            <Input
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Digite o nome do discente"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacherName">Nome do Docente</Label>
            <Input
              id="teacherName"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Digite o nome do docente"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleExport} 
              disabled={isGenerating || !studentName || !teacherName}
              className="flex-1"
            >
              {isGenerating ? 'Gerando PDF...' : 'Gerar PDF'}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              disabled={!studentName || !teacherName}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportPdfButton;
