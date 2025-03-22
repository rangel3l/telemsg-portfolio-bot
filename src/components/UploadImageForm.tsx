
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addImageToPortfolio } from '@/services/supabaseService';
import { AspectRatio } from './ui/aspect-ratio';

interface UploadImageFormProps {
  portfolioId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// Function to determine aspect ratio from image dimensions
const getAspectRatio = (width: number, height: number): number => {
  const ratio = width / height;
  
  // Instagram supported ratios
  if (ratio >= 0.8 && ratio <= 1.2) {
    // Square (1:1)
    return 1/1;
  } else if (ratio < 0.8) {
    // Portrait (4:5)
    return 4/5;
  } else {
    // Landscape (1.91:1)
    return 1.91/1;
  }
};

// Function to get the ratio name for display
const getRatioName = (ratio: number): string => {
  if (ratio === 1) return "Quadrado (1:1)";
  if (ratio === 0.8) return "Retrato (4:5)";
  if (ratio === 1.91) return "Paisagem (1.91:1)";
  return "Personalizado";
};

const UploadImageForm: React.FC<UploadImageFormProps> = ({ 
  portfolioId, 
  onSuccess, 
  onCancel 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1); // Default square ratio
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        
        // Get image dimensions when loaded
        const img = new Image();
        img.onload = () => {
          setImageWidth(img.width);
          setImageHeight(img.height);
          const ratio = getAspectRatio(img.width, img.height);
          setAspectRatio(ratio);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem para enviar",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      await addImageToPortfolio(portfolioId, file, caption || imageName);
      toast({
        title: "Sucesso",
        description: "Imagem adicionada ao portfolio",
      });
      setFile(null);
      setImageName('');
      setCaption('');
      setPreview(null);
      onSuccess();
    } catch (error) {
      console.error("Erro ao adicionar imagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a imagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Selecionar Imagem</Label>
        <Input
          id="file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
      
      {preview && (
        <div className="mt-2">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Preview</p>
            {imageWidth > 0 && (
              <span className="text-xs text-muted-foreground">
                {imageWidth}×{imageHeight}px • {getRatioName(aspectRatio)}
              </span>
            )}
          </div>
          
          <div className="relative overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
            <AspectRatio ratio={aspectRatio}>
              <img 
                src={preview} 
                alt="Preview" 
                className="h-full w-full object-cover"
              />
              
              {/* Caption preview overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {(caption || imageName) && (
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="text-white text-sm font-medium">
                    {caption || imageName}
                  </p>
                </div>
              )}
            </AspectRatio>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Recomendação: Imagens com proporções do Instagram (1:1, 4:5, ou 1.91:1) e resolução de 1080px.
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="imageName">Nome da Imagem</Label>
        <Input
          id="imageName"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          placeholder="Digite um nome para esta imagem"
          disabled={uploading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="caption">Legenda</Label>
        <Textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Adicione uma legenda para esta imagem..."
          disabled={uploading}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button type="submit" disabled={uploading || !file}>
          {uploading ? 'Enviando...' : 'Adicionar Imagem'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={uploading}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default UploadImageForm;
