import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PortfolioGrid from '@/components/PortfolioGrid';
import { useUserPortfolios } from '@/hooks/use-portfolios';
import ExportPdfButton from '@/components/ExportPdfButton';

const Portfolios: React.FC = () => {
  const navigate = useNavigate();
  const { portfolios, isLoading } = useUserPortfolios();

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="container py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-card p-6 rounded-xl shadow-md border">
        <div>
          <h1 className="text-3xl font-bold mb-2">Seus Portfólios</h1>
          <p className="text-muted-foreground">
            {portfolios.length} {portfolios.length === 1 ? 'portfólio' : 'portfólios'} encontrados
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button 
            onClick={() => navigate('/portfolio/new')} 
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Portfólio
          </Button>

          {portfolios.length > 0 && (
            <ExportPdfButton 
              portfolioName="Todos os Portfólios"
              variant="outline"
              className="w-full sm:w-auto"
            />
          )}
        </div>
      </div>

      {/* Portfolio Grid */}
      <PortfolioGrid portfolios={portfolios} />
    </div>
  );
};

export default Portfolios;