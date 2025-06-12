
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Dashboard } from '../components/Dashboard';
import { EmailProcessor } from '../components/EmailProcessor';
import { Analytics } from '../components/Analytics';
import { SettingsPanel } from '../components/SettingsPanel';
import { EmailList } from '../components/EmailList';
import { EmailViewer } from '../components/EmailViewer';
import { Button } from '../components/ui/button';
import { Mail, BarChart3, Brain, Settings } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'processor' | 'analytics' | 'settings'>('dashboard');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  const renderActiveView = () => {
    if (selectedEmailId) {
      return <EmailViewer emailId={selectedEmailId} onBack={() => setSelectedEmailId(null)} />;
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <Dashboard />
            <EmailList onEmailSelect={setSelectedEmailId} />
          </div>
        );
      case 'processor':
        return <EmailProcessor />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      <div className="min-h-screen">
        {/* Navigation Tabs */}
        <section className="px-6 py-4 bg-white/50 backdrop-blur-sm border-b border-blue-200">
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
      </div>
    </Layout>
  );
};

export default Index;
