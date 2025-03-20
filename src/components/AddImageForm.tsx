
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addImageToPortfolio } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

interface AddImageFormProps {
  portfolioId: string;
  onSuccess?: () => void;
}

const AddImageForm: React.FC<AddImageFormProps> = ({ portfolioId, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
          <p className="text-sm font-medium mb-2">Preview</p>
          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-full w-full object-cover"
            />
          </div>
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
