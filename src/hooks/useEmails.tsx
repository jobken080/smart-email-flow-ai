
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
      if (!user || !session) return;

      try {
        // Check if user has Gmail tokens
        const { data: tokenData } = await supabase
          .from('user_gmail_tokens')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (tokenData) {
          setIsGmailConnected(true);
          // Auto-sync emails if connected
          syncGmailMutation.mutate();
        } else if (session.provider_token) {
          // User logged in with Google, store tokens and sync
          await storeGoogleTokens();
        }
      } catch (error) {
        console.error('Error checking Gmail connection:', error);
      }
    };

    checkGmailConnection();
  }, [user, session]);

  const storeGoogleTokens = async () => {
    if (!user || !session?.provider_token) return;

    try {
      // Get user's email from Google
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
        },
      });

      const profile = await profileResponse.json();

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

      if (error) throw error;

      setIsGmailConnected(true);
      toast.success('Gmail connecté avec succès');
      syncGmailMutation.mutate();
    } catch (error) {
      console.error('Error storing Google tokens:', error);
      toast.error('Erreur lors de la connexion Gmail');
    }
  };

  const { data: emails = [], isLoading, error } = useQuery({
    queryKey: ['emails', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('user_id', user.id)
        .order('received_at', { ascending: false });

      if (error) throw error;
      return data as Email[];
    },
    enabled: !!user,
  });

  const syncGmailMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-gmail', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.success(`${data.count} emails synchronisés avec succès`);
    },
    onError: (error) => {
      console.error('Sync error:', error);
      toast.error('Erreur lors de la synchronisation des emails');
    },
  });

  return {
    emails,
    isLoading,
    error,
    isGmailConnected,
    syncGmail: syncGmailMutation.mutate,
    isSyncing: syncGmailMutation.isPending,
  };
};
