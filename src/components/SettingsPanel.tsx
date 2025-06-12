
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Settings, Bot, Bell, Shield, Palette, Globe } from 'lucide-react';
import { AutomationPanel } from './AutomationPanel';

export const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState({
    autoReply: true,
    notifications: true,
    aiClassification: true,
    saveResponses: true,
    language: 'fr',
    theme: 'light'
  });

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Paramètres Noflay</h1>
        <p className="text-gray-600">Configurez votre assistant email intelligent</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Bot className="h-4 w-4 mr-2" />
            Automatisation
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Classification IA automatique</h3>
                  <p className="text-sm text-gray-600">Classifier automatiquement les emails entrants</p>
                </div>
                <Switch 
                  checked={settings.aiClassification}
                  onCheckedChange={(checked) => updateSetting('aiClassification', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sauvegarder les réponses</h3>
                  <p className="text-sm text-gray-600">Conserver un historique des réponses envoyées</p>
                </div>
                <Switch 
                  checked={settings.saveResponses}
                  onCheckedChange={(checked) => updateSetting('saveResponses', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Langue de l'interface
                </label>
                <select 
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white/50"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <AutomationPanel />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications push</h3>
                  <p className="text-sm text-gray-600">Recevoir des notifications pour les nouveaux emails</p>
                </div>
                <Switch 
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSetting('notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Emails urgents uniquement</h3>
                  <p className="text-sm text-gray-600">Ne notifier que pour les emails prioritaires</p>
                </div>
                <Switch defaultChecked={false} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email de notification
                </label>
                <Input 
                  type="email" 
                  placeholder="votre@email.com"
                  className="bg-white/50"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Sécurité et confidentialité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Chiffrement des données</h3>
                  <p className="text-sm text-gray-600">Chiffrer toutes les données stockées</p>
                </div>
                <Switch defaultChecked={true} disabled />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Authentification à deux facteurs</h3>
                  <p className="text-sm text-gray-600">Sécuriser votre compte avec 2FA</p>
                </div>
                <Switch defaultChecked={false} />
              </div>

              <div>
                <Button variant="outline" className="w-full">
                  Révoquer les accès Gmail
                </Button>
              </div>
              
              <div>
                <Button variant="destructive" className="w-full">
                  Supprimer toutes les données
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
