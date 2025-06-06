
import React from 'react';
import { Button } from './ui/button';
import { Mail, Brain, BarChart3, Settings, Users } from 'lucide-react';

interface NavigationProps {
  activeView: string;
  setActiveView: (view: 'dashboard' | 'processor' | 'analytics' | 'settings' | 'team') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-blue-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Email Assistant AI
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant={activeView === 'dashboard' ? 'default' : 'ghost'} 
            className={activeView === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'text-blue-700 hover:bg-blue-100'}
            onClick={() => setActiveView('dashboard')}
          >
            <Mail className="h-4 w-4 mr-2" />
            Emails
          </Button>
          <Button 
            variant={activeView === 'analytics' ? 'default' : 'ghost'} 
            className={activeView === 'analytics' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'text-blue-700 hover:bg-blue-100'}
            onClick={() => setActiveView('analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button 
            variant={activeView === 'team' ? 'default' : 'ghost'} 
            className={activeView === 'team' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'text-blue-700 hover:bg-blue-100'}
            onClick={() => setActiveView('team')}
          >
            <Users className="h-4 w-4 mr-2" />
            Équipe
          </Button>
          <Button 
            variant={activeView === 'settings' ? 'default' : 'ghost'} 
            className={activeView === 'settings' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'text-blue-700 hover:bg-blue-100'}
            onClick={() => setActiveView('settings')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>
    </nav>
  );
};
