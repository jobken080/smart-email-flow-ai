
import React from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: 'dashboard' | 'processor' | 'analytics' | 'settings' | 'team') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      <main>{children}</main>
    </div>
  );
};
