
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
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
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center mr-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-6 h-6 text-white"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight">
              ImageFolio
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink 
              href="/" 
              active={location.pathname === '/'} 
              label="Portfolios" 
            />
            <NavLink 
              href="#how-it-works" 
              active={location.hash === '#how-it-works'} 
              label="Como Funciona" 
            />
            <NavLink 
              href="#telegram-bot" 
              active={location.hash === '#telegram-bot'} 
              label="Bot Telegram" 
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
            
            <button className="rounded-full w-10 h-10 flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </button>
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
