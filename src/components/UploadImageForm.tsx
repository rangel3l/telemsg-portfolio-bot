import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addImageToPortfolio } from '@/services/supabaseService';
import { AspectRatio } from './ui/aspect-ratio';
import { useCookies } from '@/hooks/use-cookies';
import { ImageAnnotation } from './ImageAnnotation';
import { Annotation } from '@/types'; // Add this import

interface UploadImageFormProps {
  portfolioId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormState {
  file: File | null;
  preview: string | null;
  imageName: string;
  caption: string;
  imageWidth: number;
  imageHeight: number;
  aspectRatio: number;
  annotations: Annotation[];
}

interface StoredFormData {
  preview: string | null;
  imageName: string;
  caption: string;
  imageWidth: number;
  imageHeight: number;
  aspectRatio: number;
  fileData?: string; // Add fileData to store the file
  fileName?: string;
  fileType?: string;
  lastModified?: number;
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
  const { setCookie, getCookie, removeCookie } = useCookies();
  const cookieKey = `upload_form_${portfolioId}`;
  const storageKey = `upload_preview_${portfolioId}`;

  // Load initial state from localStorage
  const [formState, setFormState] = useState<FormState>(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData) as StoredFormData;
        
        // Reconstruct File object from stored data if available
        let file: File | null = null;
        if (parsed.fileData && parsed.fileName && parsed.fileType) {
          const dataUrl = parsed.fileData;
          const byteString = atob(dataUrl.split(',')[1]);
          const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          
          file = new File([ab], parsed.fileName, { type: parsed.fileType });
        }

        return {
          file,
          preview: parsed.preview,
          imageName: parsed.imageName,
          caption: parsed.caption,
          imageWidth: parsed.imageWidth,
          imageHeight: parsed.imageHeight,
          aspectRatio: parsed.aspectRatio,
          annotations: [],
        };
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }

    return {
      file: null,
      preview: null,
      imageName: '',
      caption: '',
      imageWidth: 0,
      imageHeight: 0,
      aspectRatio: 1,
      annotations: [],
    };
  });

  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Save form state to localStorage whenever it changes
  useEffect(() => {
    try {
      if (formState.preview || formState.imageName || formState.caption) {
        const fileData = formState.file ? {
          fileData: formState.preview,
          fileName: formState.file.name,
          fileType: formState.file.type,
        } : {};

        localStorage.setItem(storageKey, JSON.stringify({
          preview: formState.preview,
          imageName: formState.imageName,
          caption: formState.caption,
          imageWidth: formState.imageWidth,
          imageHeight: formState.imageHeight,
          aspectRatio: formState.aspectRatio,
          ...fileData,
          lastModified: Date.now(),
        }));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Error saving form state:', error);
    }
  }, [formState, storageKey]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        
        const img = new Image();
        img.onload = () => {
          const ratio = getAspectRatio(img.width, img.height);
          setFormState(prev => ({
            ...prev,
            file: selectedFile,
            preview: previewUrl,
            imageWidth: img.width,
            imageHeight: img.height,
            aspectRatio: ratio,
          }));
        };
        img.src = previewUrl;
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, imageName: e.target.value }));
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, caption: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.file && !formState.preview) {
      toast({
        description: "Por favor, selecione uma imagem para enviar",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      if (!formState.file && formState.preview) {
        // Convert preview back to File if needed
        const response = await fetch(formState.preview);
        const blob = await response.blob();
        formState.file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      }

      // Incluir as anotações ao enviar a imagem
      await addImageToPortfolio(
        portfolioId, 
        formState.file!, 
        formState.caption, 
        formState.imageName,
        annotations // Adicionar anotações aqui
      );

      // Clear both cookies and localStorage
      removeCookie(cookieKey);
      localStorage.removeItem(storageKey);
      
      setFormState({
        file: null,
        preview: null,
        imageName: '',
        caption: '',
        imageWidth: 0,
        imageHeight: 0,
        aspectRatio: 1,
        annotations: [],
      });
      onSuccess();
    } catch (error) {
      console.error("Erro ao adicionar imagem:", error);
      toast({
        description: "Não foi possível enviar a imagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAnnotationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnnotating(!isAnnotating);
  };

  const isSubmitDisabled = !formState.file && !formState.preview;

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
      
      {formState.preview && (
        <div className="mt-2">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Preview</p>
            <div className="flex items-center gap-2">
              {formState.imageWidth > 0 && (
                <span className="text-xs text-muted-foreground">
                  {formState.imageWidth}×{formState.imageHeight}px • {getRatioName(formState.aspectRatio)}
                </span>
              )}
              {!isAnnotating && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAnnotationClick}
                  className="z-50"
                >
                  Adicionar Anotações
                </Button>
              )}
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-sm mx-auto">
              {/* Modificado para usar o aspect ratio da imagem */}
              <AspectRatio ratio={formState.aspectRatio}>
                {isAnnotating ? (
                  <div className="absolute inset-0 z-40">
                    <ImageAnnotation
                      imageUrl={formState.preview}
                      initialAnnotations={annotations}
                      onSave={(newAnnotations) => {
                        setAnnotations(newAnnotations);
                        setIsAnnotating(false);
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img 
                      src={formState.preview} 
                      alt="Preview" 
                      className="h-full w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    {(formState.caption || formState.imageName) && (
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="bg-black/30 p-3 rounded-lg backdrop-blur-sm">
                          {formState.imageName && (
                            <p className="text-white text-sm font-medium uppercase mb-1">
                              {formState.imageName}
                            </p>
                          )}
                          {formState.caption && (
                            <p className="text-white/90 text-sm">
                              {formState.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </AspectRatio>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Recomendação: Imagens com proporções do Instagram (1:1, 4:5, ou 1.91:1) e resolução de 1080px.
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="imageName">Nome da Imagem (Título)</Label>
        <Input
          id="imageName"
          value={formState.imageName}
          onChange={handleImageNameChange}
          placeholder="Digite um título para esta imagem"
          disabled={uploading}
          className="uppercase"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="caption">Legenda</Label>
        <Textarea
          id="caption"
          value={formState.caption}
          onChange={handleCaptionChange}
          placeholder="Adicione uma legenda para esta imagem..."
          disabled={uploading}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button 
          type="submit" 
          disabled={uploading || isSubmitDisabled}
        >
          {uploading ? 'Enviando...' : 'Adicionar Imagem'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={uploading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default UploadImageForm;
