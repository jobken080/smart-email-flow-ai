
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Brain, Send, Star, Clock, User, Mail } from 'lucide-react';

export const EmailProcessor: React.FC = () => {
  const [emailContent, setEmailContent] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleProcessEmail = async () => {
    if (!emailContent.trim() || !senderEmail.trim()) return;
    
    setIsProcessing(true);
    console.log("Processing email:", { senderEmail, emailContent });
    
    // Simulation du traitement IA
    setTimeout(() => {
      const mockAnalysis = {
        category: Math.random() > 0.5 ? 'Support' : Math.random() > 0.3 ? 'Commercial' : 'Finance',
        priority: Math.floor(Math.random() * 5) + 1,
        sentiment: Math.random() > 0.7 ? 'Positif' : Math.random() > 0.4 ? 'Neutre' : 'Négatif',
        urgency: Math.random() > 0.8 ? 'Très urgent' : Math.random() > 0.5 ? 'Urgent' : 'Normal',
        language: 'Français',
        suggestedResponse: `Bonjour,\n\nNous avons bien reçu votre message et nous vous remercions de nous avoir contactés.\n\nNotre équipe va traiter votre demande dans les plus brefs délais. Vous recevrez une réponse détaillée sous 24h maximum.\n\nCordialement,\nL'équipe Email Assistant AI`,
        keywords: ['demande', 'urgent', 'assistance'],
        responseTime: '2.3 min'
      };
      
      setAnalysis(mockAnalysis);
      setIsProcessing(false);
    }, 2000);
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'destructive';
    if (priority >= 3) return 'default';
    return 'secondary';
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <Brain className="h-5 w-5 mr-2" />
            Traitement Email IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Email de l'expéditeur
            </label>
            <Input
              placeholder="exemple@client.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="bg-white/50"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Contenu de l'email
            </label>
            <Textarea
              placeholder="Collez le contenu de l'email à analyser..."
              rows={6}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="bg-white/50"
            />
          </div>
          
          <Button 
            onClick={handleProcessEmail}
            disabled={!emailContent.trim() || !senderEmail.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isProcessing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyser avec l'IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Analyse IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Catégorie</label>
                  <Badge variant="outline" className="block w-fit mt-1">{analysis.category}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Priorité</label>
                  <Badge variant={getPriorityColor(analysis.priority)} className="block w-fit mt-1">
                    <Star className="h-3 w-3 mr-1" />
                    {analysis.priority}/5
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Sentiment</label>
                  <Badge variant={analysis.sentiment === 'Positif' ? 'default' : analysis.sentiment === 'Négatif' ? 'destructive' : 'secondary'} className="block w-fit mt-1">
                    {analysis.sentiment}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Urgence</label>
                  <Badge variant={analysis.urgency.includes('Très') ? 'destructive' : analysis.urgency === 'Urgent' ? 'default' : 'secondary'} className="block w-fit mt-1">
                    {analysis.urgency}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium text-gray-600">Mots-clés détectés</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.keywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Temps de traitement</label>
                <p className="text-sm text-blue-600 font-medium">{analysis.responseTime}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Réponse Suggérée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Assistant IA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">À: {senderEmail}</span>
                  </div>
                </div>
                <Textarea
                  value={analysis.suggestedResponse}
                  rows={8}
                  className="bg-white/70 border-blue-200"
                  readOnly
                />
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1">
                  Modifier
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
