
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addImageToPortfolio } from '@/services/supabaseService';

interface UploadImageFormProps {
  portfolioId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

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
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
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
          <p className="text-sm font-medium mb-2">Preview</p>
          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
            <img 
              src={preview} 
              alt="Preview" 
              className="h-full w-full object-cover"
            />
          </div>
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
