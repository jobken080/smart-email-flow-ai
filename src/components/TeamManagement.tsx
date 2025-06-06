
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Users, UserPlus, Mail, Clock, Star, Settings, Shield } from 'lucide-react';

export const TeamManagement: React.FC = () => {
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const teamMembers = [
    { id: 1, name: 'Marie Dupont', email: 'marie@entreprise.com', role: 'Admin', department: 'Support', status: 'Actif', avatar: '', emailsHandled: 247, avgResponseTime: '2.1min' },
    { id: 2, name: 'Jean Martin', email: 'jean@entreprise.com', role: 'Agent', department: 'Commercial', status: 'Actif', avatar: '', emailsHandled: 189, avgResponseTime: '3.2min' },
    { id: 3, name: 'Sophie Bernard', email: 'sophie@entreprise.com', role: 'Agent', department: 'Finance', status: 'Absent', avatar: '', emailsHandled: 156, avgResponseTime: '2.8min' },
    { id: 4, name: 'Pierre Leroy', email: 'pierre@entreprise.com', role: 'Superviseur', department: 'Support', status: 'Actif', avatar: '', emailsHandled: 198, avgResponseTime: '1.9min' }
  ];

  const handleAddMember = () => {
    if (newMemberEmail.trim()) {
      console.log('Ajout du membre:', newMemberEmail);
      setNewMemberEmail('');
      // Ici, on ajouterait la logique pour ajouter un membre via API
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'destructive';
      case 'Superviseur': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Actif' ? 'default' : 'secondary';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats de l'équipe */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">4</p>
                <p className="text-sm text-gray-600">Membres actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">790</p>
                <p className="text-sm text-gray-600">Emails traités</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">2.5min</p>
                <p className="text-sm text-gray-600">Temps moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">4.8/5</p>
                <p className="text-sm text-gray-600">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ajout de membre */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <UserPlus className="h-5 w-5 mr-2" />
            Ajouter un membre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="email@entreprise.com"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="flex-1 bg-white/50"
            />
            <Button onClick={handleAddMember} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <UserPlus className="h-4 w-4 mr-2" />
              Inviter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des membres */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">Équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-800">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-sm text-gray-500">{member.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{member.emailsHandled} emails</p>
                    <p className="text-xs text-gray-500">{member.avgResponseTime} moy.</p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Badge variant={getRoleColor(member.role)}>{member.role}</Badge>
                    <Badge variant={getStatusColor(member.status)}>{member.status}</Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
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
