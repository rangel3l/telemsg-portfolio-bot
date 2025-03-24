
import { supabase } from "@/integrations/supabase/client";
import { Portfolio, ImageItem, Annotation } from "@/types";

interface DatabaseImage {
  id: string;
  portfolio_id: string;
  url: string;
  caption: string;
  image_name?: string;
  created_at: string;
  annotations?: Annotation[];
}

// Portfolio functions
export const getPortfolios = async (): Promise<Portfolio[]> => {
  const { data, error } = await supabase
    .from('portfolios')
    .select(`
      id,
      name,
      created_at,
      images:images(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching portfolios:", error);
    throw error;
  }

  // Get cover image for each portfolio
  const portfoliosWithImages = await Promise.all(
    data.map(async (portfolio) => {
      const { data: images } = await supabase
        .from('images')
        .select('url')
        .eq('portfolio_id', portfolio.id)
        .order('created_at', { ascending: false })
        .limit(1);

      return {
        id: portfolio.id,
        name: portfolio.name,
        createdAt: portfolio.created_at,
        imageCount: portfolio.images.length || 0,
        coverImage: images && images.length > 0 ? images[0].url : undefined
      };
    })
  );

  return portfoliosWithImages;
};

export const getPortfolio = async (id: string): Promise<Portfolio | null> => {
  const { data, error } = await supabase
    .from('portfolios')
    .select(`
      id,
      name,
      created_at,
      images:images(count)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching portfolio:", error);
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw error;
  }

  // Get cover image
  const { data: images } = await supabase
    .from('images')
    .select('url')
    .eq('portfolio_id', data.id)
    .order('created_at', { ascending: false })
    .limit(1);

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    imageCount: data.images.length || 0,
    coverImage: images && images.length > 0 ? images[0].url : undefined
  };
};

export const createPortfolio = async (name: string): Promise<Portfolio> => {
  // Obter o usuário atual
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be authenticated to create a portfolio");
  }

  const { data, error } = await supabase
    .from('portfolios')
    .insert({ 
      name,
      user_id: user.id 
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating portfolio:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    imageCount: 0
  };
};

export const getUserPortfolios = async (): Promise<Portfolio[]> => {
  // Obter o usuário atual
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be authenticated to fetch portfolios");
  }

  const { data, error } = await supabase
    .from('portfolios')
    .select(`
      id,
      name,
      created_at,
      images:images(count)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user portfolios:", error);
    throw error;
  }

  // Get cover image for each portfolio
  const portfoliosWithImages = await Promise.all(
    data.map(async (portfolio) => {
      const { data: images } = await supabase
        .from('images')
        .select('url')
        .eq('portfolio_id', portfolio.id)
        .order('created_at', { ascending: false })
        .limit(1);

      return {
        id: portfolio.id,
        name: portfolio.name,
        createdAt: portfolio.created_at,
        imageCount: portfolio.images.length || 0,
        coverImage: images && images.length > 0 ? images[0].url : undefined
      };
    })
  );

  return portfoliosWithImages;
};

// Image functions
export const getPortfolioImages = async (portfolioId: string): Promise<ImageItem[]> => {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching images:", error);
    throw error;
  }

  return (data as DatabaseImage[]).map(image => ({
    id: image.id,
    portfolioId: image.portfolio_id,
    url: image.url,
    caption: image.caption || '',
    imageName: image.image_name || '',
    createdAt: image.created_at,
    annotations: image.annotations || []
  }));
};

export const addImageToPortfolio = async (
  portfolioId: string, 
  file: File, 
  caption: string,
  imageName?: string,
  annotations?: Annotation[]
): Promise<ImageItem> => {
  // Verificar se o usuário tem permissão para adicionar ao portfolio
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be authenticated to add images");
  }
  
  // Verificar se o portfolio pertence ao usuário
  const { data: portfolio, error: portfolioError } = await supabase
    .from('portfolios')
    .select('user_id')
    .eq('id', portfolioId)
    .single();
  
  if (portfolioError) {
    console.error("Error checking portfolio:", portfolioError);
    throw portfolioError;
  }
  
  if (portfolio.user_id !== user.id) {
    throw new Error("You do not have permission to add images to this portfolio");
  }

  // Sanitize filename to remove special characters and spaces
  const timestamp = Date.now();
  const sanitizedName = file.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .replace(/[^a-zA-Z0-9.]/g, '_'); // Replace non-alphanumeric with underscore
  
  const filename = `${timestamp}_${sanitizedName}`;

  // Upload image to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('portfolio_images')
    .upload(filename, file);

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw uploadError;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('portfolio_images')
    .getPublicUrl(filename);

  // Save image reference in database with annotations
  const { data, error } = await supabase
    .from('images')
    .insert([
      {
        portfolio_id: portfolioId,
        url: publicUrl,
        caption: caption,
        image_name: imageName,
        annotations: annotations || [] // Salvar anotações como JSON
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding image to database:", error);
    throw error;
  }

  return {
    id: data.id,
    portfolioId: data.portfolio_id,
    url: data.url,
    caption: data.caption || '',
    imageName: data.image_name || '',
    createdAt: data.created_at,
    annotations: data.annotations || []
  };
};

export const deleteImage = async (imageId: string): Promise<void> => {
  // Verificar se o usuário está autenticado
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be authenticated to delete images");
  }

  // Get the image URL first to delete from storage later
  const { data: imageData, error: fetchError } = await supabase
    .from('images')
    .select('url, portfolio_id')
    .eq('id', imageId)
    .single();

  if (fetchError) {
    console.error("Error fetching image:", fetchError);
    throw fetchError;
  }

  // Verificar se o portfolio pertence ao usuário
  const { data: portfolio, error: portfolioError } = await supabase
    .from('portfolios')
    .select('user_id')
    .eq('id', imageData.portfolio_id)
    .single();
  
  if (portfolioError) {
    console.error("Error checking portfolio:", portfolioError);
    throw portfolioError;
  }
  
  if (portfolio.user_id !== user.id) {
    throw new Error("You do not have permission to delete images from this portfolio");
  }

  // Delete the database record
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId);

  if (error) {
    console.error("Error deleting image from database:", error);
    throw error;
  }

  // Try to delete from storage if possible
  // Extract the filename from the URL
  try {
    const url = new URL(imageData.url);
    const pathSegments = url.pathname.split('/');
    const filename = pathSegments[pathSegments.length - 1];
    
    await supabase.storage
      .from('portfolio_images')
      .remove([filename]);
  } catch (err) {
    console.warn("Could not delete image file from storage:", err);
    // Continue anyway as the database record is deleted
  }
};
