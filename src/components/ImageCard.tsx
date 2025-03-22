
import React, { useState } from 'react';
import { ImageItem } from '@/types';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { AspectRatio } from './ui/aspect-ratio';

interface ImageCardProps {
  image: ImageItem;
  className?: string;
}

// Function to determine aspect ratio from image dimensions
const getAspectRatio = (width: number, height: number): number => {
  // Instagram supported ratios
  // 1:1 (square)
  // 4:5 (portrait)
  // 1.91:1 (landscape)
  
  const ratio = width / height;
  
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

const ImageCard: React.FC<ImageCardProps> = ({ image, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1); // Default to square ratio
  
  // Format date - e.g., "15 Jun 2023"
  const formattedDate = new Date(image.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  // Load image dimensions
  React.useEffect(() => {
    const img = new globalThis.Image();
    img.onload = () => {
      setImgWidth(img.width);
      setImgHeight(img.height);
      setAspectRatio(getAspectRatio(img.width, img.height));
    };
    img.src = image.url;
  }, [image.url]);
  
  return (
    <div 
      className={cn(
        "image-card rounded-xl overflow-hidden bio-card bio-card-hover transition-all duration-300",
        className
      )}
    >
      <div className="relative w-full overflow-hidden">
        <AspectRatio ratio={aspectRatio}>
          {!isLoaded && !isError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          )}
          
          {isError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="text-center p-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-2"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400">Imagem indisponível</p>
              </div>
            </div>
          )}
          
          <img 
            src={image.url} 
            alt={image.caption} 
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500",
              isLoaded && !isError ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setIsError(true);
              setIsLoaded(true);
            }}
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 transition-opacity"></div>
          
          {/* Caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="text-white/80 text-xs mb-1">{formattedDate}</p>
            <p className="text-white text-sm font-medium">
              {image.caption}
            </p>
          </div>
        </AspectRatio>
      </div>
    </div>
  );
};

export default ImageCard;
