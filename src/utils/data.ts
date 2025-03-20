
import { Portfolio, Image } from '../types';

// Mock data for demonstration purposes
export const PORTFOLIOS: Portfolio[] = [
  {
    id: 'paleonto',
    name: 'Paleontologia',
    createdAt: '2023-06-15T10:30:00Z',
    imageCount: 4,
    coverImage: 'https://images.unsplash.com/photo-1601999103770-56a2c19b8b9d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2148&q=80'
  },
  {
    id: 'biologia',
    name: 'Biologia',
    createdAt: '2023-07-22T14:15:00Z',
    imageCount: 3,
    coverImage: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'quimica',
    name: 'Química',
    createdAt: '2023-08-05T09:45:00Z',
    imageCount: 2,
    coverImage: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
  }
];

export const IMAGES: Image[] = [
  // Paleontologia images
  {
    id: 'paleo-1',
    portfolioId: 'paleonto',
    url: 'https://images.unsplash.com/photo-1601999103770-56a2c19b8b9d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2148&q=80',
    caption: 'Fóssil de dinossauro encontrado na expedição de campo.',
    createdAt: '2023-06-15T10:30:00Z'
  },
  {
    id: 'paleo-2',
    portfolioId: 'paleonto',
    url: 'https://images.unsplash.com/photo-1519482067469-8ef78cb300d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    caption: 'Detalhes da mandíbula de um T-Rex, mostrando a estrutura dental.',
    createdAt: '2023-06-16T11:45:00Z'
  },
  {
    id: 'paleo-3',
    portfolioId: 'paleonto',
    url: 'https://images.unsplash.com/photo-1583481223112-e10e5f3e893d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80',
    caption: 'Processo de escavação do sítio arqueológico na aula de campo.',
    createdAt: '2023-06-17T14:20:00Z'
  },
  {
    id: 'paleo-4',
    portfolioId: 'paleonto',
    url: 'https://images.unsplash.com/photo-1586968193657-205824239a6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
    caption: 'Amostra de sedimentos com microfósseis analisados no laboratório.',
    createdAt: '2023-06-18T09:10:00Z'
  },
  
  // Biologia images
  {
    id: 'bio-1',
    portfolioId: 'biologia',
    url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    caption: 'Observação de células vegetais no microscópio óptico.',
    createdAt: '2023-07-22T14:15:00Z'
  },
  {
    id: 'bio-2',
    portfolioId: 'biologia',
    url: 'https://images.unsplash.com/photo-1583912086296-be5c9a2e2316?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2075&q=80',
    caption: 'Dissecação de coração bovino para estudo anatômico.',
    createdAt: '2023-07-23T11:30:00Z'
  },
  {
    id: 'bio-3',
    portfolioId: 'biologia',
    url: 'https://images.unsplash.com/photo-1581093196277-9f6e9b96cc02?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    caption: 'Coleta de amostras no ecossistema da mata atlântica.',
    createdAt: '2023-07-24T16:45:00Z'
  },
  
  // Química images
  {
    id: 'quim-1',
    portfolioId: 'quimica',
    url: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    caption: 'Experimento de titulação ácido-base com indicador fenolftaleína.',
    createdAt: '2023-08-05T09:45:00Z'
  },
  {
    id: 'quim-2',
    portfolioId: 'quimica',
    url: 'https://images.unsplash.com/photo-1616169986238-0822031d8926?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    caption: 'Cristalização de sulfato de cobre em laboratório.',
    createdAt: '2023-08-06T13:20:00Z'
  }
];

// Helper functions to work with the mock data
export const getPortfolios = (): Portfolio[] => {
  return PORTFOLIOS;
};

export const getPortfolio = (id: string): Portfolio | undefined => {
  return PORTFOLIOS.find(portfolio => portfolio.id === id);
};

export const getPortfolioImages = (portfolioId: string): Image[] => {
  return IMAGES.filter(image => image.portfolioId === portfolioId);
};

// In a real application, you would connect these to your backend API
export const createPortfolio = (name: string): Portfolio => {
  // Mock implementation
  const newPortfolio: Portfolio = {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    createdAt: new Date().toISOString(),
    imageCount: 0
  };
  
  // In a real app, you'd save this to the database
  console.log('Created new portfolio:', newPortfolio);
  
  return newPortfolio;
};

export const addImageToPortfolio = (
  portfolioId: string, 
  imageUrl: string, 
  caption: string
): Image => {
  // Mock implementation
  const newImage: Image = {
    id: `img-${Date.now()}`,
    portfolioId,
    url: imageUrl,
    caption,
    createdAt: new Date().toISOString()
  };
  
  // In a real app, you'd save this to the database
  console.log('Added new image to portfolio:', newImage);
  
  return newImage;
};
