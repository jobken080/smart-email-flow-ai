
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { TrendingUp, Mail, Clock, Zap, AlertTriangle, CheckCircle, RefreshCw, Wifi, WifiOff, Database } from 'lucide-react';
import { useEmails } from '@/hooks/useEmails';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const Dashboard: React.FC = () => {
  const { emails, isGmailConnected, syncGmail, isSyncing, refreshEmails } = useEmails();

  // Calculate real statistics from emails
  const totalEmails = emails.length;
  const unreadEmails = emails.filter(email => !email.is_read).length;
  const urgentEmails = emails.filter(email => (email.priority || 0) >= 4).length;
  const recentEmails = emails.slice(0, 5);

  // Calculate emails by category
  const emailsByCategory = emails.reduce((acc, email) => {
    const category = email.category || 'Autres';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { 
      title: 'Total des emails', 
      value: totalEmails.toString(), 
      change: 'Synchronisés', 
      icon: Mail, 
      color: 'blue' 
    },
    { 
      title: 'Non lus', 
      value: unreadEmails.toString(), 
      change: `${Math.round((unreadEmails / totalEmails) * 100) || 0}% du total`, 
      icon: Zap, 
      color: 'green' 
    },
    { 
      title: 'Urgents', 
      value: urgentEmails.toString(), 
      change: `Priorité élevée`, 
      icon: AlertTriangle, 
      color: 'red' 
    },
    { 
      title: 'Dernière sync', 
      value: recentEmails.length > 0 ? format(new Date(recentEmails[0].received_at), 'HH:mm') : 'N/A', 
      change: recentEmails.length > 0 ? format(new Date(recentEmails[0].received_at), 'dd/MM') : 'Aucun', 
      icon: Clock, 
      color: 'purple' 
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Gmail Connection Status */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isGmailConnected ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              <CardTitle className="text-lg">
                Gmail: {isGmailConnected ? 'Connecté' : 'Déconnecté'}
              </CardTitle>
              <Badge variant={isGmailConnected ? "default" : "destructive"}>
                {totalEmails} emails en base
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={refreshEmails}
                variant="outline"
                size="sm"
              >
                <Database className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              {isGmailConnected && (
                <Button
                  onClick={() => syncGmail()}
                  disabled={isSyncing}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Synchronisation...' : 'Synchroniser Gmail'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isGmailConnected ? (
            <div className="space-y-2">
              <p className="text-sm text-green-600">
                ✅ Gmail connecté avec succès. {totalEmails} emails synchronisés.
              </p>
              {Object.keys(emailsByCategory).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(emailsByCategory).map(([category, count]) => (
                    <Badge key={category} variant="outline">
                      {category}: {count}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-orange-600">
              ⚠️ Gmail non connecté. Connectez-vous avec Google pour synchroniser vos emails.
            </p>
          )}
        </CardContent>
      </Card>

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
              <p className="text-xs text-gray-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-blue-700">Emails récents</CardTitle>
                <CardDescription>Derniers emails synchronisés depuis Gmail</CardDescription>
              </div>
              <Badge variant="outline">{emails.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!isGmailConnected ? (
                <p className="text-gray-500 text-center py-4">
                  Connectez-vous avec Google pour voir vos emails Gmail.
                </p>
              ) : recentEmails.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucun email trouvé. Synchronisez votre Gmail pour voir vos emails.
                </p>
              ) : (
                recentEmails.map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${!email.is_read ? 'font-bold text-gray-900' : 'text-gray-800'}`}>
                        {email.subject || 'Sans objet'}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {email.from_name || email.from_email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(email.received_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </p>
                      {email.snippet && (
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {email.snippet.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-1 ml-4">
                      <div className="flex items-center space-x-1">
                        {email.priority && email.priority >= 4 && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                        {email.category && (
                          <Badge variant="outline" className="text-xs">
                            {email.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {email.is_starred && <CheckCircle className="h-3 w-3 text-yellow-600" />}
                        {!email.is_read && <Clock className="h-3 w-3 text-orange-600" />}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Statistiques des emails</CardTitle>
            <CardDescription>Analyse des emails synchronisés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Emails lus</span>
                <span>{Math.round(((totalEmails - unreadEmails) / totalEmails) * 100) || 0}%</span>
              </div>
              <Progress value={((totalEmails - unreadEmails) / totalEmails) * 100 || 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Emails prioritaires</span>
                <span>{Math.round((urgentEmails / totalEmails) * 100) || 0}%</span>
              </div>
              <Progress value={(urgentEmails / totalEmails) * 100 || 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Synchronisation</span>
                <span>{isGmailConnected ? '100%' : '0%'}</span>
              </div>
              <Progress value={isGmailConnected ? 100 : 0} className="h-2" />
            </div>
            {Object.keys(emailsByCategory).length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Répartition par catégorie:</p>
                {Object.entries(emailsByCategory).slice(0, 3).map(([category, count]) => (
                  <div key={category} className="flex justify-between text-xs mb-1">
                    <span>{category}</span>
                    <span>{Math.round((count / totalEmails) * 100)}%</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
