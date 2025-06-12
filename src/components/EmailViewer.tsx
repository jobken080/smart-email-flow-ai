
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Reply, Forward, Archive, Trash2, Star, Send, Sparkles } from 'lucide-react';
import { useEmails, Email } from '@/hooks/useEmails';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface EmailViewerProps {
  emailId: string;
  onBack: () => void;
}

export const EmailViewer: React.FC<EmailViewerProps> = ({ emailId, onBack }) => {
  const { emails } = useEmails();
  const [replyText, setReplyText] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  
  const email = emails.find(e => e.id === emailId);

  if (!email) {
    return (
      <div className="p-6">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <p>Email non trouvé</p>
      </div>
    );
  }

  const generateReply = async () => {
    setIsGeneratingReply(true);
    // Simulation de génération IA
    setTimeout(() => {
      const replies = [
        `Bonjour ${email.from_name || email.from_email.split('@')[0]},\n\nMerci pour votre message. Nous avons bien reçu votre demande et nous vous recontacterons dans les plus brefs délais.\n\nCordialement,\nL'équipe Noflay`,
        `Bonjour,\n\nNous accusons réception de votre email. Votre demande est importante pour nous et sera traitée en priorité.\n\nNous restons à votre disposition.\n\nCordialement,\nService Client Noflay`,
        `Cher/Chère ${email.from_name || email.from_email.split('@')[0]},\n\nNous vous remercions de nous avoir contactés. Nous étudions attentivement votre demande et vous donnerons une réponse complète sous 24h.\n\nBien à vous,\nÉquipe Noflay`
      ];
      setReplyText(replies[Math.floor(Math.random() * replies.length)]);
      setIsGeneratingReply(false);
      toast.success('Réponse générée avec succès');
    }, 2000);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      toast.success('Réponse envoyée avec succès');
      setReplyText('');
      onBack();
    }
  };

  const handleArchive = () => {
    toast.success('Email archivé');
    onBack();
  };

  const handleDelete = () => {
    toast.success('Email supprimé');
    onBack();
  };

  const handleForward = () => {
    toast.success('Email transféré');
  };

  const getPriorityColor = (priority: number | null) => {
    if (!priority) return 'secondary';
    if (priority >= 4) return 'destructive';
    if (priority >= 3) return 'default';
    return 'secondary';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux emails
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleArchive}>
            <Archive className="h-4 w-4 mr-2" />
            Archiver
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Favoris
          </Button>
        </div>
      </div>

      {/* Email Content */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl text-blue-700 mb-2">{email.subject}</CardTitle>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>De:</strong> {email.from_name ? `${email.from_name} (${email.from_email})` : email.from_email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>À:</strong> {email.to_email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {format(new Date(email.received_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              {email.priority && (
                <Badge variant={getPriorityColor(email.priority)}>
                  Priorité {email.priority}
                </Badge>
              )}
              {email.category && (
                <Badge variant="outline">{email.category}</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {email.body_html ? (
              <div dangerouslySetInnerHTML={{ __html: email.body_html }} />
            ) : (
              <div className="whitespace-pre-wrap">{email.body_text || email.snippet}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reply Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <Reply className="h-5 w-5 mr-2" />
            Répondre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button
              onClick={generateReply}
              disabled={isGeneratingReply}
              variant="outline"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
            >
              <Sparkles className={`h-4 w-4 mr-2 ${isGeneratingReply ? 'animate-spin' : ''}`} />
              {isGeneratingReply ? 'Génération...' : 'Générer réponse IA'}
            </Button>
            <Button variant="outline" onClick={handleForward}>
              <Forward className="h-4 w-4 mr-2" />
              Transférer
            </Button>
          </div>
          
          <Textarea
            placeholder="Écrivez votre réponse..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={8}
            className="bg-white/50"
          />
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setReplyText('')}>
              Annuler
            </Button>
            <Button 
              onClick={handleReply}
              disabled={!replyText.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
