
import React, { useState, useEffect } from 'react';
import { getPortfolios, createPortfolio } from '@/services/supabaseService';
import { Portfolio } from '@/types';
import PortfolioGrid from '@/components/PortfolioGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';

const Index = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const data = await getPortfolios();
      setPortfolios(data);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      toast({
        title: "Error",
        description: "Failed to load portfolios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPortfolioName.trim()) {
      toast({
        title: "Error",
        description: "Portfolio name cannot be empty",
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
        title: "Success",
        description: `Portfolio "${newPortfolioName}" created successfully`
      });
    } catch (error) {
      console.error("Error creating portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to create portfolio",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4 mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Portfolios</h1>
            <p className="text-muted-foreground mt-1">
              Browse through your image collections
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Portfolio</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Portfolio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePortfolio} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Portfolio Name
                  </label>
                  <Input
                    id="name"
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                    placeholder="Enter portfolio name"
                    disabled={creating}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={creating}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={creating || !newPortfolioName.trim()}>
                    {creating ? 'Creating...' : 'Create Portfolio'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
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
        ) : portfolios.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No portfolios yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first portfolio to get started.
            </p>
            <Button onClick={() => setDialogOpen(true)}>Create Portfolio</Button>
          </div>
        ) : (
          <PortfolioGrid portfolios={portfolios} />
        )}

        <div className="mt-16 py-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Telegram Bot Integration</h2>
          <p className="text-muted-foreground mb-4">
            Manage your portfolios and add images directly from Telegram! Our bot makes it easy to upload content on the go.
          </p>
          
          <div className="bg-muted rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Getting Started</h3>
              <ol className="list-decimal list-inside space-y-3">
                <li>Add our bot on Telegram: <span className="font-mono bg-background px-2 py-1 rounded">@portifolio_bio</span></li>
                <li>Start a conversation with the bot by sending <span className="font-mono bg-background px-2 py-1 rounded">/start</span></li>
                <li>The bot will guide you through the available commands</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Available Commands</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded border border-border p-3">
                  <code className="block font-mono mb-2 text-primary">/portfolio [name]</code>
                  <p className="text-sm text-muted-foreground">Create a new portfolio with the given name</p>
                </div>
                <div className="rounded border border-border p-3">
                  <code className="block font-mono mb-2 text-primary">/list</code>
                  <p className="text-sm text-muted-foreground">List all your portfolios</p>
                </div>
                <div className="rounded border border-border p-3">
                  <code className="block font-mono mb-2 text-primary">/select [portfolio_id]</code>
                  <p className="text-sm text-muted-foreground">Select a portfolio to add images to</p>
                </div>
                <div className="rounded border border-border p-3">
                  <code className="block font-mono mb-2 text-primary">/help</code>
                  <p className="text-sm text-muted-foreground">Show help with all available commands</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Adding Images</h3>
              <p className="mb-3">To add an image to your selected portfolio:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>First select a portfolio using <span className="font-mono bg-background px-2 py-1 rounded">/select [portfolio_id]</span></li>
                <li>Send an image to the bot (optionally with a caption)</li>
                <li>The image will be automatically added to your selected portfolio</li>
              </ol>
            </div>
            
            <div className="rounded-lg bg-primary/10 p-4 flex items-start gap-3">
              <div className="text-primary mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
              </div>
              <p className="text-sm">
                All images added through the Telegram bot will immediately appear in your portfolios on this website. Perfect for quickly building your collections on the go!
              </p>
            </div>
            
            <div className="mt-4 border-t pt-4 border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-medium mb-3">Telegram App Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded border border-border p-3">
                  <p className="font-medium mb-1">App Details</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><span className="font-mono">App title:</span> portifolio_bio</li>
                    <li><span className="font-mono">Short name:</span> porbio</li>
                  </ul>
                </div>
                <div className="rounded border border-border p-3">
                  <p className="font-medium mb-1">Production Server</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><span className="font-mono">Server:</span> 149.154.167.50:443</li>
                    <li><span className="font-mono">DC:</span> 2</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
