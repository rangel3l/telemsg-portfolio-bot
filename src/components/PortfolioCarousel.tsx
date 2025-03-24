import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageItem } from '@/types';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PortfolioCarouselProps {
  images: ImageItem[];
  className?: string;
  autoplayInterval?: number; // em milissegundos
}

const getAspectRatio = (width: number, height: number): number => {
  return width / height;
};

const PortfolioCarousel: React.FC<PortfolioCarouselProps> = ({
  images,
  className,
  autoplayInterval = 5000 // 5 segundos padrão
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean[]>(Array(images.length).fill(true));
  const [aspectRatios, setAspectRatios] = useState<number[]>(Array(images.length).fill(1));
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();
  const progressInterval = useRef<number | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  useEffect(() => {
    if (!images || images.length === 0) return;
    
    const newAspectRatios = [...aspectRatios];
    
    const loadImage = (image: ImageItem, index: number) => {
      const img = new globalThis.Image();
      img.onload = () => {
        newAspectRatios[index] = getAspectRatio(img.width, img.height);
        setAspectRatios([...newAspectRatios]);
        
        setIsLoading(prev => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      };
      img.src = image.url;
    };

    images.forEach((image, index) => {
      loadImage(image, index);
    });
  }, [aspectRatios, images]);

  const handleImageLoad = (index: number) => {
    setIsLoading(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  const handleImageError = (index: number) => {
    setIsLoading(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setProgress(0);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setProgress(0);
  }, [images.length]);

  useEffect(() => {
    if (autoplayInterval <= 0 || images.length <= 1 || isPaused) return;
    
    // Reset progress bar animation on image change
    setProgress(0);
    
    // Clear any existing intervals
    if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
    }
    
    const startTime = Date.now();
    const updateProgressBar = () => {
      const elapsedTime = Date.now() - startTime;
      const progressValue = Math.min((elapsedTime / autoplayInterval) * 100, 100);
      setProgress(progressValue);
      
      if (progressValue >= 100) {
        if (progressInterval.current) {
          window.clearInterval(progressInterval.current);
        }
      }
    };
    
    // Update progress more frequently for smooth animation
    progressInterval.current = window.setInterval(updateProgressBar, 16) as unknown as number;
    
    const intervalId = window.setTimeout(nextSlide, autoplayInterval);
    
    return () => {
      window.clearTimeout(intervalId);
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, nextSlide, autoplayInterval, images.length, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleImageContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isImageClick = target.tagName.toLowerCase() === 'img';
    
    if (isImageClick) {
      setIsOverlayVisible(false);
      setIsPaused(true);
    }
  };

  const preventContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  };

  const handleCaptionClick = useCallback((e: React.MouseEvent, image: ImageItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImage(image);
  }, []);

  const handleImageMouseDown = () => {
    setIsOverlayVisible(false);
    setIsPaused(true);
  };

  const handleImageMouseUp = () => {
    setIsOverlayVisible(true);
    setIsPaused(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className={cn("w-full rounded-xl overflow-hidden", className)}>
        <AspectRatio ratio={16/9}>
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma imagem disponível</p>
          </div>
        </AspectRatio>
      </div>
    );
  }

  return (
    <>
      <div className={cn("relative w-full rounded-xl overflow-hidden group max-w-3xl mx-auto", className)}>
        {/* Progress bar at the top */}
        <div className={cn(
          "absolute top-0 left-0 right-0 z-40 px-0 transition-opacity duration-300",
          isOverlayVisible ? "opacity-100" : "opacity-0"
        )}>
          <Progress value={progress} className="h-1 rounded-none bg-gray-200/20" indicatorClassName="bg-white" />
        </div>
        
        <AspectRatio ratio={aspectRatios[currentIndex]} className="w-full h-auto max-h-[70vh]">
          <div className="relative w-full h-full">
            {images.map((image, index) => {
              // Determine o título a ser exibido
              const displayTitle = image.imageName || (image.caption && image.caption.split('.')[0]) || 'Sem título';
              
              return (
                <div
                  key={image.id}
                  className={cn(
                    "absolute inset-0 w-full h-full transition-opacity duration-500",
                    index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  )}
                >
                  <>
                    {/* Base Image Layer */}
                    <div 
                      className="absolute inset-0 cursor-pointer" 
                      onClick={handleImageContainerClick}
                      onMouseDown={handleImageMouseDown}
                      onMouseUp={handleImageMouseUp}
                      onMouseLeave={handleImageMouseUp}
                      onTouchStart={handleImageMouseDown}
                      onTouchEnd={handleImageMouseUp}
                    >
                      <img
                        src={image.url}
                        alt={image.caption || 'Imagem do portfólio'}
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                        onLoad={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                        style={{ WebkitTouchCallout: 'none' }}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>

                    {/* Overlay Container */}
                    <div 
                      className={cn(
                        "absolute inset-0 z-30 transition-all duration-300 pointer-events-none",
                        isOverlayVisible ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {/* Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      {/* Text Content - Added caption-container class */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full p-4 md:p-6 pointer-events-auto">
                        <div 
                          className="caption-container bg-black/30 p-4 rounded-lg backdrop-blur-sm max-w-3xl mx-auto"
                          onClick={(e) => e.stopPropagation()} // Prevent click from reaching image layer
                        >
                          <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide text-white mb-2">
                            {displayTitle}
                          </h3>
                          <div className="w-12 h-0.5 bg-white/50 mb-2"/>
                          <p className="text-sm md:text-base text-white/90 line-clamp-3">
                            {image.caption}
                          </p>
                          <p className="text-xs text-white/70 mt-2">
                            {new Date(image.createdAt).toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          {image.caption && image.caption.length > 150 && (
                            <button 
                              className="text-xs text-white/70 mt-1 hover:text-white transition-colors"
                              onClick={(e) => handleCaptionClick(e, image)}
                            >
                              Ler mais...
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              );
            })}
          </div>
        </AspectRatio>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute left-0 md:left-4 top-[25%] -translate-y-1/2 z-40 bg-black/30 hover:bg-black/50 text-white rounded-[30px] h-32 w-8 md:h-24 md:w-12 transition-opacity",
            isOverlayVisible ? "opacity-70 hover:opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 md:h-6 md:w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-0 md:right-4 top-[25%] -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-[30px] h-32 w-8 md:h-24 md:w-12 transition-all",
            isOverlayVisible ? "opacity-70 hover:opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 md:h-6 md:w-6" />
        </Button>
        
        <div className={cn(
          "absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 pb-1 z-30 transition-opacity duration-300",
          isOverlayVisible ? "opacity-100" : "opacity-0"
        )}>
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all",
                index === currentIndex 
                  ? "bg-white w-3 md:w-4" 
                  : "bg-white/60 hover:bg-white/80"
              )}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Add Dialog for full caption view */}
      <Dialog 
        open={!!selectedImage} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null);
            setIsPaused(false); // Resume carousel when closing dialog
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedImage?.imageName || 'Detalhes da Imagem'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image preview */}
            <div className="rounded-lg overflow-hidden">
              <img
                src={selectedImage?.url}
                alt={selectedImage?.caption}
                className="w-full h-auto"
              />
            </div>
            
            {/* Caption with full text */}
            <div className="space-y-2">
              {selectedImage?.imageName && (
                <h3 className="font-semibold text-lg">
                  {selectedImage.imageName}
                </h3>
              )}
              {selectedImage?.caption && (
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedImage.caption}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {selectedImage && new Date(selectedImage.createdAt).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PortfolioCarousel;
