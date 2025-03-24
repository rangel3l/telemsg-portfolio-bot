
import { useState, useEffect } from 'react';
import { ImageItem } from '@/types';
import { getPortfolioImages } from '@/services/supabaseService';

export const useImages = (portfolioId?: string) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!portfolioId) {
        setImages([]);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getPortfolioImages(portfolioId);
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch images'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [portfolioId]);

  return {
    images,
    isLoading,
    error,
    refetch: async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPortfolioImages(portfolioId!);
        setImages(data);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch images'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
  };
};
