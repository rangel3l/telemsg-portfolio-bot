import { useState, useEffect } from 'react';
import { Portfolio } from '@/types';
import { getPortfolio } from '@/services/supabaseService';

export const usePortfolio = (id?: string) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!id) {
        setPortfolio(null);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getPortfolio(id);
        setPortfolio(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch portfolio'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  return {
    portfolio,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      return getPortfolio(id!);
    },
  };
};
