
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Zap, Plus, Edit, Trash2, Bot, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  response: string;
  isActive: boolean;
  category?: string;
}

export const AutomationPanel: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Réponse Support Standard',
      trigger: 'keywords',
      condition: 'support, aide, problème',
      response: 'Bonjour,\n\nMerci pour votre message. Notre équipe support va traiter votre demande dans les plus brefs délais.\n\nCordialement,\nÉquipe Noflay',
      isActive: true,
      category: 'Support'
    },
    {
      id: '2',
      name: 'Confirmation Commande',
      trigger: 'sender',
      condition: 'commande@',
      response: 'Votre commande a été reçue et sera traitée sous 24h. Vous recevrez un email de confirmation.',
      isActive: true,
      category: 'Commercial'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    trigger: 'keywords',
    condition: '',
    response: '',
    category: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      trigger: 'keywords',
      condition: '',
      response: '',
      category: ''
    });
    setEditingRule(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.condition || !formData.response) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newRule: AutomationRule = {
      id: editingRule?.id || Date.now().toString(),
      name: formData.name,
      trigger: formData.trigger,
      condition: formData.condition,
      response: formData.response,
      category: formData.category,
      isActive: true
    };

    if (editingRule) {
      setRules(rules.map(rule => rule.id === editingRule.id ? newRule : rule));
      toast.success('Règle modifiée avec succès');
    } else {
      setRules([...rules, newRule]);
      toast.success('Nouvelle règle créée avec succès');
    }

    resetForm();
  };

  const handleEdit = (rule: AutomationRule) => {
    setFormData({
      name: rule.name,
      trigger: rule.trigger,
      condition: rule.condition,
      response: rule.response,
      category: rule.category || ''
    });
    setEditingRule(rule);
    setShowForm(true);
  };

  const handleDelete = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    toast.success('Règle supprimée');
  };

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Automatisation</h1>
          <p className="text-gray-600">Configurez des réponses automatiques intelligentes</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle règle
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{rules.length}</p>
                <p className="text-sm text-gray-600">Règles configurées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{rules.filter(r => r.isActive).length}</p>
                <p className="text-sm text-gray-600">Règles actives</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">247</p>
                <p className="text-sm text-gray-600">Réponses automatiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire */}
      {showForm && (
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">
              {editingRule ? 'Modifier la règle' : 'Nouvelle règle d\'automatisation'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Nom de la règle *
                </label>
                <Input
                  placeholder="ex: Réponse Support"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Catégorie
                </label>
                <Input
                  placeholder="ex: Support, Commercial"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-white/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Déclencheur
                </label>
                <Select value={formData.trigger} onValueChange={(value) => setFormData({ ...formData, trigger: value })}>
                  <SelectTrigger className="bg-white/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keywords">Mots-clés dans le contenu</SelectItem>
                    <SelectItem value="sender">Expéditeur contient</SelectItem>
                    <SelectItem value="subject">Objet contient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Condition *
                </label>
                <Input
                  placeholder="ex: support, aide, problème"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="bg-white/50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Réponse automatique *
              </label>
              <Textarea
                placeholder="Rédigez votre réponse automatique..."
                rows={6}
                value={formData.response}
                onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                className="bg-white/50"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600">
                {editingRule ? 'Modifier' : 'Créer'} la règle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des règles */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">Règles configurées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-800">{rule.name}</h3>
                    {rule.category && (
                      <Badge variant="outline">{rule.category}</Badge>
                    )}
                    <Badge variant={rule.isActive ? "default" : "secondary"}>
                      {rule.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Déclencheur:</strong> {rule.trigger === 'keywords' ? 'Mots-clés' : rule.trigger === 'sender' ? 'Expéditeur' : 'Objet'} 
                    {' → '}{rule.condition}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    <strong>Réponse:</strong> {rule.response.substring(0, 100)}...
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(rule)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(rule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {rules.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune règle configurée. Créez votre première règle d'automatisation.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
