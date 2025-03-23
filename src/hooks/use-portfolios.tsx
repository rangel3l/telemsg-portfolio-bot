import { useState, useEffect } from 'react';
import { Portfolio } from '@/types';
import { getUserPortfolios } from '@/services/supabaseService';

export const useUserPortfolios = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const data = await getUserPortfolios();
        setPortfolios(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch portfolios'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  return {
    portfolios,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      return getUserPortfolios().then(setPortfolios);
    },
  };
};
