
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addImageToPortfolio } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { AspectRatio } from './ui/aspect-ratio';

interface AddImageFormProps {
  portfolioId: string;
  onSuccess?: () => void;
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

const AddImageForm: React.FC<AddImageFormProps> = ({ portfolioId, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1); // Default square ratio
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        
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
        title: "Error",
        description: "Please select an image to upload",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await addImageToPortfolio(portfolioId, file, caption);
      toast({
        title: "Success",
        description: "Image added to portfolio",
      });
      
      // Reset form
      setFile(null);
      setCaption('');
      setPreviewUrl(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding image:", error);
      toast({
        title: "Error",
        description: "Failed to add image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="image" className="block text-sm font-medium">
          Select Image
        </label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>

      {previewUrl && (
        <div className="mt-4">
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
                src={previewUrl} 
                alt="Preview" 
                className="h-full w-full object-cover"
              />
              
              {/* Caption preview overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="text-white text-sm font-medium">
                    {caption}
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
        <label htmlFor="caption" className="block text-sm font-medium">
          Caption
        </label>
        <Textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption for this image..."
          disabled={isLoading}
          rows={3}
        />
      </div>

      <div className="flex space-x-2">
        <Button type="submit" disabled={isLoading || !file}>
          {isLoading ? 'Uploading...' : 'Add Image'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate(`/portfolio/${portfolioId}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddImageForm;
