import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { courses, instructorStats, liveSessions, quizzes, studentRows } from '@/lib/demo-data';
import { BarChart3, BookOpen, FilePlus2, MessageCircle, PlusCircle, Upload, Users, Video } from 'lucide-react';

export function InstructorHomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const stats = [
    { label: 'Total Students', value: instructorStats.totalStudents, icon: Users },
    { label: 'Courses', value: instructorStats.courses, icon: BookOpen },
    { label: 'Lessons', value: instructorStats.lessons, icon: Video },
    { label: 'Quizzes', value: instructorStats.quizzes, icon: FilePlus2 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Instructor Dashboard" subtitle="Manage content, quizzes, attendance, live sessions, and learner progress." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} variant="elevated">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
              </div>
              <Icon className="h-10 w-10 text-secondary/30" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Course management</CardTitle>
            <Button onClick={() => onNavigate('content-management')}><PlusCircle className="mr-2 h-4 w-4" /> Upload material</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.lessons} modules · {course.format.join(', ')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="secondary" onClick={() => onNavigate('quizzes')}>Quiz</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <ActivityItem text="New Biology lesson uploaded" time="2 hours ago" />
            <ActivityItem text="Quiz created: Biology Quiz 2" time="5 hours ago" />
            <ActivityItem text="Live class scheduled" time="Yesterday" />
            <ActivityItem text="Assignment posted" time="Yesterday" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ContentManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Upload & Manage Materials" subtitle="Instructor uploads video, audio, text, slides, and low-data versions." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>New learning material</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Course title" placeholder="e.g. Introduction to Biology" />
            <Field label="Module title" placeholder="e.g. Cell Organelles" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectBox label="Content format" value="Video + text fallback" />
              <SelectBox label="Compression mode" value="Low-data optimized" />
            </div>
            <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center">
              <Upload className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-3 font-semibold text-foreground">Drag video, audio, PDF, or slide files here</p>
              <p className="text-sm text-muted-foreground">The real backend will store this in the content repository.</p>
            </div>
            <Button><Upload className="mr-2 h-4 w-4" /> Publish material</Button>
          </CardContent>
        </Card>
        <Card variant="warning">
          <CardHeader><CardTitle>Low-resource checklist</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>✓ Add text fallback for videos.</p>
            <p>✓ Compress large files before delivery.</p>
            <p>✓ Enable downloadable packages.</p>
            <p>✓ Keep lessons short for mobile data users.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function InstructorQuizPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create & Manage Quizzes" subtitle="Assessments feed progress tracking and can sync after offline completion." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Create quiz</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Quiz title" placeholder="e.g. Biology Quiz 3" />
            <Field label="Course" placeholder="Introduction to Biology" />
            <Field label="Question" placeholder="Which organelle produces energy?" />
            <Button><FilePlus2 className="mr-2 h-4 w-4" /> Add question</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Existing quizzes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="rounded-lg border border-border p-4">
                <div className="flex justify-between gap-3"><h3 className="font-bold">{quiz.title}</h3><Badge variant="success">{quiz.status}</Badge></div>
                <p className="text-sm text-muted-foreground">{quiz.questions} questions · {quiz.timeLimit}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function AttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Attendance Tracking" subtitle="Attendance includes live session participation and offline module completion after synchronization." />
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="p-4">Student</th><th className="p-4">Course</th><th className="p-4">Progress</th><th className="p-4">Attendance</th><th className="p-4">Last seen</th>
                </tr>
              </thead>
              <tbody>
                {studentRows.map((row) => (
                  <tr key={row.name} className="border-t border-border">
                    <td className="p-4 font-semibold">{row.name}</td><td className="p-4">{row.course}</td><td className="p-4"><ProgressBar value={row.progress} /></td><td className="p-4">{row.attendance}%</td><td className="p-4">{row.lastSeen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function StudentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Students" subtitle="Instructor sees learner progress, quiz scores, and participation data." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {studentRows.map((row) => (
          <Card key={row.name}>
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground">{row.name}</h3>
              <p className="text-sm text-muted-foreground">{row.course}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs"><span>Progress</span><span>{row.progress}%</span></div>
                <ProgressBar value={row.progress} variant="success" />
                <div className="flex justify-between text-xs"><span>Attendance</span><span>{row.attendance}%</span></div>
                <ProgressBar value={row.attendance} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function InstructorReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Instructor Reports" subtitle="Summaries of attendance, assessment results, engagement, and offline sync activity." />
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Class overview</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <ReportRow label="Average attendance" value={88} />
          <ReportRow label="Average quiz score" value={76} />
          <ReportRow label="Live session participation" value={69} />
          <ReportRow label="Offline content usage" value={82} />
        </CardContent>
      </Card>
    </div>
  );
}

export function InstructorLiveSessionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Live Sessions" subtitle="Schedule live lessons and enable text Q&A for low-bandwidth learners." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {liveSessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-6">
              <Badge variant={session.status === 'Live now' ? 'error' : 'info'}>{session.status}</Badge>
              <h3 className="mt-3 font-bold text-foreground">{session.title}</h3>
              <p className="text-sm text-muted-foreground">{session.time} · {session.mode}</p>
              <div className="mt-4 flex gap-2"><Button>Start</Button><Button variant="outline"><MessageCircle className="mr-2 h-4 w-4" /> Open Q&A</Button></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <div><h1 className="text-3xl font-bold text-foreground">{title}</h1><p className="mt-1 text-muted-foreground">{subtitle}</p></div>;
}
function ActivityItem({ text, time }: { text: string; time: string }) {
  return <div className="rounded-lg border border-border bg-muted/30 p-3"><p className="font-semibold text-sm">{text}</p><p className="text-xs text-muted-foreground">{time}</p></div>;
}
function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span><input className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder={placeholder} /></label>;
}
function SelectBox({ label, value }: { label: string; value: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span><select className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"><option>{value}</option></select></label>;
}
function ReportRow({ label, value }: { label: string; value: number }) {
  return <div><div className="mb-2 flex justify-between text-sm"><span>{label}</span><span>{value}%</span></div><ProgressBar value={value} variant="success" /></div>;
}
