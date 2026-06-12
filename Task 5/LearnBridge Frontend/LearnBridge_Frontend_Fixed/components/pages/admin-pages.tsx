import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { adminMetrics, courses, stakeholderRoles } from '@/lib/demo-data';
import { Activity, BarChart3, BookOpen, Database, Server, ShieldCheck, Users } from 'lucide-react';

export function AdminHomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const cards = [
    { label: 'Users', value: adminMetrics.users, icon: Users },
    { label: 'Instructors', value: adminMetrics.instructors, icon: ShieldCheck },
    { label: 'Active Courses', value: adminMetrics.activeCourses, icon: BookOpen },
    { label: 'Active Sessions', value: adminMetrics.activeSessions, icon: Activity },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" subtitle="Platform-wide user management, reports, and infrastructure status." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label} variant="elevated">
            <CardContent className="flex items-center justify-between p-6">
              <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold text-foreground">{value}</p></div>
              <Icon className="h-10 w-10 text-primary/30" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Platform health</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <StatusRow icon={Server} label="Server status" value={adminMetrics.serverStatus} />
            <StatusRow icon={Database} label="Database" value={adminMetrics.databaseStatus} />
            <div><div className="mb-2 flex justify-between text-sm"><span>Storage usage</span><span>{adminMetrics.storageUsage}%</span></div><ProgressBar value={adminMetrics.storageUsage} variant="warning" /></div>
            <StatusRow icon={ShieldCheck} label="Backup" value={adminMetrics.backupStatus} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Admin actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => onNavigate('users')}>Manage users</Button>
            <Button className="w-full" variant="outline" onClick={() => onNavigate('reports')}>Generate reports</Button>
            <Button className="w-full" variant="secondary" onClick={() => onNavigate('system-status')}>System status</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function UserManagementPage() {
  const rows = [
    { name: 'Maria F.', email: 'maria@example.com', role: 'learner' },
    { name: 'Dr. John Doe', email: 'john@example.com', role: 'instructor' },
    { name: 'Mr. James Parent', email: 'parent@example.com', role: 'parent' },
    { name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="User Management" subtitle="Provision accounts, reset passwords, and assign strict learner/instructor/parent/admin roles." />
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Action</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.email} className="border-t border-border"><td className="p-4 font-semibold">{row.name}</td><td className="p-4">{row.email}</td><td className="p-4"><Badge>{stakeholderRoles[row.role as keyof typeof stakeholderRoles]}</Badge></td><td className="p-4"><Button size="sm" variant="outline">Edit</Button></td></tr>)}</tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminCourseOversightPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Course Oversight" subtitle="Admin can review all courses and ensure uploaded materials meet low-data requirements." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {courses.map((course) => <Card key={course.id}><CardContent className="p-6"><h3 className="font-bold">{course.title}</h3><p className="text-sm text-muted-foreground">{course.instructor} · {course.lessons} lessons</p><div className="mt-3 flex gap-2"><Badge variant={course.offlineReady ? 'success' : 'warning'}>{course.offlineReady ? 'Offline ready' : 'Needs offline package'}</Badge><Badge>{course.quality}</Badge></div></CardContent></Card>)}
      </div>
    </div>
  );
}

export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="Attendance, engagement, performance, and system-health reports." />
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Platform report</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <ReportRow label="Attendance rate" value={88} />
          <ReportRow label="Assessment completion" value={74} />
          <ReportRow label="Offline material usage" value={82} />
          <ReportRow label="Low-bandwidth sessions" value={69} />
        </CardContent>
      </Card>
    </div>
  );
}

export function SystemStatusPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="System Status" subtitle="Infrastructure status for React PWA, Node/Express API, WebSocket service, and PostgreSQL." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatusCard title="React PWA" status="Online" detail="Service worker ready; cache active" />
        <StatusCard title="Node/Express API" status="Online" detail="REST endpoints responding" />
        <StatusCard title="WebSocket Server" status="Online" detail="Live chat channel healthy" />
        <StatusCard title="PostgreSQL Database" status="Online" detail="Secure role-based data store" />
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) { return <div><h1 className="text-3xl font-bold text-foreground">{title}</h1><p className="mt-1 text-muted-foreground">{subtitle}</p></div>; }
function StatusRow({ icon: Icon, label, value }: any) { return <div className="flex items-center justify-between rounded-lg border border-border p-3"><div className="flex items-center gap-3"><Icon className="h-5 w-5 text-primary" /><span className="font-semibold">{label}</span></div><Badge variant="success">{value}</Badge></div>; }
function StatusCard({ title, status, detail }: { title: string; status: string; detail: string }) { return <Card><CardContent className="p-6"><Badge variant="success">{status}</Badge><h3 className="mt-3 font-bold">{title}</h3><p className="text-sm text-muted-foreground">{detail}</p></CardContent></Card>; }
function ReportRow({ label, value }: { label: string; value: number }) { return <div><div className="mb-2 flex justify-between text-sm"><span>{label}</span><span>{value}%</span></div><ProgressBar value={value} variant="success" /></div>; }
