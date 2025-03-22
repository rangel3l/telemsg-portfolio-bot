
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Image } from '@/types';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from './ui/skeleton';

interface PortfolioCarouselProps {
  images: Image[];
  className?: string;
  autoplayInterval?: number; // em milissegundos
}

const PortfolioCarousel: React.FC<PortfolioCarouselProps> = ({
  images,
  className,
  autoplayInterval = 5000 // 5 segundos padrão
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean[]>(Array(images.length).fill(true));
  const isMobile = useIsMobile();

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
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // Configurar autoplay
  useEffect(() => {
    if (autoplayInterval <= 0 || images.length <= 1) return;
    
    const intervalId = setInterval(nextSlide, autoplayInterval);
    
    return () => clearInterval(intervalId);
  }, [nextSlide, autoplayInterval, images.length]);

  // Manipular pressionamento de teclas para navegação
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
    <div className={cn("relative w-full rounded-xl overflow-hidden group", className)}>
      {/* Carousel Container */}
      <AspectRatio ratio={isMobile ? 9/16 : 16/9}>
        <div className="relative w-full h-full">
          {/* Slides */}
          {images.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "absolute inset-0 w-full h-full transition-opacity duration-500",
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              {/* Skeleton loader */}
              {isLoading[index] && (
                <div className="absolute inset-0 z-10">
                  <Skeleton className="w-full h-full" />
                </div>
              )}
              
              {/* Image */}
              <img
                src={image.url}
                alt={image.caption || 'Imagem do portfólio'}
                className="w-full h-full object-cover"
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20" />
              
              {/* Caption content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-30 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{image.caption}</h3>
                <p className="text-sm md:text-base opacity-90 line-clamp-2">
                  {new Date(image.createdAt).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </AspectRatio>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 md:h-10 md:w-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 md:h-10 md:w-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
      
      {/* Indicators */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 pb-1 z-30">
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
  );
};

export default PortfolioCarousel;
