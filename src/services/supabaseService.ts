
import { supabase } from "@/integrations/supabase/client";
import { Portfolio, Image } from "@/types";

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
  const { data, error } = await supabase
    .from('portfolios')
    .insert({ name })
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

// Image functions
export const getPortfolioImages = async (portfolioId: string): Promise<Image[]> => {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching images:", error);
    throw error;
  }

  return data.map(image => ({
    id: image.id,
    portfolioId: image.portfolio_id,
    url: image.url,
    caption: image.caption || '',
    createdAt: image.created_at
  }));
};

export const addImageToPortfolio = async (
  portfolioId: string,
  imageFile: File,
  caption: string
): Promise<Image> => {
  // Upload image to storage
  const filename = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('portfolio_images')
    .upload(filename, imageFile);

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw uploadError;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('portfolio_images')
    .getPublicUrl(filename);

  // Save image reference in database
  const { data, error } = await supabase
    .from('images')
    .insert({
      portfolio_id: portfolioId,
      url: publicUrl,
      caption
    })
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
    createdAt: data.created_at
  };
};

export const deleteImage = async (imageId: string): Promise<void> => {
  // Get the image URL first to delete from storage later
  const { data: imageData, error: fetchError } = await supabase
    .from('images')
    .select('url')
    .eq('id', imageId)
    .single();

  if (fetchError) {
    console.error("Error fetching image:", fetchError);
    throw fetchError;
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
