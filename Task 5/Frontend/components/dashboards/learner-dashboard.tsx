import React from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ProgressBar } from '@/components/ui/progress-bar';
import { BookOpen, Clock, Award, TrendingUp, FileText, Video, Zap } from 'lucide-react';

export function LearnerDashboard() {
  const user = useAuthStore((state) => state.user) as any;

  const courses = [
    {
      id: 1,
      title: 'Advanced JavaScript',
      progress: 65,
      lessons: 12,
      completed: 8,
      instructor: 'Sarah Williams',
      image: '📘',
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      progress: 45,
      lessons: 15,
      completed: 7,
      instructor: 'John Smith',
      image: '🌐',
    },
    {
      id: 3,
      title: 'React Mastery',
      progress: 80,
      lessons: 20,
      completed: 16,
      instructor: 'Sarah Williams',
      image: '⚛️',
    },
  ];

  const stats = [
    { label: 'Learning Hours', value: user?.learningHours || 24, icon: Clock },
    { label: 'Courses Enrolled', value: user?.enrolledCourses?.length || 3, icon: BookOpen },
    { label: 'Badges Earned', value: user?.badges?.length || 2, icon: Award },
    { label: 'Overall Progress', value: `${user?.totalProgress || 65}%`, icon: TrendingUp },
  ];

  const liveClasses = [
    {
      id: 1,
      title: 'JavaScript Advanced Patterns',
      instructor: 'Sarah Williams',
      startTime: '2:00 PM',
      duration: '60 min',
      status: 'live',
    },
    {
      id: 2,
      title: 'Web Development Q&A',
      instructor: 'John Smith',
      startTime: '3:30 PM',
      duration: '45 min',
      status: 'upcoming',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Keep learning and growing every day</p>
        </div>
        <Avatar alt={user?.name} initials={user?.name?.split(' ').map((n: string) => n[0]).join('')} size="lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} hover variant="elevated">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <Icon className="w-12 h-12 text-primary/20" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Your Courses</h2>
            <Badge variant="info">Active</Badge>
          </div>

          {courses.map((course) => (
            <Card key={course.id} hover className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex gap-4 p-6">
                  <div className="text-4xl">{course.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-primary">{course.progress}%</span>
                      </div>
                      <ProgressBar value={course.progress} variant="success" />
                      <p className="text-xs text-muted-foreground">
                        {course.completed} of {course.lessons} lessons completed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Live Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Live Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {liveClasses.map((cls) => (
                <div key={cls.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="font-semibold text-sm text-foreground">{cls.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cls.instructor}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{cls.startTime}</span>
                    <Badge variant={cls.status === 'live' ? 'error' : 'default'}>
                      {cls.status === 'live' ? '🔴 Live' : 'Upcoming'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Study Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 rounded bg-primary/5 border border-primary/20 cursor-pointer hover:bg-primary/10 transition">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Study Notes</span>
                </div>
              </div>
              <div className="p-2 rounded bg-secondary/5 border border-secondary/20 cursor-pointer hover:bg-secondary/10 transition">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-foreground">Recordings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
