import React, { useMemo, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrandLogo } from '@/components/brand-logo';
import { navByRole, type PageId } from '@/lib/demo-data';
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
  Download,
  FileText,
  MessageCircle,
  Upload,
  CalendarCheck,
  ShieldCheck,
  Server,
} from 'lucide-react';
import {
  AdaptiveContentPage,
  ChatPage,
  CourseCatalogPage,
  DownloadsPage,
  LearnerHomePage,
  LiveClassesPage,
  ProgressPage,
  QuizCenterPage,
} from './pages/learner-pages';
import {
  AttendancePage,
  ContentManagementPage,
  InstructorHomePage,
  InstructorLiveSessionsPage,
  InstructorQuizPage,
  InstructorReportsPage,
  StudentsPage,
} from './pages/instructor-pages';
import {
  ChildrenPage,
  ParentHomePage,
  ParentProgressPage,
  ParentReportsPage,
} from './pages/parent-pages';
import {
  AdminCourseOversightPage,
  AdminHomePage,
  AdminReportsPage,
  SystemStatusPage,
  UserManagementPage,
} from './pages/admin-pages';

const iconMap: Record<PageId, React.ElementType> = {
  dashboard: Home,
  courses: BookOpen,
  'adaptive-content': Zap,
  downloads: Download,
  quizzes: FileText,
  'live-classes': Zap,
  progress: BarChart3,
  chat: MessageCircle,
  settings: Settings,
  'content-management': Upload,
  attendance: CalendarCheck,
  students: Users,
  reports: BarChart3,
  children: Users,
  users: ShieldCheck,
  'system-status': Server,
};

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const menu = useMemo(() => navByRole[user?.role || 'learner'], [user?.role]);

  const navigate = (page: string) => {
    setActivePage(page as PageId);
    setSidebarOpen(false);
  };

  const renderPage = () => {
    if (user?.role === 'learner') {
      switch (activePage) {
        case 'courses': return <CourseCatalogPage onNavigate={navigate} />;
        case 'adaptive-content': return <AdaptiveContentPage onNavigate={navigate} />;
        case 'downloads': return <DownloadsPage />;
        case 'quizzes': return <QuizCenterPage />;
        case 'live-classes': return <LiveClassesPage onNavigate={navigate} />;
        case 'progress': return <ProgressPage />;
        case 'chat': return <ChatPage />;
        default: return <LearnerHomePage onNavigate={navigate} />;
      }
    }

    if (user?.role === 'instructor') {
      switch (activePage) {
        case 'content-management': return <ContentManagementPage />;
        case 'courses': return <ContentManagementPage />;
        case 'quizzes': return <InstructorQuizPage />;
        case 'attendance': return <AttendancePage />;
        case 'live-classes': return <InstructorLiveSessionsPage />;
        case 'students': return <StudentsPage />;
        case 'reports': return <InstructorReportsPage />;
        default: return <InstructorHomePage onNavigate={navigate} />;
      }
    }

    if (user?.role === 'parent') {
      switch (activePage) {
        case 'children': return <ChildrenPage />;
        case 'progress': return <ParentProgressPage />;
        case 'reports': return <ParentReportsPage />;
        case 'chat': return <ChatPage />;
        default: return <ParentHomePage onNavigate={navigate} />;
      }
    }

    if (user?.role === 'admin') {
      switch (activePage) {
        case 'users': return <UserManagementPage />;
        case 'courses': return <AdminCourseOversightPage />;
        case 'reports': return <AdminReportsPage />;
        case 'system-status': return <SystemStatusPage />;
        default: return <AdminHomePage onNavigate={navigate} />;
      }
    }

    return <LearnerHomePage onNavigate={navigate} />;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'learner': return 'bg-primary/10 text-primary';
      case 'instructor': return 'bg-secondary/10 text-secondary';
      case 'parent': return 'bg-accent/10 text-accent';
      case 'admin': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed inset-y-0 left-0 z-30 flex w-72 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar transition-transform duration-300 md:relative`}>
        <div className="border-b border-sidebar-border p-6">
          <BrandLogo />
        </div>

        <div className="border-b border-sidebar-border p-6">
          <div className="flex items-center gap-3">
            <Avatar alt={user?.name} initials={user?.name?.split(' ').map((n: string) => n[0]).join('')} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-sidebar-foreground">{user?.name}</p>
              <Badge className={`mt-1 text-xs ${getRoleColor(user?.role || 'learner')}`}>{user?.role}</Badge>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menu.map((item) => {
            const Icon = iconMap[item.id] || Home;
            const isActive = activePage === item.id || (activePage === 'dashboard' && item.id === 'dashboard');
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/15 hover:text-sidebar-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <Button onClick={logout} variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 transition hover:bg-muted md:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} Portal` : 'Portal'}
              </h2>
              <p className="hidden text-xs text-muted-foreground sm:block">Adaptive, offline-ready, low-bandwidth learning platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="success" className="hidden sm:inline-flex">PWA Ready</Badge>
            <Badge variant="info" className="hidden sm:inline-flex">Low-data mode</Badge>
            <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 transition hover:bg-muted md:hidden"><X className="h-5 w-5" /></button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-4 md:p-8">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}
