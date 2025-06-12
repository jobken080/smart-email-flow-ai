
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Brain, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = '/';
      }
    };
    checkSession();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Connexion en cours",
        description: "Redirection vers Google...",
      });
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter avec Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-blue-200">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-blue-700">Email Assistant AI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Connexion Gmail
          </h1>
          <p className="text-gray-600">
            Connectez-vous avec votre compte Google pour accéder à vos emails
          </p>
        </div>

        {/* Carte de connexion Google */}
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-blue-700">
              Authentification Google
            </CardTitle>
            <CardDescription className="text-center">
              Utilisez votre compte Google pour vous connecter et accéder à Gmail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center space-x-3"
              size="lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>
                {loading ? "Connexion..." : "Se connecter avec Google"}
              </span>
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                En vous connectant, vous autorisez l'application à :
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Accéder à vos emails Gmail en lecture seule</li>
                <li>• Obtenir vos informations de profil Google</li>
                <li>• Synchroniser vos emails pour l'analyse IA</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Note de configuration */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            💡 Assurez-vous que Google OAuth est configuré dans les paramètres Supabase
          </p>
        </div>
      </div>
    </div>
  );
};
