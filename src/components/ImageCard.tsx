
import React, { useState } from 'react';
import { Image } from '@/types';
import { cn } from '@/lib/utils';

interface ImageCardProps {
  image: Image;
  className?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
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
        {!isLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img 
          src={image.url} 
          alt={image.caption} 
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      
      <div className="p-4">
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">{formattedDate}</p>
        <p className="text-gray-800 dark:text-gray-200 text-sm">{image.caption}</p>
      </div>
    </div>
  );
};

export default ImageCard;
