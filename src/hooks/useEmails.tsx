
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Email {
  id: string;
  gmail_id: string;
  thread_id: string | null;
  from_email: string;
  from_name: string | null;
  to_email: string;
  subject: string;
  body_text: string | null;
  body_html: string | null;
  snippet: string | null;
  is_read: boolean | null;
  is_starred: boolean | null;
  labels: string[] | null;
  priority: number | null;
  category: string | null;
  status: string | null;
  received_at: string;
  created_at: string;
  updated_at: string;
}

export const useEmails = () => {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();
  const [isGmailConnected, setIsGmailConnected] = useState(false);

  // Check if Gmail is connected and auto-sync
  useEffect(() => {
    const checkGmailConnection = async () => {
      if (!user || !session) {
        console.log('No user or session, skipping Gmail check');
        return;
      }

      try {
        console.log('Checking Gmail connection for user:', user.id);
        console.log('Session provider:', session.provider);
        console.log('Session provider_token exists:', !!session.provider_token);
        
        // Check if user has Gmail tokens
        const { data: tokenData, error } = await supabase
          .from('user_gmail_tokens')
          .select('*')
          .eq('user_id', user.id)
          .single();

        console.log('Token data:', tokenData, 'Error:', error);

        if (tokenData && !error) {
          console.log('Gmail tokens found, setting connected to true');
          setIsGmailConnected(true);
        } else if (session.provider === 'google' && session.provider_token) {
          console.log('Google session detected, storing tokens...');
          await storeGoogleTokens();
        } else {
          console.log('No Gmail connection found');
          setIsGmailConnected(false);
        }
      } catch (error) {
        console.error('Error checking Gmail connection:', error);
        setIsGmailConnected(false);
      }
    };

    checkGmailConnection();
  }, [user, session]);

  const storeGoogleTokens = async () => {
    if (!user || !session?.provider_token) {
      console.log('Missing user or provider token');
      return;
    }

    try {
      console.log('Storing Google tokens for user:', user.id);
      
      // Get user's email from Google
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to get user profile from Google');
      }

      const profile = await profileResponse.json();
      console.log('Google profile email:', profile.email);

      // Store tokens in database
      const { error } = await supabase
        .from('user_gmail_tokens')
        .upsert({
          user_id: user.id,
          access_token: session.provider_token,
          refresh_token: session.provider_refresh_token || '',
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
          email_address: profile.email,
        });

      if (error) {
        console.error('Error storing tokens:', error);
        throw error;
      }

      console.log('Tokens stored successfully');
      setIsGmailConnected(true);
      toast.success('Gmail connecté avec succès');
      
      // Trigger email sync after a short delay
      setTimeout(() => {
        console.log('Triggering email sync after storing tokens...');
        syncGmailMutation.mutate();
      }, 1000);
    } catch (error) {
      console.error('Error storing Google tokens:', error);
      toast.error('Erreur lors de la connexion Gmail');
    }
  };

  const { data: emails = [], isLoading, error, refetch } = useQuery({
    queryKey: ['emails', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user, returning empty array');
        return [];
      }
      
      console.log('Fetching emails for user:', user.id);
      
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('user_id', user.id)
        .order('received_at', { ascending: false });

      if (error) {
        console.error('Error fetching emails:', error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} emails from database`);
      return data as Email[];
    },
    enabled: !!user,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const syncGmailMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting Gmail sync...');
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if we have stored tokens first
      const { data: tokenData, error: tokenError } = await supabase
        .from('user_gmail_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (tokenError || !tokenData) {
        console.error('No Gmail tokens found:', tokenError);
        throw new Error('Gmail not connected. Please reconnect your Google account.');
      }

      const session = await supabase.auth.getSession();
      if (!session.data.session?.access_token) {
        throw new Error('No access token available');
      }

      console.log('Calling sync-gmail function...');
      const { data, error } = await supabase.functions.invoke('sync-gmail', {
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
      });

      if (error) {
        console.error('Sync function error:', error);
        throw error;
      }
      
      console.log('Sync function response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Sync successful:', data);
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      refetch();
      toast.success(`${data?.count || 0} emails synchronisés avec succès`);
    },
    onError: (error) => {
      console.error('Sync error:', error);
      toast.error('Erreur lors de la synchronisation des emails');
    },
  });

  const refreshEmails = () => {
    console.log('Manual email refresh triggered');
    queryClient.invalidateQueries({ queryKey: ['emails'] });
    refetch();
  };

  return {
    emails,
    isLoading,
    error,
    isGmailConnected,
    syncGmail: syncGmailMutation.mutate,
    isSyncing: syncGmailMutation.isPending,
    refreshEmails,
  };
};
