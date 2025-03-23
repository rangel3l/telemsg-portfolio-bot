import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Portfolio } from '@/types';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import PortfolioCard from './PortfolioCard'; // Adjusted for default import

interface PortfolioGridProps {
  portfolios: Portfolio[];
  className?: string;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ portfolios, className }) => {
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
        <PortfolioCard 
          key={portfolio.id} 
          portfolio={portfolio} 
        />
      ))}
    </div>
  );
};

export default PortfolioGrid;
