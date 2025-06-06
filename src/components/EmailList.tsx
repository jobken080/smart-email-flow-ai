
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Mail, Search, Filter, Archive, Star, Clock, User, Reply, Forward, Trash2 } from 'lucide-react';

export const EmailList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const emails = [
    {
      id: 1,
      from: 'client@entreprise.com',
      fromName: 'Marie Cliente',
      subject: 'Demande de devis urgent pour nouveau projet',
      preview: 'Bonjour, nous aurions besoin d\'un devis pour...',
      time: '10:30',
      priority: 5,
      category: 'Commercial',
      status: 'new',
      hasAttachment: true,
      isStarred: false
    },
    {
      id: 2,
      from: 'support@software.fr',
      fromName: 'Support Tech',
      subject: 'Résolution du problème technique #2024-001',
      preview: 'Nous avons identifié la source du problème...',
      time: '09:45',
      priority: 3,
      category: 'Support',
      status: 'replied',
      hasAttachment: false,
      isStarred: true
    },
    {
      id: 3,
      from: 'marketing@agency.com',
      fromName: 'Agence Marketing',
      subject: 'Proposition de partenariat stratégique',
      preview: 'Nous souhaitons vous proposer un partenariat...',
      time: 'Hier',
      priority: 2,
      category: 'Business',
      status: 'processing',
      hasAttachment: true,
      isStarred: false
    },
    {
      id: 4,
      from: 'invoice@supplier.com',
      fromName: 'Comptabilité',
      subject: 'Facture #2024-001 - Échéance 30 jours',
      preview: 'Veuillez trouver ci-joint votre facture...',
      time: 'Hier',
      priority: 4,
      category: 'Finance',
      status: 'archived',
      hasAttachment: true,
      isStarred: false
    }
  ];

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'destructive';
    if (priority >= 3) return 'default';
    return 'secondary';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'default';
      case 'replied': return 'secondary';
      case 'processing': return 'outline';
      case 'archived': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'replied': return 'Répondu';
      case 'processing': return 'En cours';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.fromName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || email.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Barre de recherche et filtres */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardContent className="p-4">
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
                variant={selectedFilter === 'new' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('new')}
                size="sm"
              >
                Nouveaux
              </Button>
              <Button
                variant={selectedFilter === 'processing' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('processing')}
                size="sm"
              >
                En cours
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
          <div className="space-y-3">
            {filteredEmails.map((email) => (
              <div key={email.id} className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {email.fromName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-800 truncate">{email.subject}</h3>
                    <div className="flex items-center space-x-2">
                      {email.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      <span className="text-sm text-gray-500">{email.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{email.fromName} ({email.from})</p>
                  <p className="text-sm text-gray-500 truncate">{email.preview}</p>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex space-x-2">
                    <Badge variant={getPriorityColor(email.priority)}>
                      Priorité {email.priority}
                    </Badge>
                    <Badge variant="outline">{email.category}</Badge>
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
        </CardContent>
      </Card>
    </div>
  );
};
