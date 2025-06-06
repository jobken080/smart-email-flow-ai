
import React from 'react';
import { Button } from './ui/button';
import { Mail, Brain, BarChart3, Settings, Users } from 'lucide-react';

export const Navigation: React.FC = () => {
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
          <Button variant="ghost" className="text-blue-700 hover:bg-blue-100">
            <Mail className="h-4 w-4 mr-2" />
            Emails
          </Button>
          <Button variant="ghost" className="text-blue-700 hover:bg-blue-100">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="ghost" className="text-blue-700 hover:bg-blue-100">
            <Users className="h-4 w-4 mr-2" />
            Équipe
          </Button>
          <Button variant="ghost" className="text-blue-700 hover:bg-blue-100">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>
    </nav>
  );
};
