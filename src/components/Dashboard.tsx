
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { TrendingUp, Mail, Clock, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEmails } from '@/hooks/useEmails';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const Dashboard: React.FC = () => {
  const { emails } = useEmails();

  // Calculate real statistics from emails
  const totalEmails = emails.length;
  const unreadEmails = emails.filter(email => !email.is_read).length;
  const urgentEmails = emails.filter(email => (email.priority || 0) >= 4).length;
  const recentEmails = emails.slice(0, 4);

  const stats = [
    { 
      title: 'Emails reçus', 
      value: totalEmails.toString(), 
      change: '+12%', 
      icon: Mail, 
      color: 'blue' 
    },
    { 
      title: 'Non lus', 
      value: unreadEmails.toString(), 
      change: `${unreadEmails > 0 ? '+' : ''}${unreadEmails}`, 
      icon: Zap, 
      color: 'green' 
    },
    { 
      title: 'Temps moyen de réponse', 
      value: '2.3min', 
      change: '-15%', 
      icon: Clock, 
      color: 'purple' 
    },
    { 
      title: 'Emails urgents', 
      value: urgentEmails.toString(), 
      change: `${urgentEmails > 0 ? '+' : ''}${urgentEmails}`, 
      icon: AlertTriangle, 
      color: 'red' 
    }
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
            <CardDescription>Derniers emails reçus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmails.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucun email trouvé. Synchronisez votre Gmail pour voir vos emails.
                </p>
              ) : (
                recentEmails.map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex-1">
                      <p className={`font-medium ${!email.is_read ? 'font-bold text-gray-900' : 'text-gray-800'}`}>
                        {email.subject}
                      </p>
                      <p className="text-sm text-gray-600">
                        {email.from_name || email.from_email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(email.received_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {email.priority && email.priority >= 3 && (
                        <Badge variant={email.priority >= 4 ? "destructive" : "default"}>
                          Priorité {email.priority}
                        </Badge>
                      )}
                      {email.category && (
                        <Badge variant="outline">{email.category}</Badge>
                      )}
                      {email.status === 'replied' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {!email.is_read && <Clock className="h-4 w-4 text-orange-600" />}
                    </div>
                  </div>
                ))
              )}
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
