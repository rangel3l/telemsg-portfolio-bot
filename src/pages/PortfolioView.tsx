import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/hooks/use-portfolio';
import { useImages } from '@/hooks/use-images';
import ExportPdfButton from '@/components/ExportPdfButton';

const PortfolioView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { portfolio, isLoading: isLoadingPortfolio } = usePortfolio(id);
  const { images, isLoading: isLoadingImages } = useImages(id);

  if (isLoadingPortfolio || isLoadingImages) {
    return <div>Loading...</div>;
  }

  if (!portfolio) {
    return <div>Portfolio not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header com título e botões */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-card p-6 rounded-xl shadow-md border">
        <div>
          <h1 className="text-3xl font-bold mb-2">{portfolio.name}</h1>
          <p className="text-muted-foreground">
            {images.length} {images.length === 1 ? 'imagem' : 'imagens'} no portfólio
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button 
            onClick={() => navigate(`/portfolio/${portfolio.id}/add`)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Imagem
          </Button>
          
          {images.length > 0 && (
            <ExportPdfButton
              images={images}
              portfolioName={portfolio.name}
              variant="outline"
              className="w-full sm:w-auto"
            />
          )}
        </div>
      </div>

      {/* Grid de imagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="relative">
            <img 
              src={image.url} 
              alt={image.caption} 
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
              <h3 className="text-sm font-bold">{image.imageName}</h3>
              <p className="text-xs">{image.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioView;