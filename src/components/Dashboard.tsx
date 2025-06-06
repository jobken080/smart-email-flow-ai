
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { TrendingUp, Mail, Clock, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Emails traités', value: '1,247', change: '+12%', icon: Mail, color: 'blue' },
    { title: 'Réponses automatiques', value: '892', change: '+8%', icon: Zap, color: 'green' },
    { title: 'Temps moyen de traitement', value: '2.3min', change: '-15%', icon: Clock, color: 'purple' },
    { title: 'Emails urgents', value: '23', change: '+3%', icon: AlertTriangle, color: 'red' }
  ];

  const recentEmails = [
    { id: 1, from: 'client@entreprise.com', subject: 'Demande de devis urgent', priority: 5, category: 'Commercial', status: 'pending' },
    { id: 2, from: 'support@software.fr', subject: 'Problème technique', priority: 4, category: 'Support', status: 'auto-replied' },
    { id: 3, from: 'marketing@agency.com', subject: 'Proposition de partenariat', priority: 2, category: 'Business', status: 'processed' },
    { id: 4, from: 'invoice@supplier.com', subject: 'Facture #2024-001', priority: 3, category: 'Finance', status: 'processed' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} vs mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Emails récents</CardTitle>
            <CardDescription>Derniers emails traités par l'IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmails.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{email.subject}</p>
                    <p className="text-sm text-gray-600">{email.from}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={email.priority >= 4 ? "destructive" : email.priority >= 3 ? "default" : "secondary"}>
                      Priorité {email.priority}
                    </Badge>
                    <Badge variant="outline">{email.category}</Badge>
                    {email.status === 'processed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {email.status === 'auto-replied' && <Zap className="h-4 w-4 text-blue-600" />}
                    {email.status === 'pending' && <Clock className="h-4 w-4 text-orange-600" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Performance IA</CardTitle>
            <CardDescription>Efficacité du traitement automatique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Classification automatique</span>
                <span>94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Réponses appropriées</span>
                <span>87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Détection d'urgence</span>
                <span>96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Satisfaction client</span>
                <span>91%</span>
              </div>
              <Progress value={91} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
