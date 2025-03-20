
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ImageCard from '@/components/ImageCard';
import { getPortfolio, getPortfolioImages } from '@/utils/data';
import { Portfolio as PortfolioType, Image } from '@/types';

const Portfolio = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    // Simulate API loading
    setIsLoading(true);
    
    // Fetch portfolio data
    const portfolioData = getPortfolio(id);
    if (!portfolioData) {
      navigate('/not-found');
      return;
    }
    
    // Fetch portfolio images
    const portfolioImages = getPortfolioImages(id);
    
    // Set state after a small delay to simulate loading
    setTimeout(() => {
      setPortfolio(portfolioData);
      setImages(portfolioImages);
      setIsLoading(false);
    }, 500);
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6"></div>
            <div className="h-6 w-96 bg-gray-200 dark:bg-gray-800 rounded-lg mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                  <div className="aspect-[4/3] w-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <button 
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
            onClick={() => navigate('/')}
          >
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
              <path d="m15 18-6-6 6-6" />
            </svg>
            Voltar para Portfolios
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{portfolio?.name}</h1>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
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
            {images.length} {images.length === 1 ? 'imagem' : 'imagens'}
          </div>
        </div>
        
        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up">
            {images.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-12 h-12 mx-auto text-gray-400 mb-4"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Nenhuma imagem encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Envie imagens pelo Telegram para este portfolio.</p>
          </div>
        )}
        
        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Como adicionar mais imagens</h2>
          
          <div className="flex items-start mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium mr-3">
              1
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                Abra o Telegram e navegue para o bot <span className="font-medium">ImageFolioBot</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-start mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium mr-3">
              2
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                Envie uma imagem com uma legenda descritiva
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium mr-3">
              3
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                A imagem será automaticamente adicionada a este portfolio
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
