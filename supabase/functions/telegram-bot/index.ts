
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Only POST requests are accepted
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get request body
    const body = await req.json();
    console.log("Received webhook:", JSON.stringify(body));

    // Process Telegram update
    if (body.message) {
      const { message } = body;
      const chatId = message.chat.id;
      const text = message.text || '';
      const user = message.from;

      // Upsert user in database
      await supabase.from('telegram_users').upsert({
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name
      });

      // Process command
      if (text.startsWith('/')) {
        const command = text.split(' ')[0].toLowerCase();
        const args = text.split(' ').slice(1).join(' ');

        switch (command) {
          case '/start':
            await sendTelegramMessage(telegramBotToken, chatId, 
              "Welcome to the Portfolio Bot! Here are the available commands:\n" +
              "/portfolio [name] - Create a new portfolio\n" +
              "/list - List all portfolios\n" +
              "/select [portfolio_id] - Select a portfolio for adding images\n" +
              "/help - Show this help message");
            break;

          case '/help':
            await sendTelegramMessage(telegramBotToken, chatId,
              "Available commands:\n" +
              "/portfolio [name] - Create a new portfolio\n" +
              "/list - List all portfolios\n" +
              "/select [portfolio_id] - Select a portfolio for adding images\n" +
              "Send an image with caption to add it to your selected portfolio");
            break;

          case '/portfolio':
            if (!args) {
              await sendTelegramMessage(telegramBotToken, chatId, "Please provide a name for the portfolio");
              break;
            }
            
            const { data: newPortfolio, error: portfolioError } = await supabase
              .from('portfolios')
              .insert({ name: args })
              .select()
              .single();
            
            if (portfolioError) {
              console.error("Error creating portfolio:", portfolioError);
              await sendTelegramMessage(telegramBotToken, chatId, "Failed to create portfolio");
              break;
            }
            
            // Set as active portfolio
            await supabase
              .from('telegram_users')
              .update({ active_portfolio_id: newPortfolio.id })
              .eq('id', user.id);
            
            await sendTelegramMessage(telegramBotToken, chatId, 
              `Portfolio "${args}" created! ID: ${newPortfolio.id}\n` +
              `This is now your active portfolio for adding images.`);
            break;

          case '/list':
            const { data: portfolios, error: listError } = await supabase
              .from('portfolios')
              .select(`
                id, 
                name, 
                created_at,
                images:images(count)
              `)
              .order('created_at', { ascending: false });
            
            if (listError) {
              console.error("Error listing portfolios:", listError);
              await sendTelegramMessage(telegramBotToken, chatId, "Failed to list portfolios");
              break;
            }
            
            if (portfolios.length === 0) {
              await sendTelegramMessage(telegramBotToken, chatId, "No portfolios found. Create one with /portfolio [name]");
              break;
            }
            
            let message = "Your portfolios:\n\n";
            for (const p of portfolios) {
              const imageCount = p.images.length || 0;
              message += `📁 ${p.name}\n`;
              message += `ID: ${p.id}\n`;
              message += `Images: ${imageCount}\n\n`;
            }
            message += "Use /select [portfolio_id] to choose one for adding images.";
            
            await sendTelegramMessage(telegramBotToken, chatId, message);
            break;

          case '/select':
            if (!args) {
              await sendTelegramMessage(telegramBotToken, chatId, "Please provide the ID of the portfolio");
              break;
            }
            
            const { data: portfolio, error: selectError } = await supabase
              .from('portfolios')
              .select('id, name')
              .eq('id', args)
              .single();
            
            if (selectError) {
              console.error("Error selecting portfolio:", selectError);
              await sendTelegramMessage(telegramBotToken, chatId, `Portfolio with ID "${args}" not found`);
              break;
            }
            
            // Update active portfolio
            await supabase
              .from('telegram_users')
              .update({ active_portfolio_id: portfolio.id })
              .eq('id', user.id);
            
            await sendTelegramMessage(telegramBotToken, chatId, 
              `Portfolio "${portfolio.name}" selected! You can now send images to add to this portfolio.`);
            break;

          default:
            await sendTelegramMessage(telegramBotToken, chatId, "Unknown command. Use /help to see available commands.");
        }
      } 
      // Handle photo uploads
      else if (message.photo) {
        // Get the largest photo
        const photo = message.photo[message.photo.length - 1];
        const caption = message.caption || '';
        
        // Check if user has an active portfolio
        const { data: userData, error: userError } = await supabase
          .from('telegram_users')
          .select('active_portfolio_id')
          .eq('id', user.id)
          .single();
        
        if (userError || !userData.active_portfolio_id) {
          await sendTelegramMessage(telegramBotToken, chatId, 
            "No active portfolio selected. Please use /select [portfolio_id] first.");
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Get file from Telegram
        const fileResponse = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getFile?file_id=${photo.file_id}`);
        const fileData = await fileResponse.json();
        
        if (!fileData.ok) {
          console.error("Error getting file:", fileData);
          await sendTelegramMessage(telegramBotToken, chatId, "Failed to process image");
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        const filePath = fileData.result.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${telegramBotToken}/${filePath}`;
        
        // Download the file
        const imageResponse = await fetch(fileUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        
        // Upload to Supabase storage
        const filename = `telegram_${Date.now()}_${filePath.split('/').pop()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('portfolio_images')
          .upload(filename, imageBuffer, {
            contentType: 'image/jpeg',
          });
        
        if (uploadError) {
          console.error("Error uploading to storage:", uploadError);
          await sendTelegramMessage(telegramBotToken, chatId, "Failed to save image");
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio_images')
          .getPublicUrl(filename);
        
        // Save to database
        const { data: imageData, error: imageError } = await supabase
          .from('images')
          .insert({
            portfolio_id: userData.active_portfolio_id,
            url: publicUrl,
            caption: caption
          })
          .select()
          .single();
        
        if (imageError) {
          console.error("Error saving image to database:", imageError);
          await sendTelegramMessage(telegramBotToken, chatId, "Failed to save image details");
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        await sendTelegramMessage(telegramBotToken, chatId, 
          "Image added to your portfolio! View all your portfolios at your website.");
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to send messages via Telegram
async function sendTelegramMessage(token: string, chatId: number, text: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API error:", errorData);
    }
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}
