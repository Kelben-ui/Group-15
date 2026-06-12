import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import type { UserRole } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('learner');
  const [localError, setLocalError] = useState<string | null>(null);
  const [showDemoHint, setShowDemoHint] = useState(true);
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const demoAccounts = [
    { email: 'learner@example.com', role: 'Learner' },
    { email: 'instructor@example.com', role: 'Instructor' },
    { email: 'parent@example.com', role: 'Parent' },
    { email: 'admin@example.com', role: 'Admin' },
  ];

  const resetErrors = () => {
    setLocalError(null);
    clearError();
  };

  const switchMode = (nextMode: AuthMode) => {
    resetErrors();
    setMode(nextMode);
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();
    try {
      await login(email, password);
    } catch (err) {
      // Error is handled in the store
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register({
        name: fullName,
        email,
        phone,
        role,
        password,
      });
    } catch (err) {
      // Error is handled in the store
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    resetErrors();
    try {
      await login(demoEmail, 'demo-password');
    } catch (err) {
      // Error is handled in the store
    }
  };

  const visibleError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Branding */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">LearnBridge</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'login'
              ? 'Sign in to the adaptive low-bandwidth learning platform'
              : 'Join the adaptive e-learning platform for low-resource settings'}
          </p>
        </div>

        {/* Auth Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {mode === 'login' && showDemoHint && (
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

            {visibleError && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{visibleError}</p>
              </div>
            )}

            {mode === 'login' ? (
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
                  <p className="text-xs text-muted-foreground">Use any password for demo accounts</p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="font-semibold text-secondary hover:underline"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="learner">Learner</option>
                    <option value="instructor">Instructor</option>
                    <option value="parent">Parent / Guardian</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Admin accounts are normally created by the system administrator, not through public sign up.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  <UserPlus className="w-4 h-4" />
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>

                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-secondary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Demo platform for the LearnBridge adaptive e-learning system
        </p>
      </div>
    </div>
  );
}
