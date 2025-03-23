import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Verificar tema salvo ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };
  
  // Obter as iniciais do nome do usuário para o avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    const userMetadata = user.user_metadata;
    if (userMetadata && userMetadata.name) {
      const name = userMetadata.name as string;
      return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U';
  };
  
  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50">
      <div className="glass-morphism py-3 px-4 md:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800 shadow-sm animate-fade-in">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mr-3">
              <img 
                src="/lovable-uploads/b1abe2cd-41f0-43e5-a9e2-ea123b70684b.png" 
                alt="ImageFolio Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight">
              ImageFolio
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <NavLink 
                href="/" 
                active={location.pathname === '/'} 
                label="Portfolios" 
              />
            )}
            <NavLink 
              href="#how-it-works" 
              active={location.hash === '#how-it-works'} 
              label="Como Funciona" 
            />
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2"
                    disabled
                  >
                    <User size={16} />
                    <span className="font-medium truncate max-w-[150px]">
                      {user.user_metadata.name || user.email}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive flex items-center gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2"
              >
                <User size={16} />
                Entrar
              </Button>
            )}
            
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  active: boolean;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, active, label }) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      // It's a hash link
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // It's a route
      navigate(href);
    }
  };
  
  return (
    <a 
      href={href}
      onClick={handleClick}
      className={cn(
        "relative px-1 py-2 text-sm font-medium transition-colors",
        active 
          ? "text-primary dark:text-primary" 
          : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      )}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
      )}
    </a>
  );
};

export default Header;
