import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoHint, setShowDemoHint] = useState(true);
  const { login, isLoading, error, clearError } = useAuthStore();

  const demoAccounts = [
    { email: 'learner@example.com', role: 'Learner' },
    { email: 'instructor@example.com', role: 'Instructor' },
    { email: 'parent@example.com', role: 'Parent' },
    { email: 'admin@example.com', role: 'Admin' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
    } catch (err) {
      // Error is handled in the store
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    clearError();
    try {
      await login(demoEmail, 'demo-password');
    } catch (err) {
      // Error is handled in the store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Branding */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">EduFlow</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your learning platform</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Demo Hint */}
            {showDemoHint && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 relative">
                <button
                  onClick={() => setShowDemoHint(false)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
                <p className="text-sm text-foreground font-semibold mb-2">Try Demo Accounts:</p>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => handleDemoLogin(account.email)}
                      disabled={isLoading}
                      className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition disabled:opacity-50"
                    >
                      {account.role}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Use any password for demo</p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          This is a demo platform showcasing EduFlow UI design
        </p>
      </div>
    </div>
  );
}
