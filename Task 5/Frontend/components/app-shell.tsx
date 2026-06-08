import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { LearnerDashboard } from './dashboards/learner-dashboard';
import { InstructorDashboard } from './dashboards/instructor-dashboard';
import { ParentDashboard } from './dashboards/parent-dashboard';
import { AdminDashboard } from './dashboards/admin-dashboard';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Home,
  Zap,
  Settings,
} from 'lucide-react';

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const menuItems = {
    learner: [
      { icon: Home, label: 'Dashboard', id: 'dashboard' },
      { icon: BookOpen, label: 'My Courses', id: 'courses' },
      { icon: Zap, label: 'Live Classes', id: 'live' },
      { icon: Settings, label: 'Settings', id: 'settings' },
    ],
    instructor: [
      { icon: Home, label: 'Dashboard', id: 'dashboard' },
      { icon: BookOpen, label: 'My Courses', id: 'courses' },
      { icon: Users, label: 'Students', id: 'students' },
      { icon: Settings, label: 'Settings', id: 'settings' },
    ],
    parent: [
      { icon: Home, label: 'Dashboard', id: 'dashboard' },
      { icon: Users, label: 'My Children', id: 'children' },
      { icon: BarChart3, label: 'Progress', id: 'progress' },
      { icon: Settings, label: 'Settings', id: 'settings' },
    ],
    admin: [
      { icon: Home, label: 'Dashboard', id: 'dashboard' },
      { icon: Users, label: 'Users', id: 'users' },
      { icon: BookOpen, label: 'Courses', id: 'courses' },
      { icon: BarChart3, label: 'Analytics', id: 'analytics' },
      { icon: Settings, label: 'Settings', id: 'settings' },
    ],
  };

  const getCurrentMenu = () => {
    return menuItems[user?.role as keyof typeof menuItems] || menuItems.learner;
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'learner':
        return <LearnerDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      case 'parent':
        return <ParentDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LearnerDashboard />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'learner':
        return 'bg-primary/10 text-primary';
      case 'instructor':
        return 'bg-secondary/10 text-secondary';
      case 'parent':
        return 'bg-accent/10 text-accent';
      case 'admin':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 md:w-64'
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">EduFlow</h1>
              <p className="text-xs text-sidebar-foreground/60">Learning Platform</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              alt={user?.name}
              initials={user?.name?.split(' ').map((n: string) => n[0]).join('')}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sidebar-foreground truncate">{user?.name}</p>
              <Badge
                variant="default"
                className={`text-xs mt-1 ${getRoleColor(user?.role || 'learner')}`}
              >
                {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {getCurrentMenu().map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group"
              >
                <Icon className="w-5 h-5 group-hover:text-sidebar-accent-foreground" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full flex items-center justify-start gap-2 text-destructive hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <h2 className="text-lg font-semibold text-foreground flex-1 text-center md:text-left">
            {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)} Portal
          </h2>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{user?.email}</span>
              <Badge variant="info">{user?.role}</Badge>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">{renderDashboard()}</div>
        </main>
      </div>
    </div>
  );
}
