
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPortfolios, createPortfolio, getUserPortfolios } from '@/services/supabaseService';
import { Portfolio } from '@/types';
import PortfolioGrid from '@/components/PortfolioGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Plus, Image as ImageIcon, LogIn } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const Index = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Só busca portfolios se o usuário estiver logado
    if (user) {
      fetchPortfolios();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPortfolios = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Buscar apenas os portfolios do usuário logado
      const data = await getUserPortfolios();
      setPortfolios(data);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar portfolios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um portfolio",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (!newPortfolioName.trim()) {
      toast({
        title: "Erro",
        description: "O nome do portfolio não pode estar vazio",
        variant: "destructive"
      });
      return;
    }
    
    setCreating(true);
    try {
      const newPortfolio = await createPortfolio(newPortfolioName);
      setPortfolios([newPortfolio, ...portfolios]);
      setNewPortfolioName('');
      setDialogOpen(false);
      toast({
        title: "Sucesso",
        description: `Portfolio "${newPortfolioName}" criado com sucesso`
      });
    } catch (error) {
      console.error("Error creating portfolio:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar portfolio",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const openCreateDialog = () => {
    if (!user) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para criar um portfolio",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    setDialogOpen(true);
  };

  const renderPortfoliosContent = () => {
    if (loading || authLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
              <Skeleton className="aspect-[3/2] w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!user) {
      return (
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <div className="mb-12">
            <img 
              src="/lovable-uploads/b1abe2cd-41f0-43e5-a9e2-ea123b70684b.png" 
              alt="ImageFolio Logo" 
              className="mx-auto h-32 mb-6"
            />
            <h2 className="text-4xl font-bold mb-4">Bem-vindo ao ImageFolio</h2>
            <p className="text-xl text-muted-foreground mb-8">
              A plataforma ideal para organizar e compartilhar suas coleções de imagens
            </p>
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              className="mx-auto"
            >
              Começar Agora
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <Card>
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-center">Organize suas Imagens</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Crie portfolios personalizados e organize suas imagens da maneira que preferir
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <rect width="8" height="4" x="8" y="12" rx="1" />
                  </svg>
                </div>
                <CardTitle className="text-center">Acesso Simples</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Acesse suas imagens de qualquer lugar, a qualquer hora
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                </div>
                <CardTitle className="text-center">Compartilhe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Compartilhe seus portfolios com amigos, familiares ou clientes
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-20 bio-gradient p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6" id="how-it-works">Como o ImageFolio Funciona</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold mb-2">Para Criadores</h3>
                <ul className="list-disc pl-5 space-y-2 text-left">
                  <li>Crie uma conta gratuita</li>
                  <li>Organize suas imagens em portfolios temáticos</li>
                  <li>Faça upload de suas imagens diretamente do seu dispositivo</li>
                  <li>Adicione descrições detalhadas para cada imagem</li>
                  <li>Organize e edite seus portfolios a qualquer momento</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Para Visualizadores</h3>
                <ul className="list-disc pl-5 space-y-2 text-left">
                  <li>Navegue por portfolios compartilhados</li>
                  <li>Visualize imagens em alta resolução</li>
                  <li>Explore coleções organizadas por tema</li>
                  <li>Interface intuitiva e responsiva</li>
                  <li>Compatível com todos os dispositivos</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Button onClick={() => navigate('/auth')}>Criar Minha Conta</Button>
            </div>
          </div>
        </div>
      );
    }

    if (portfolios.length === 0) {
      return (
        <Card className="text-center border-dashed">
          <CardContent className="pt-12 pb-12 flex flex-col items-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <ImageIcon className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-xl mb-2">
              Nenhum portfolio ainda
            </CardTitle>
            <CardDescription className="mb-6 max-w-md mx-auto">
              Crie seu primeiro portfolio para começar a adicionar suas imagens e organizá-las facilmente.
            </CardDescription>
            <Button onClick={openCreateDialog} className="flex items-center gap-2">
              <Plus size={16} />
              Criar Meu Primeiro Portfolio
            </Button>
          </CardContent>
        </Card>
      );
    }

    return <PortfolioGrid portfolios={portfolios} />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4 mt-20">
        {user && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Portfolios</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie suas coleções de imagens
              </p>
            </div>

            <Button onClick={openCreateDialog} className="flex items-center gap-2">
              <Plus size={16} />
              Criar Portfolio
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Portfolio</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePortfolio} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nome do Portfolio
                    </label>
                    <Input
                      id="name"
                      value={newPortfolioName}
                      onChange={(e) => setNewPortfolioName(e.target.value)}
                      placeholder="Digite o nome do portfolio"
                      disabled={creating}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={creating}>
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={creating || !newPortfolioName.trim()}>
                      {creating ? 'Criando...' : 'Criar Portfolio'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {renderPortfoliosContent()}
      </div>
    </div>
  );
};

export default Index;
