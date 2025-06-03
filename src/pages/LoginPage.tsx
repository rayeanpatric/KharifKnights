import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useLanguage } from '@/hooks/useLanguage';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/lib/auth';

const LoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate(); // Hook for navigation
  const [mailId, setMailId] = useState('');
  const [password, setPassword] = useState(''); // Add state for password
  const [errorMessage, setErrorMessage] = useState(''); // Add state for error message

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(mailId, password)
      .then(() => {
        setErrorMessage(''); // Clear any previous error message
        navigate('/landing');
      })
      .catch((error: Error) => { // Changed 'any' to 'Error'
        console.error("Error signing in user:", error);
        setErrorMessage('Invalid credentials. Please check your Mail ID and password.');
      });
  };

  return (
    <div className="min-h-screen bg-e-dark text-white">
      <Navbar />
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md bg-e-dark-accent border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t('login.title')}</CardTitle>
            <CardDescription>{t('login.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="mailId">{t('login.mailIdLabel')}</Label>
                <Input
                  id="mailId"
                  type="text" // Or appropriate type
                  placeholder={t('login.mailIdPlaceholder')}
                  value={mailId}
                  onChange={(e) => setMailId(e.target.value)}
                  required
                  className="bg-e-dark border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('login.passwordLabel')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-e-dark border-gray-700"
                />
              </div>
              <Button type="submit" className="w-full bg-e-green hover:bg-e-green/80 text-black">
                {t('login.loginButton')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center text-sm">
            <p>{t('login.noAccount')}</p>
            <Link to="/signup" className="text-e-blue hover:underline">
              {t('login.signUpLink')}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;