
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body?: { data?: string };
    parts?: Array<{ mimeType: string; body?: { data?: string } }>;
  };
  internalDate: string;
  labelIds: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Gmail sync process...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('No authorization header');
    }

    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) {
      console.error('User not found from auth token');
      throw new Error('User not found');
    }

    console.log('User authenticated:', user.id);

    // Check for required environment variables
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth credentials');
      throw new Error('Google OAuth credentials not configured. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Supabase secrets.');
    }

    // Get user's Gmail tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_gmail_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (tokenError || !tokenData) {
      console.error('Gmail tokens not found:', tokenError);
      throw new Error('Gmail not connected. Please connect your Gmail account first.');
    }

    console.log('Gmail tokens found for user');

    // Check if token is expired and refresh if needed
    let accessToken = tokenData.access_token;
    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      console.log('Access token expired, refreshing...');
      
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: tokenData.refresh_token,
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
        }),
      });

      const refreshTokens = await refreshResponse.json();
      if (refreshResponse.ok) {
        accessToken = refreshTokens.access_token;
        await supabase
          .from('user_gmail_tokens')
          .update({
            access_token: refreshTokens.access_token,
            expires_at: new Date(Date.now() + refreshTokens.expires_in * 1000).toISOString(),
          })
          .eq('user_id', user.id);
        console.log('Access token refreshed successfully');
      } else {
        console.error('Token refresh failed:', refreshTokens);
        throw new Error('Failed to refresh access token');
      }
    }

    // Fetch emails from Gmail API
    console.log('Fetching messages from Gmail...');
    const messagesResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=in:inbox',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const messagesData = await messagesResponse.json();

    if (!messagesResponse.ok) {
      console.error('Gmail API error:', messagesData);
      throw new Error(`Gmail API error: ${messagesData.error?.message || 'Unknown error'}`);
    }

    console.log(`Found ${messagesData.messages?.length || 0} messages`);

    const emails = [];

    // Process each message
    for (const message of messagesData.messages || []) {
      try {
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        const messageData: GmailMessage = await messageResponse.json();

        if (!messageResponse.ok) {
          console.error(`Failed to fetch message ${message.id}:`, messageData);
          continue;
        }

        // Extract email data
        const headers = messageData.payload.headers;
        const from = headers.find(h => h.name === 'From')?.value || '';
        const to = headers.find(h => h.name === 'To')?.value || '';
        const subject = headers.find(h => h.name === 'Subject')?.value || '';

        // Extract body text
        let bodyText = '';
        let bodyHtml = '';

        if (messageData.payload.body?.data) {
          bodyText = atob(messageData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        } else if (messageData.payload.parts) {
          for (const part of messageData.payload.parts) {
            if (part.mimeType === 'text/plain' && part.body?.data) {
              bodyText = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            } else if (part.mimeType === 'text/html' && part.body?.data) {
              bodyHtml = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            }
          }
        }

        // Extract sender name and email
        const fromMatch = from.match(/^(.*?)\s*<(.+)>$/) || [null, from, from];
        const fromName = fromMatch[1]?.trim().replace(/"/g, '') || '';
        const fromEmail = fromMatch[2] || from;

        // Determine category and priority based on content
        const priority = subject.toLowerCase().includes('urgent') ? 5 : 
                        subject.toLowerCase().includes('important') ? 4 : 3;
        
        const category = from.includes('no-reply') || from.includes('noreply') ? 'Automatique' :
                        subject.toLowerCase().includes('invoice') || subject.toLowerCase().includes('facture') ? 'Finance' :
                        subject.toLowerCase().includes('support') ? 'Support' : 'Commercial';

        emails.push({
          user_id: user.id,
          gmail_id: messageData.id,
          thread_id: messageData.threadId,
          from_email: fromEmail,
          from_name: fromName,
          to_email: to,
          subject,
          body_text: bodyText,
          body_html: bodyHtml,
          snippet: messageData.snippet,
          labels: messageData.labelIds,
          priority,
          category,
          is_read: !messageData.labelIds.includes('UNREAD'),
          is_starred: messageData.labelIds.includes('STARRED'),
          received_at: new Date(parseInt(messageData.internalDate)).toISOString(),
        });
      } catch (messageError) {
        console.error(`Error processing message ${message.id}:`, messageError);
        continue;
      }
    }

    // Insert emails into database (using upsert to handle duplicates)
    if (emails.length > 0) {
      console.log(`Inserting ${emails.length} emails into database...`);
      const { error: insertError } = await supabase
        .from('emails')
        .upsert(emails, { onConflict: 'gmail_id' });

      if (insertError) {
        console.error('Error inserting emails:', insertError);
        throw insertError;
      }
    }

    console.log(`Gmail sync completed successfully. Processed ${emails.length} emails.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Synchronized ${emails.length} emails`,
        count: emails.length 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('Gmail sync error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the function logs for more information'
      }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});
