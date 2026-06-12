import React from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ProgressBar } from '@/components/ui/progress-bar';
import { BookOpen, TrendingUp, Award, AlertCircle } from 'lucide-react';

export function ParentDashboard() {
  const user = useAuthStore((state) => state.user) as any;

  const children = [
    {
      id: 1,
      name: 'Alex Johnson',
      avatar: '👨‍🎓',
      courses: 3,
      overallProgress: 65,
      enrolledCourses: [
        {
          title: 'Advanced JavaScript',
          progress: 65,
          status: 'ongoing',
        },
        {
          title: 'Web Development Fundamentals',
          progress: 45,
          status: 'ongoing',
        },
        {
          title: 'React Mastery',
          progress: 80,
          status: 'ongoing',
        },
      ],
      recentActivity: [
        'Completed JavaScript Lesson 8',
        'Scored 92% on Web Dev Quiz',
        'Attended Live Class - Web Dev',
      ],
      alerts: ['Low attendance in Math course', 'Quiz deadline approaching'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Parent Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor your child&apos;s learning progress</p>
      </div>

      {/* Children Progress */}
      {children.map((child) => (
        <div key={child.id} className="space-y-4">
          {/* Child Header */}
          <div className="flex items-center gap-4">
            <Avatar alt={child.name} initials={child.name?.split(' ').map((n: string) => n[0]).join('')} size="lg" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{child.name}</h2>
              <p className="text-muted-foreground">{child.courses} active courses</p>
            </div>
          </div>

          {/* Overall Progress */}
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Overall Progress</h3>
                <span className="text-2xl font-bold text-secondary">{child.overallProgress}%</span>
              </div>
              <ProgressBar value={child.overallProgress} variant="success" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enrolled Courses */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-foreground">Active Courses</h3>
              {child.enrolledCourses.map((course, idx) => (
                <Card key={idx} hover>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{course.title}</h4>
                      <Badge variant="info">{course.progress}%</Badge>
                    </div>
                    <ProgressBar value={course.progress} />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {child.recentActivity.map((activity, idx) => (
                    <div key={idx} className="p-2 rounded bg-muted/50 border border-border">
                      <p className="text-sm text-foreground">{activity}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Alerts & Notices */}
              {child.alerts.length > 0 && (
                <Card variant="warning">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-accent" />
                      Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {child.alerts.map((alert, idx) => (
                      <div key={idx} className="text-sm text-foreground">
                        • {alert}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
