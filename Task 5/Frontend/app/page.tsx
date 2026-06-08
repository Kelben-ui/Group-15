'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { AppShell } from '@/components/app-shell';
import { LoginPage } from '@/components/auth/login-page';

export default function Page() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <AppShell /> : <LoginPage />;
}
