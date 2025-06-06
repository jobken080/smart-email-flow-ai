
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Mail, Clock, Zap } from 'lucide-react';

export const Analytics: React.FC = () => {
  const weeklyData = [
    { day: 'Lun', emails: 45, responses: 38, avgTime: 2.1 },
    { day: 'Mar', emails: 52, responses: 47, avgTime: 1.8 },
    { day: 'Mer', emails: 38, responses: 35, avgTime: 2.3 },
    { day: 'Jeu', emails: 61, responses: 55, avgTime: 2.0 },
    { day: 'Ven', emails: 49, responses: 44, avgTime: 1.9 },
    { day: 'Sam', emails: 23, responses: 21, avgTime: 2.5 },
    { day: 'Dim', emails: 18, responses: 16, avgTime: 2.8 }
  ];

  const categoryData = [
    { name: 'Support', value: 35, color: '#3B82F6' },
    { name: 'Commercial', value: 28, color: '#10B981' },
    { name: 'Finance', value: 20, color: '#F59E0B' },
    { name: 'RH', value: 12, color: '#EF4444' },
    { name: 'Autre', value: 5, color: '#8B5CF6' }
  ];

  const responseTimeData = [
    { hour: '8h', time: 1.2 },
    { hour: '10h', time: 2.1 },
    { hour: '12h', time: 3.2 },
    { hour: '14h', time: 2.8 },
    { hour: '16h', time: 2.3 },
    { hour: '18h', time: 1.9 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Emails</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Mail className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Réponses Auto</p>
                <p className="text-2xl font-bold">892</p>
              </div>
              <Zap className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Temps Moyen</p>
                <p className="text-2xl font-bold">2.3min</p>
              </div>
              <Clock className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Efficacité</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Volume d'emails hebdomadaire</CardTitle>
            <CardDescription>Emails reçus et traités par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Bar dataKey="emails" fill="#3B82F6" name="Emails reçus" />
                <Bar dataKey="responses" fill="#10B981" name="Réponses envoyées" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Répartition par catégorie</CardTitle>
            <CardDescription>Distribution des types d'emails</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-blue-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-blue-700">Temps de réponse par heure</CardTitle>
            <CardDescription>Performance de l'IA selon l'heure de la journée</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="hour" />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                  name="Temps de réponse (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
