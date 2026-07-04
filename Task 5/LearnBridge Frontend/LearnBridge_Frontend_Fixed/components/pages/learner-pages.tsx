import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Avatar } from '@/components/ui/avatar';
import { apiRequest } from "@/src/api/api";
import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Download,
  FileText,
  MessageCircle,
  PlayCircle,
  Signal,
  Smartphone,
  Video,
  WifiOff,
  Zap,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { courses, liveSessions, modules, progressSummary, quizzes } from '@/lib/demo-data';

export function LearnerHomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/dashboard/learner");

        setDashboard(data.dashboard);
      } catch (err: any) {
        setError(err.message || "Failed to load learner dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);
  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Learner Dashboard"
          subtitle="Loading your dashboard from the backend..."
        />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Learner Dashboard"
          subtitle="Unable to load your dashboard"
        />
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card variant="success" className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge variant="success">Good connection</Badge>
                <h1 className="mt-3 text-3xl font-bold text-foreground">Continue learning from your dashboard</h1>
                <p className="mt-2 text-muted-foreground">
                  Choose courses, downloads, quizzes, progress, or live support. The learner does not start inside one fixed course.
                </p>
              </div>
              <Signal className="h-16 w-16 text-secondary/40" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" /> Low-resource mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span>Data saver</span><Badge variant="success">On</Badge></div>
            <div className="flex justify-between text-sm"><span>Offline cache</span><Badge variant="info">3 courses</Badge></div>
            <div className="flex justify-between text-sm"><span>Sync status</span><Badge variant="warning">2 pending</Badge></div>
          </CardContent>
        </Card>
      </div>

<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
  <Card>
    <CardContent className="p-5">
      <p className="text-sm text-muted-foreground">Enrolled Courses</p>
      <h3 className="mt-2 text-2xl font-bold">
        {dashboard?.totalCourses || 0}
      </h3>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-5">
      <p className="text-sm text-muted-foreground">Total Lessons</p>
      <h3 className="mt-2 text-2xl font-bold">
        {dashboard?.totalLessons || 0}
      </h3>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-5">
      <p className="text-sm text-muted-foreground">Completed Lessons</p>
      <h3 className="mt-2 text-2xl font-bold">
        {dashboard?.completedLessons || 0}
      </h3>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-5">
      <p className="text-sm text-muted-foreground">Progress</p>
      <h3 className="mt-2 text-2xl font-bold">
        {dashboard?.progressPercentage || 0}%
      </h3>
    </CardContent>
  </Card>
</div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <QuickAction icon={BookOpen} label="Browse Courses" onClick={() => onNavigate('courses')} />
        <QuickAction icon={Download} label="Downloads" onClick={() => onNavigate('downloads')} />
        <QuickAction icon={FileText} label="Quizzes" onClick={() => onNavigate('quizzes')} />
        <QuickAction icon={Video} label="Live Classes" onClick={() => onNavigate('live-classes')} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recommended learning paths</CardTitle>
            <Button size="sm" onClick={() => onNavigate('courses')}>View all</Button>
          </CardHeader>
          <CardContent className="space-y-4">
  {dashboard?.enrolledCourses?.length > 0 ? (
    dashboard.enrolledCourses.slice(0, 3).map((course: any) => (
      <Card key={course.id} hover>
        <CardContent className="p-4 space-y-2">
          <Badge variant="info">{course.category}</Badge>

          <h3 className="font-bold text-foreground">
            {course.title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {course.description}
          </p>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Level: {course.level}</span>
            <span>Lessons: {course.lessons?.length || 0}</span>
          </div>

          <Button
            className="w-full"
            onClick={() => onNavigate("adaptive-content")}
          >
            Continue Course
          </Button>
        </CardContent>
      </Card>
    ))
  ) : (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">
        You are not enrolled in any course yet.
      </p>

      <Button
        className="mt-3"
        onClick={() => onNavigate("courses")}
      >
        Browse Courses
      </Button>
    </div>
  )}
</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
           {dashboard?.recentQuizResults?.length > 0 ? (
  dashboard.recentQuizResults.map((result: any) => (
    <div
      key={result.id}
      className="rounded-lg border border-border bg-muted/30 p-3 text-sm"
    >
      <p className="font-medium">
        {result.quiz?.title || "Quiz completed"}
      </p>

      <p className="text-muted-foreground">
        Score: {result.score}/{result.totalPoints}
      </p>
    </div>
  ))
) : (
  <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
    No recent quiz activity yet.
  </div>
)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CourseCatalogPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [backendCourses, setBackendCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/courses");

        setBackendCourses(data.courses || []);
      } catch (err: any) {
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  async function enrollInCourse(courseId: string) {
    try {
      const data = await apiRequest(`/courses/${courseId}/enroll`, {
        method: "POST",
      });

      alert(data.message || "Enrollment successful");
    } catch (err: any) {
      alert(err.message || "Enrollment failed");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Browse Courses"
          subtitle="Loading courses from the backend..."
        />
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Browse Courses" subtitle="Unable to load courses" />
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse Courses"
        subtitle="A catalogue-first setup: learners select what they want to study."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {backendCourses.map((course) => (
          <Card key={course.id} hover>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="info">{course.category}</Badge>

                  <h3 className="mt-3 text-lg font-bold text-foreground">
                    {course.title}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Level</span>
                  <span>{course.level}</span>
                </div>

                <div className="flex justify-between">
                  <span>Lessons</span>
                  <span>{course._count?.lessons || course.lessons?.length || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span>Students</span>
                  <span>{course._count?.enrollments || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span>Instructor</span>
                  <span>{course.instructor?.name || "Not assigned"}</span>
                </div>

                <div className="flex justify-between">
                  <span>Price</span>
                  <span>{course.price === 0 ? "Free" : `$${course.price}`}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="w-full"
                  onClick={() => onNavigate("adaptive-content")}
                >
                  Open Course
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => enrollInCourse(course.id)}
                >
                  Enroll
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdaptiveContentPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const current = courses[0];
  return (
    <div className="space-y-6">
      <PageHeader title="Adaptive Lesson Player" subtitle="This page represents QoE content delivery: video, audio, text, and low-data fallback." />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardContent className="p-6 space-y-5">
            <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-8 text-primary-foreground">
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <PlayCircle className="h-20 w-20 opacity-90" />
                <h2 className="mt-4 text-2xl font-bold">{current.title}</h2>
                <p className="opacity-80">Chapter 3: Cells and Life</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">Quality:</span>
              <Badge variant="success">Auto</Badge>
              <Badge variant="warning">Low Data</Badge>
              <Badge variant="default">Text Only</Badge>
              <Badge variant="info">Standard</Badge>
            </div>
            <p className="text-muted-foreground">
              The system checks network/device conditions and can switch to low-resolution video, audio, slides, or text fallback when internet quality is poor.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Button onClick={() => onNavigate('downloads')}><Download className="mr-2 h-4 w-4" /> Save offline</Button>
              <Button variant="secondary" onClick={() => onNavigate('quizzes')}><FileText className="mr-2 h-4 w-4" /> Take quiz</Button>
              <Button variant="outline" onClick={() => onNavigate('chat')}><MessageCircle className="mr-2 h-4 w-4" /> Ask question</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Course modules</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {modules.map((module) => (
              <div key={module.id} className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="font-semibold text-foreground">{module.title}</p>
                <p className="text-xs text-muted-foreground">{module.duration} · {module.status}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DownloadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Offline Downloads" subtitle="Downloaded content remains available during power cuts, poor network, or no internet." />
      <Card variant="warning">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <WifiOff className="h-10 w-10 text-accent" />
            <div>
              <h3 className="font-bold text-foreground">Offline mode simulation</h3>
              <p className="text-sm text-muted-foreground">3 courses are available offline; 2 quiz submissions are waiting to sync.</p>
            </div>
          </div>
          <Button variant="secondary">Sync when connected</Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {courses.filter((c) => c.offlineReady).map((course) => (
          <Card key={course.id}>
            <CardContent className="p-6">
              <Download className="h-8 w-8 text-secondary" />
              <h3 className="mt-3 font-bold text-foreground">{course.title}</h3>
              <p className="text-sm text-muted-foreground">{course.lessons} lessons · {course.duration}</p>
              <ProgressBar className="mt-4" value={100} variant="success" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function QuizCenterPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Quiz & Assessment Center" subtitle="Learners can take online quizzes or continue cached quiz attempts offline." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} hover>
            <CardContent className="p-6 space-y-4">
              <Badge variant={quiz.status === 'Open' ? 'success' : 'warning'}>{quiz.status}</Badge>
              <h3 className="text-lg font-bold text-foreground">{quiz.title}</h3>
              <p className="text-sm text-muted-foreground">{quiz.course}</p>
              <div className="flex justify-between text-sm"><span>{quiz.questions} questions</span><span>{quiz.timeLimit}</span></div>
              {quiz.score !== null && <Badge variant="info">Previous score: {quiz.score}%</Badge>}
              <Button className="w-full">Start / Continue Quiz</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function LiveClassesPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Live Classes" subtitle="Low-bandwidth live classes with chat and Q&A support." />
      {liveSessions.map((session) => (
        <Card key={session.id}>
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge variant={session.status === 'Live now' ? 'error' : 'info'}>{session.status}</Badge>
              <h3 className="mt-3 text-lg font-bold text-foreground">{session.title}</h3>
              <p className="text-sm text-muted-foreground">{session.course} · {session.instructor}</p>
              <p className="text-sm text-muted-foreground">{session.time} · {session.mode}</p>
            </div>
            <Button onClick={() => onNavigate('chat')}>Join class / chat</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ProgressPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Progress & Attendance" subtitle="Learner and parent views depend on these progress records." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card variant="success">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Overall performance</p>
            <p className="mt-2 text-5xl font-bold text-secondary">{progressSummary.overall}%</p>
            <ProgressBar className="mt-4" value={progressSummary.overall} variant="success" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Attendance this month</p>
            <p className="mt-2 text-5xl font-bold text-primary">{progressSummary.attendance}%</p>
            <ProgressBar className="mt-4" value={progressSummary.attendance} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Offline sync</p>
            <p className="mt-2 text-5xl font-bold text-accent">2</p>
            <p className="mt-2 text-sm text-muted-foreground">pending activities</p>
          </CardContent>
        </Card>
      </div>
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
    </div>
  );
}

export function ChatPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Messages / Q&A" subtitle="Learners ask questions; instructors answer during low-bandwidth sessions." />
      <Card>
        <CardContent className="p-6 space-y-4">
          <ChatBubble name="Maria" text="Can you explain mitochondria again using text? My network is weak." />
          <ChatBubble name="Instructor" text="Yes. Mitochondria produce energy for the cell. I have also uploaded a text note for offline use." instructor />
          <div className="flex gap-2 pt-4">
            <input className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Type your question..." />
            <Button>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md">
      <Icon className="h-7 w-7 text-primary" />
      <p className="mt-3 text-sm font-semibold text-foreground">{label}</p>
    </button>
  );
}

function CourseRow({ course, onOpen }: any) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3"><BookOpen className="h-6 w-6 text-primary" /></div>
          <div>
            <h3 className="font-bold text-foreground">{course.title}</h3>
            <p className="text-sm text-muted-foreground">{course.instructor} · {course.duration}</p>
          </div>
        </div>
        <Button size="sm" onClick={onOpen}>Continue</Button>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs"><span>Progress</span><span>{course.progress}%</span></div>
        <ProgressBar value={course.progress} variant="success" />
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="mt-1 text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function ChatBubble({ name, text, instructor = false }: { name: string; text: string; instructor?: boolean }) {
  return (
    <div className={`flex gap-3 ${instructor ? 'justify-end' : ''}`}>
      {!instructor && <Avatar initials={name[0]} alt={name} />}
      <div className={`max-w-xl rounded-2xl p-4 text-sm ${instructor ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
        <p className="font-semibold">{name}</p>
        <p className="mt-1">{text}</p>
      </div>
      {instructor && <Avatar initials="I" alt="Instructor" />}
    </div>
  );
}
