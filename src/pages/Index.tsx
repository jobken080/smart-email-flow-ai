
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Dashboard } from '../components/Dashboard';
import { EmailProcessor } from '../components/EmailProcessor';
import { Analytics } from '../components/Analytics';
import { TeamManagement } from '../components/TeamManagement';
import { SettingsPanel } from '../components/SettingsPanel';
import { EmailList } from '../components/EmailList';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Brain, Mail, BarChart3, Zap, Clock, Star, TrendingUp, Users, Settings } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'processor' | 'analytics' | 'settings' | 'team'>('dashboard');

  const features = [
    {
      icon: Brain,
      title: 'IA Intelligente',
      description: 'Classification automatique et analyse sémantique avancée',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Réponses Auto',
      description: 'Génération de réponses contextuelles en temps réel',
      color: 'green'
    },
    {
      icon: Clock,
      title: 'Gain de Temps',
      description: 'Réduction de 80% du temps de traitement des emails',
      color: 'purple'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Tableaux de bord et rapports détaillés',
      color: 'orange'
    }
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <Dashboard />
            <EmailList />
          </div>
        );
      case 'processor':
        return <EmailProcessor />;
      case 'analytics':
        return <Analytics />;
      case 'team':
        return <TeamManagement />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
          <div className="relative max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-blue-200">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Powered by AI</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Email Assistant AI
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transformez votre gestion d'emails avec l'intelligence artificielle. 
              Tri automatique, réponses intelligentes et analytics en temps réel.
            </p>
            
            <div className="flex justify-center space-x-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                onClick={() => setActiveView('processor')}
              >
                <Brain className="h-5 w-5 mr-2" />
                Essayer l'IA
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3"
                onClick={() => setActiveView('analytics')}
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Voir les Analytics
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="px-6 py-4 bg-white/50 backdrop-blur-sm border-y border-blue-200">
          <div className="max-w-7xl mx-auto flex justify-center space-x-4">
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setActiveView('dashboard')}
              className={activeView === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'text-blue-700 hover:bg-blue-100'}
            >
              <Mail className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeView === 'processor' ? 'default' : 'ghost'}
              onClick={() => setActiveView('processor')}
              className={activeView === 'processor' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'text-blue-700 hover:bg-blue-100'}
            >
              <Brain className="h-4 w-4 mr-2" />
              Traitement IA
            </Button>
            <Button
              variant={activeView === 'analytics' ? 'default' : 'ghost'}
              onClick={() => setActiveView('analytics')}
              className={activeView === 'analytics' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'text-blue-700 hover:bg-blue-100'}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant={activeView === 'team' ? 'default' : 'ghost'}
              onClick={() => setActiveView('team')}
              className={activeView === 'team' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'text-blue-700 hover:bg-blue-100'}
            >
              <Users className="h-4 w-4 mr-2" />
              Équipe
            </Button>
            <Button
              variant={activeView === 'settings' ? 'default' : 'ghost'}
              onClick={() => setActiveView('settings')}
              className={activeView === 'settings' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'text-blue-700 hover:bg-blue-100'}
            >
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </section>

        {/* Dynamic Content */}
        <section className="min-h-screen">
          {renderActiveView()}
        </section>

        {/* Stats Footer */}
        <section className="py-16 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Résultats Impressionnants</h2>
              <p className="text-blue-100 text-lg">L'IA qui révolutionne votre productivité email</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">94%</div>
                <div className="text-blue-100">Précision de classification</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">80%</div>
                <div className="text-blue-100">Réduction du temps</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">2.3min</div>
                <div className="text-blue-100">Temps moyen de traitement</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Disponibilité IA</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
