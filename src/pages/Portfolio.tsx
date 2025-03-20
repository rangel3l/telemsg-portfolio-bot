
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getPortfolio, 
  getPortfolioImages, 
  deleteImage 
} from '@/services/supabaseService';
import { Portfolio as PortfolioType, Image } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ImageCard from '@/components/ImageCard';
import AddImageForm from '@/components/AddImageForm';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Portfolio = () => {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const portfolioData = await getPortfolio(id);
      if (!portfolioData) {
        navigate('/not-found');
        return;
      }
      
      setPortfolio(portfolioData);
      
      const imagesData = await getPortfolioImages(id);
      setImages(imagesData);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      toast({
        title: "Error",
        description: "Failed to load portfolio data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRefresh = () => {
    fetchData();
    setAddDialogOpen(false);
  };

  const handleDeleteImage = async (imageId: string) => {
    setDeleteImageId(imageId);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteImageId) return;
    
    try {
      await deleteImage(deleteImageId);
      setImages(images.filter(img => img.id !== deleteImageId));
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive"
      });
    } finally {
      setConfirmDialogOpen(false);
      setDeleteImageId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary">Portfolios</Link>
            <span>/</span>
            <span className="font-medium text-foreground">{portfolio.name}</span>
          </div>
          <h1 className="text-3xl font-bold">{portfolio.name}</h1>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Image</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Image to {portfolio.name}</DialogTitle>
            </DialogHeader>
            <AddImageForm portfolioId={portfolio.id} onSuccess={handleRefresh} />
          </DialogContent>
        </Dialog>
      </div>

      {images.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No images yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first image to this portfolio.
          </p>
          <Button onClick={() => setAddDialogOpen(true)}>Add Image</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="group relative">
              <ImageCard image={image} />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <AlertDialog open={confirmDialogOpen && deleteImageId === image.id} onOpenChange={setConfirmDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Portfolio;
