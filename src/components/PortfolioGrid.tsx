
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Portfolio } from '@/types';
import { cn } from '@/lib/utils';
import { AspectRatio } from './ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

interface PortfolioGridProps {
  portfolios: Portfolio[];
  className?: string;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ portfolios, className }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "grid gap-6",
      isMobile 
        ? "grid-cols-1" 
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      className
    )}>
      {portfolios.map((portfolio) => (
        <div 
          key={portfolio.id}
          className="bio-card bio-card-hover image-card rounded-xl overflow-hidden cursor-pointer"
          onClick={() => navigate(`/portfolio/${portfolio.id}`)}
        >
          <AspectRatio ratio={3/2}>
            <div className="relative w-full h-full">
              {portfolio.coverImage ? (
                <img 
                  src={portfolio.coverImage} 
                  alt={portfolio.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-12 h-12 text-gray-400 dark:text-gray-600"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-xl font-medium mb-1">{portfolio.name}</h3>
                <div className="flex items-center text-white/80 text-sm">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4 mr-1"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  {portfolio.imageCount} imagens
                </div>
              </div>
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  );
};

export default PortfolioGrid;
