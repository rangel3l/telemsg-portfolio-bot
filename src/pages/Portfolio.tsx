
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getPortfolio, 
  getPortfolioImages, 
  deleteImage 
} from '@/services/supabaseService';
import { Portfolio as PortfolioType, ImageItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ImageCard from '@/components/ImageCard';
import UploadImageForm from '@/components/UploadImageForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, LogIn, Shield, Grid, Film } from 'lucide-react';
import PortfolioCarousel from '@/components/PortfolioCarousel';
import { useIsMobile } from '@/hooks/use-mobile';

const Portfolio = () => {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploadFormVisible, setIsUploadFormVisible] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Se está no mobile, começa com o carousel por padrão
  useEffect(() => {
    if (isMobile) {
      setViewMode('carousel');
    }
  }, [isMobile]);

  const fetchData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching portfolio with ID:", id);
      const portfolioData = await getPortfolio(id);
      
      if (!portfolioData) {
        console.log("Portfolio not found, redirecting to 404");
        setError("Portfolio não encontrado");
        navigate('/not-found');
        return;
      }
      
      console.log("Portfolio data:", portfolioData);
      setPortfolio(portfolioData);
      
      // Verificar se o usuário é o proprietário do portfólio
      if (user) {
        const { data } = await supabase
          .from('portfolios')
          .select('user_id')
          .eq('id', id)
          .single();
        
        if (data && data.user_id === user.id) {
          setIsOwner(true);
        }
      }
      
      const imagesData = await getPortfolioImages(id);
      console.log("Images data:", imagesData);
      setImages(imagesData);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      setError("Falha ao carregar dados do portfolio");
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do portfolio",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const handleAddImage = () => {
    if (!user) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para adicionar imagens",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (!isOwner) {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para adicionar imagens a este portfolio",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploadFormVisible(true);
  };

  const handleImageAdded = () => {
    setIsUploadFormVisible(false);
    fetchData();
  };

  const handleCancelUpload = () => {
    setIsUploadFormVisible(false);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!user || !isOwner) {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para excluir imagens deste portfolio",
        variant: "destructive"
      });
      return;
    }
    
    setDeleteImageId(imageId);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteImageId) return;
    
    try {
      await deleteImage(deleteImageId);
      setImages(images.filter(img => img.id !== deleteImageId));
      toast({
        title: "Sucesso",
        description: "Imagem excluída com sucesso",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir imagem",
        variant: "destructive"
      });
    } finally {
      setConfirmDialogOpen(false);
      setDeleteImageId(null);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center">
          <h2 className="text-xl font-medium mb-4">Erro ao Carregar Portfolio</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/')}>Voltar para a Página Inicial</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto py-8 px-4 mt-20">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          <div className="w-full h-[40vh] md:h-[60vh] rounded-xl overflow-hidden mb-8">
            <Skeleton className="w-full h-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center">
          <h2 className="text-xl font-medium mb-4">Portfolio Não Encontrado</h2>
          <p className="text-muted-foreground mb-6">O portfolio que você está procurando não existe.</p>
          <Button onClick={() => navigate('/')}>Voltar para a Página Inicial</Button>
        </div>
      </div>
    );
  }

  const renderOwnershipIndicator = () => {
    if (!user) return null;
    
    return isOwner ? (
      <div className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary rounded-full px-3 py-1">
        <Shield size={14} />
        <span>Você é o proprietário</span>
      </div>
    ) : (
      <div className="inline-flex items-center gap-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-muted-foreground rounded-full px-3 py-1">
        <Shield size={14} />
        <span>Visualização</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4 mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link to="/" className="hover:text-primary">Portfolios</Link>
              <span>/</span>
              <span className="font-medium text-foreground">{portfolio.name}</span>
            </div>
            <div className="flex items-center flex-wrap gap-3">
              <h1 className="text-3xl font-bold">{portfolio.name}</h1>
              {renderOwnershipIndicator()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {images.length > 0 && (
              <div className="flex border rounded-lg overflow-hidden mr-2">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="rounded-none px-3"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={16} className="mr-1" />
                  <span className="hidden sm:inline">Grade</span>
                </Button>
                <Button 
                  variant={viewMode === 'carousel' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="rounded-none px-3"
                  onClick={() => setViewMode('carousel')}
                >
                  <Film size={16} className="mr-1" />
                  <span className="hidden sm:inline">Carrossel</span>
                </Button>
              </div>
            )}

            {(user && isOwner) && (
              <Button onClick={handleAddImage} className="flex items-center gap-2">
                <Plus size={16} />
                <span className="hidden sm:inline">Adicionar Imagem</span>
                <span className="sm:hidden">Adicionar</span>
              </Button>
            )}
          </div>
        </div>

        {isUploadFormVisible && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Adicionar Nova Imagem</h2>
              <UploadImageForm 
                portfolioId={portfolio.id} 
                onSuccess={handleImageAdded} 
                onCancel={handleCancelUpload} 
              />
            </CardContent>
          </Card>
        )}

        {images.length === 0 && !isUploadFormVisible ? (
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Nenhuma imagem ainda</h3>
            <p className="text-muted-foreground mb-4">
              {isOwner 
                ? "Adicione sua primeira imagem a este portfolio."
                : "Este portfolio ainda não possui imagens."
              }
            </p>
            {user ? (
              isOwner ? (
                <Button onClick={handleAddImage} className="flex items-center gap-2">
                  <Plus size={16} />
                  Adicionar Imagem
                </Button>
              ) : null
            ) : (
              <Button onClick={() => navigate('/auth')} className="flex items-center gap-2">
                <LogIn size={16} />
                Entrar para Adicionar Imagens
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Exibir carrossel quando em modo carrossel ou dispositivo móvel */}
            {viewMode === 'carousel' && images.length > 0 && (
              <div className="mb-8">
                <PortfolioCarousel images={images} />
              </div>
            )}
            
            {/* Exibir grade quando em modo grade */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div key={image.id} className="group relative">
                    <ImageCard image={image} />
                    {isOwner && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteImage(image.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Excluir
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A imagem será permanentemente excluída.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Portfolio;
