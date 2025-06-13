
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
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const connectGmailMutation = useMutation({
    mutationFn: async (authCode: string) => {
      const { data, error } = await supabase.functions.invoke('gmail-auth', {
        body: { code: authCode },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Gmail connecté avec succès');
      syncGmailMutation.mutate();
    },
    onError: (error) => {
      console.error('Connect error:', error);
      toast.error('Erreur lors de la connexion à Gmail');
    },
  });

  return {
    emails,
    isLoading,
    error,
    syncGmail: syncGmailMutation.mutate,
    connectGmail: connectGmailMutation.mutate,
    isSyncing: syncGmailMutation.isPending,
    isConnecting: connectGmailMutation.isPending,
  };
};
