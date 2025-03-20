
import React from 'react';
import Header from '@/components/Header';
import PortfolioGrid from '@/components/PortfolioGrid';
import { getPortfolios } from '@/utils/data';

const Index = () => {
  const portfolios = getPortfolios();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <section className="mb-24 animate-fade-in">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Sistema Integrado
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
              Capturar, Organizar e Visualizar
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Envie fotos pelo Telegram, organize por matéria e visualize em um portfolio elegante.
            </p>
          </div>
        </section>
        
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Seus Portfolios</h2>
            <button className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 mr-2"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Novo Portfolio
            </button>
          </div>
          
          {portfolios.length > 0 ? (
            <div className="animate-fade-up">
              <PortfolioGrid portfolios={portfolios} />
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Nenhum portfolio encontrado</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Envie seu primeiro comando pelo Telegram para começar.</p>
            </div>
          )}
        </section>
        
        <section id="how-it-works" className="mb-16 py-16 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Como Funciona</h2>
              <p className="text-gray-600 dark:text-gray-300">Nosso sistema integra o Telegram com uma interface web para organizar suas imagens.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  >
                    <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                    <circle cx="17" cy="7" r="5" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">1. Crie uma Categoria</h3>
                <p className="text-gray-500 dark:text-gray-400">Envie um comando como "/paleonto" para seu bot Telegram para criar um novo portfolio.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">2. Envie Imagens</h3>
                <p className="text-gray-500 dark:text-gray-400">Tire fotos na sala de aula e envie junto com legendas explicativas para o bot.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" x2="16" y1="21" y2="21" />
                    <line x1="12" x2="12" y1="17" y2="21" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">3. Visualize Online</h3>
                <p className="text-gray-500 dark:text-gray-400">Acesse seu portfolio organizado através desta interface web, categorizado por matéria.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="telegram-bot" className="mb-16 py-16 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Bot Telegram</h2>
              <p className="text-gray-600 dark:text-gray-300">Conecte-se ao nosso bot para começar a organizar suas imagens.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-white"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-1.88-1.19-2.33-1.93-2.33-1.93l-.76-.53c-.13-.09-.15-.28.03-.41 0 0 2.89-2.58 3.2-2.87.38-.36.17-.55-.17-.37-.77.41-4.14 2.58-4.5 2.77-.36.2-1.12.07-1.12.07L5.1 12.4c-.36-.18-.4-.41-.02-.62 1.48-.81 3.35-1.83 3.35-1.83s1.87-1.01 3.74-2.02c1.4-.76 3.17-.95 2.47 1.87z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">ImageFolioBot</h3>
                  <p className="text-gray-500 dark:text-gray-400">Bot oficial para organização de imagens</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-5 h-5 text-green-500 mr-2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Comandos:</span> Use "/nomedamateria" para criar novos portfolios</p>
                </div>
                
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-5 h-5 text-green-500 mr-2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Imagens:</span> Envie fotos com legendas para categorizar automaticamente</p>
                </div>
                
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-5 h-5 text-green-500 mr-2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Ajuda:</span> Use "/help" para ver todos os comandos disponíveis</p>
                </div>
              </div>
              
              <div className="mt-6">
                <a 
                  href="https://t.me/ImageFolioBot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 w-full md:w-auto transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-1.88-1.19-2.33-1.93-2.33-1.93l-.76-.53c-.13-.09-.15-.28.03-.41 0 0 2.89-2.58 3.2-2.87.38-.36.17-.55-.17-.37-.77.41-4.14 2.58-4.5 2.77-.36.2-1.12.07-1.12.07L5.1 12.4c-.36-.18-.4-.41-.02-.62 1.48-.81 3.35-1.83 3.35-1.83s1.87-1.01 3.74-2.02c1.4-.76 3.17-.95 2.47 1.87z"
                      fill="currentColor"
                    />
                  </svg>
                  Conectar ao Bot
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mr-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5 text-white"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © 2023 ImageFolio. Todos os direitos reservados.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <span className="sr-only">Telegram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
