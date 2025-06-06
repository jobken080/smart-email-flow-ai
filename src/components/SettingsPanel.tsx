
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Settings, Key, Bell, Mail, Shield, Palette, Globe } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(true);
  const [companyName, setCompanyName] = useState('Mon Entreprise');
  const [defaultSignature, setDefaultSignature] = useState('Cordialement,\nL\'équipe Email Assistant AI');

  return (
    <div className="p-6 space-y-6">
      {/* Paramètres généraux */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <Settings className="h-5 w-5 mr-2" />
            Paramètres Généraux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="company">Nom de l'entreprise</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-white/50 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="signature">Signature par défaut</Label>
              <Textarea
                id="signature"
                value={defaultSignature}
                onChange={(e) => setDefaultSignature(e.target.value)}
                className="bg-white/50 mt-1"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Réponses automatiques</Label>
                <p className="text-sm text-gray-500">Activer les réponses IA automatiques</p>
              </div>
              <Switch
                checked={autoReplyEnabled}
                onCheckedChange={setAutoReplyEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analyse IA</Label>
                <p className="text-sm text-gray-500">Classification et analyse intelligente</p>
              </div>
              <Switch
                checked={aiAnalysisEnabled}
                onCheckedChange={setAiAnalysisEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <p className="text-sm text-gray-500">Recevoir les alertes importantes</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration email */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <Mail className="h-5 w-5 mr-2" />
            Configuration Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Connexion Google Workspace</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pour récupérer et traiter vos emails automatiquement, connectez votre compte Google.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Globe className="h-4 w-4 mr-2" />
              Connecter Google (Nécessite Supabase)
            </Button>
          </div>
          
          <div className="space-y-3">
            <Label>Serveur IMAP (Manuel)</Label>
            <Input placeholder="imap.gmail.com" className="bg-white/50" />
            <Input placeholder="votre-email@gmail.com" className="bg-white/50" />
            <Input type="password" placeholder="Mot de passe ou token" className="bg-white/50" />
          </div>
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <Shield className="h-5 w-5 mr-2" />
            Sécurité & API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Clé API OpenAI (IA)</Label>
            <Input type="password" placeholder="sk-..." className="bg-white/50" />
            <p className="text-xs text-gray-500">Nécessaire pour les fonctionnalités IA</p>
          </div>
          
          <div className="space-y-3">
            <Label>Clé API Calendly (Réunions)</Label>
            <Input type="password" placeholder="Clé API Calendly" className="bg-white/50" />
          </div>

          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-700">
              <Key className="h-4 w-4 inline mr-2" />
              Pour une sécurité optimale, connectez Supabase pour stocker vos clés API de manière sécurisée.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          Sauvegarder les paramètres
        </Button>
        <Button variant="outline">
          Exporter la configuration
        </Button>
      </div>
    </div>
  );
};
