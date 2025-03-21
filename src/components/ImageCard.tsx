
import React, { useState } from 'react';
import { Image } from '@/types';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface ImageCardProps {
  image: Image;
  className?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // Format date - e.g., "15 Jun 2023"
  const formattedDate = new Date(image.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  return (
    <div 
      className={cn(
        "image-card rounded-xl overflow-hidden bg-white dark:bg-black/50 shadow-md transition-all duration-300",
        "hover:shadow-xl dark:hover:shadow-black/20 border border-gray-100 dark:border-gray-800",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {!isLoaded && !isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
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
      </div>
      
      <div className="p-4">
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">{formattedDate}</p>
        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium mb-1">
          {image.caption}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
