
import React, { useState, useEffect } from 'react';
import { getPortfolios, createPortfolio } from '@/services/supabaseService';
import { Portfolio } from '@/types';
import PortfolioGrid from '@/components/PortfolioGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

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
    <div className="container mx-auto py-8 px-4">
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
          You can also manage your portfolios and add images directly from Telegram!
        </p>
        <div className="bg-muted p-4 rounded-md">
          <p className="font-medium mb-2">How to use:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Set up your Telegram bot token in Supabase Edge Functions Secrets</li>
            <li>Configure the webhook URL for your bot to point to the Telegram bot Edge Function</li>
            <li>Start chatting with your bot to create portfolios and add images</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;
