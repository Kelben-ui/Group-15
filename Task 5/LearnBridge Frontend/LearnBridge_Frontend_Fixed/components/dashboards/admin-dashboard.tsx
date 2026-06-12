import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Users, BookOpen, BarChart3, TrendingUp, Activity } from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, trend: '+12%' },
    { label: 'Active Courses', value: '48', icon: BookOpen, trend: '+5%' },
    { label: 'Total Enrollments', value: '5,678', icon: BarChart3, trend: '+28%' },
    { label: 'Platform Revenue', value: '$23,456', icon: TrendingUp, trend: '+18%' },
  ];

  const userBreakdown = [
    { role: 'Learners', count: 890, percentage: 72, color: 'bg-primary' },
    { role: 'Instructors', count: 234, percentage: 19, color: 'bg-secondary' },
    { role: 'Parents', count: 98, percentage: 8, color: 'bg-accent' },
    { role: 'Admins', count: 12, percentage: 1, color: 'bg-muted' },
  ];

  const recentUsers = [
    { id: 1, name: 'Emma Rodriguez', role: 'Learner', joinDate: '2 hours ago', status: 'active' },
    { id: 2, name: 'Michael Chen', role: 'Instructor', joinDate: '5 hours ago', status: 'active' },
    { id: 3, name: 'Sarah Williams', role: 'Parent', joinDate: '1 day ago', status: 'inactive' },
    { id: 4, name: 'James Wilson', role: 'Learner', joinDate: '2 days ago', status: 'active' },
  ];

  const courseMetrics = [
    { title: 'Advanced JavaScript', students: 156, revenue: '$2,340', status: '✅' },
    { title: 'Web Development', students: 234, revenue: '$4,560', status: '✅' },
    { title: 'React Mastery', students: 189, revenue: '$3,240', status: '⏳' },
    { title: 'Python Basics', students: 145, revenue: '$2,100', status: '✅' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform analytics and user management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} hover variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                    <p className="text-xs text-secondary font-semibold mt-1">{stat.trend}</p>
                  </div>
                  <Icon className="w-10 h-10 text-primary/20" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Breakdown */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userBreakdown.map((item) => (
                <div key={item.role}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{item.role}</span>
                    <span className="text-sm font-semibold text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.percentage}%</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Course Metrics */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Top Performing Courses</h3>
          {courseMetrics.map((course, idx) => (
            <Card key={idx} hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{course.title}</h4>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">{course.students} students</span>
                      <span className="text-xs font-semibold text-secondary">{course.revenue}</span>
                    </div>
                  </div>
                  <span className="text-xl">{course.status}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.joinDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="info">{user.role}</Badge>
                  <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-secondary' : 'bg-muted'}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
