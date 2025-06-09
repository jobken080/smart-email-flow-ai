
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Mail, Search, Filter, Archive, Star, Clock, User, Reply, Forward, Trash2, RefreshCw, Link } from 'lucide-react';
import { useEmails } from '@/hooks/useEmails';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const EmailList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { emails, isLoading, syncGmail, isSyncing } = useEmails();

  const getPriorityColor = (priority: number | null) => {
    if (!priority) return 'secondary';
    if (priority >= 4) return 'destructive';
    if (priority >= 3) return 'default';
    return 'secondary';
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'new': return 'default';
      case 'replied': return 'secondary';
      case 'processing': return 'outline';
      case 'archived': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'replied': return 'Répondu';
      case 'processing': return 'En cours';
      case 'archived': return 'Archivé';
      default: return 'Nouveau';
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (email.from_name || email.from_email).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !email.is_read) ||
                         (selectedFilter === 'starred' && email.is_starred) ||
                         email.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return format(date, 'HH:mm');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return format(date, 'dd/MM', { locale: fr });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Barre d'actions */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => syncGmail()}
                disabled={isSyncing}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Synchronisation...' : 'Synchroniser Gmail'}
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Rechercher dans les emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('all')}
                size="sm"
              >
                Tous
              </Button>
              <Button
                variant={selectedFilter === 'unread' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('unread')}
                size="sm"
              >
                Non lus
              </Button>
              <Button
                variant={selectedFilter === 'starred' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('starred')}
                size="sm"
              >
                Favoris
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des emails */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <Mail className="h-5 w-5 mr-2" />
            Emails ({filteredEmails.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmails.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {emails.length === 0 
                  ? 'Aucun email trouvé. Synchronisez votre Gmail pour commencer.'
                  : 'Aucun email ne correspond à vos critères de recherche.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEmails.map((email) => (
                <div key={email.id} className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {(email.from_name || email.from_email).split(' ').map(n => n[0]?.toUpperCase()).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium truncate ${!email.is_read ? 'text-gray-900 font-bold' : 'text-gray-800'}`}>
                        {email.subject}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {email.is_starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        <span className="text-sm text-gray-500">{formatTime(email.received_at)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {email.from_name ? `${email.from_name} (${email.from_email})` : email.from_email}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{email.snippet}</p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-2">
                      {email.priority && (
                        <Badge variant={getPriorityColor(email.priority)}>
                          Priorité {email.priority}
                        </Badge>
                      )}
                      {email.category && (
                        <Badge variant="outline">{email.category}</Badge>
                      )}
                    </div>
                    <Badge variant={getStatusColor(email.status)}>
                      {getStatusText(email.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <Button variant="ghost" size="sm">
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
