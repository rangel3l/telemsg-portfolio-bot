import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageItem, Annotation } from '@/types';

interface PortfolioCarouselProps {
  images: ImageItem[];
  initialIndex?: number;
}

const PortfolioCarousel: React.FC<PortfolioCarouselProps> = ({ 
  images, 
  initialIndex = 0 
}) => {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(initialIndex);
  
  useEffect(() => {
    if (!api) return;
    
    const setInitialSlide = () => {
      if (initialIndex > 0 && initialIndex < images.length) {
        api.scrollTo(initialIndex);
      }
    };
    
    setInitialSlide();
    
  }, [api, initialIndex, images.length]);
  
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  
  const currentImage = images[current];
  
  const renderAnnotations = (annotations: Annotation[] | undefined) => {
    if (!annotations || annotations.length === 0) return null;
    
    return annotations.map((annotation) => (
      <div
        key={annotation.id}
        className="absolute pointer-events-none"
        style={{
          left: `${annotation.x}%`,
          top: `${annotation.y}%`,
        }}
      >
        <div className="absolute right-full mb-2 p-2 rounded backdrop-blur-sm translate-y-[-50%] mr-2">
          <div
            className="text-white min-w-[120px]"
            style={{
              fontFamily: annotation.fontFamily,
              fontSize: annotation.fontSize,
              color: annotation.color,
            }}
          >
            {annotation.text}
          </div>
        </div>

        <div
          style={{
            transform: `rotate(${annotation.arrowAngle}deg)`,
          }}
        >
          <div
            className="absolute h-[2px] origin-left"
            style={{
              backgroundColor: annotation.color,
              width: `${annotation.arrowLength}px`,
            }}
          >
            <div
              className="absolute right-0 transform translate-x-[1px]"
              style={{ color: annotation.color }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{
                  transform: 'rotate(-90deg) translate(50%, 0)',
                }}
              >
                <path
                  d="M6 0L12 12H0L6 0Z"
                  fill={annotation.color}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ));
  };
  
  return (
    <div className="w-full">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id}>
              <div className="p-1">
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                  <AspectRatio ratio={4/3} className="bg-muted relative">
                    <img
                      src={image.url}
                      alt={image.caption || 'Image'}
                      className="object-cover w-full h-full"
                    />
                    {renderAnnotations(image.annotations)}
                  </AspectRatio>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
      
      {currentImage && (
        <div className="mt-4">
          {currentImage.imageName && (
            <h3 className="text-lg font-bold">{currentImage.imageName}</h3>
          )}
          {currentImage.caption && (
            <p className="text-sm text-muted-foreground mt-1">{currentImage.caption}</p>
          )}
          <div className="text-xs text-muted-foreground mt-2">
            Imagem {current + 1} de {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioCarousel;
