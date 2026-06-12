import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { progressSummary, quizzes } from '@/lib/demo-data';
import { AlertCircle, BarChart3, CalendarDays, MessageCircle, UserRound } from 'lucide-react';

export function ParentHomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Parent Dashboard" subtitle="Read-only monitoring of child progress, attendance, quiz results, and activity summaries." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card variant="success" className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge variant="success">James Doe</Badge>
                <h2 className="mt-3 text-3xl font-bold text-foreground">{progressSummary.overall}% overall performance</h2>
                <p className="mt-2 text-muted-foreground">Good progress this month. Biology and English are strong; Chemistry needs more attention.</p>
              </div>
              <UserRound className="h-16 w-16 text-secondary/40" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => onNavigate('progress')}><BarChart3 className="mr-2 h-4 w-4" /> View progress</Button>
            <Button className="w-full" variant="outline" onClick={() => onNavigate('reports')}><CalendarDays className="mr-2 h-4 w-4" /> Activity report</Button>
            <Button className="w-full" variant="secondary" onClick={() => onNavigate('chat')}><MessageCircle className="mr-2 h-4 w-4" /> Message instructor</Button>
          </CardContent>
        </Card>
      </div>
      <ParentProgressPage />
    </div>
  );
}

export function ChildrenPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Children" subtitle="Parent accounts can be linked to one or more learners." />
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4"><UserRound className="h-8 w-8 text-primary" /></div>
              <div>
                <h3 className="text-xl font-bold text-foreground">James Doe</h3>
                <p className="text-muted-foreground">4 active courses · Attendance {progressSummary.attendance}%</p>
              </div>
            </div>
            <Badge variant="success">Linked account</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ParentProgressPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Progress & Attendance" subtitle="Shows child academic progress without allowing parents to edit learning records." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Subject performance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {progressSummary.subjects.map((subject) => (
              <div key={subject.name}>
                <div className="mb-2 flex justify-between text-sm"><span>{subject.name}</span><span>{subject.value}%</span></div>
                <ProgressBar value={subject.value} variant="success" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Attendance and quiz results</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm"><span>Attendance this month</span><span>{progressSummary.attendance}%</span></div>
              <ProgressBar value={progressSummary.attendance} />
            </div>
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex justify-between"><span className="font-semibold">{quiz.title}</span><span>{quiz.score ?? 'Pending'}</span></div>
                <p className="text-xs text-muted-foreground">{quiz.course}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ParentReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Activity Reports" subtitle="Weekly activity summary for the child." />
      <Card>
        <CardContent className="p-6 space-y-3">
          {progressSummary.recentActivity.map((activity) => <p key={activity} className="rounded-lg bg-muted/40 p-3 text-sm">{activity}</p>)}
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm text-foreground"><AlertCircle className="mb-2 h-5 w-5 text-accent" /> Chemistry practice is recommended this week.</div>
        </CardContent>
      </Card>
    </div>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <div><h1 className="text-3xl font-bold text-foreground">{title}</h1><p className="mt-1 text-muted-foreground">{subtitle}</p></div>;
}
