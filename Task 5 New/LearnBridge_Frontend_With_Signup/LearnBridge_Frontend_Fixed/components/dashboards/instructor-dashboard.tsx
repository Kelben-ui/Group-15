import React from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ProgressBar } from '@/components/ui/progress-bar';
import { BookOpen, Users, BarChart3, PlusCircle, Edit2, Trash2 } from 'lucide-react';

export function InstructorDashboard() {
  const user = useAuthStore((state) => state.user) as any;

  const courses = [
    {
      id: 1,
      title: 'Advanced JavaScript',
      students: 156,
      rating: 4.8,
      reviews: 89,
      earnings: '$2,340',
      status: 'published',
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      students: 234,
      rating: 4.6,
      reviews: 142,
      earnings: '$4,560',
      status: 'published',
    },
    {
      id: 3,
      title: 'React Mastery (Draft)',
      students: 0,
      rating: 0,
      reviews: 0,
      earnings: '$0',
      status: 'draft',
    },
  ];

  const stats = [
    { label: 'Total Students', value: user?.studentsCount || 390, icon: Users },
    { label: 'Courses Published', value: user?.coursesTaught?.length || 2, icon: BookOpen },
    { label: 'Average Rating', value: `${user?.rating || 4.7}/5`, icon: BarChart3 },
  ];

  const recentActivity = [
    { id: 1, type: 'submission', message: '15 students submitted Assignment 1', time: '2 hours ago' },
    { id: 2, type: 'question', message: 'New question in JavaScript Advanced Course', time: '4 hours ago' },
    { id: 3, type: 'enrollment', message: '5 new students enrolled in Web Dev Course', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Instructor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your courses and students</p>
        </div>
        <Avatar alt={user?.name} initials={user?.name?.split(' ').map((n: string) => n[0]).join('')} size="lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} hover variant="elevated">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <Icon className="w-12 h-12 text-secondary/20" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Your Courses</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm font-medium">New Course</span>
            </button>
          </div>

          {courses.map((course) => (
            <Card key={course.id} hover>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{course.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant={course.status === 'published' ? 'success' : 'warning'}>
                        {course.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{course.students} students</span>
                      <span className="text-sm font-semibold text-secondary">{course.earnings}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition">
                      <Edit2 className="w-4 h-4 text-primary" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>

                {course.students > 0 && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Student Rating</span>
                      <span className="font-semibold text-secondary">{course.rating} ⭐ ({course.reviews} reviews)</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Expertise Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(user?.expertise || ['JavaScript', 'Web Dev', 'React']).map((skill: string) => (
                  <Badge key={skill} variant="info">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
