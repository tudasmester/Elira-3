import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  Building2, 
  TrendingUp,
  DollarSign,
  Eye,
  Calendar,
  Plus,
  Settings,
  BarChart3,
  Activity,
  UserPlus
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminStats {
  totalCourses: number;
  totalUniversities: number;
  freeCourses: number;
  paidCourses: number;
  coursesByCategory: Record<string, number>;
  coursesByLevel: Record<string, number>;
}

export default function AdminDashboardNew() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
  });

  const { data: courses } = useQuery({
    queryKey: ['/api/admin/courses'],
  });

  const { data: universities } = useQuery({
    queryKey: ['/api/admin/universities'],
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  // Chart data for revenue and user growth
  const monthlyData = [
    { month: 'Jan', users: 65, revenue: 42000, enrollments: 120 },
    { month: 'Feb', users: 85, revenue: 58000, enrollments: 165 },
    { month: 'Mar', users: 120, revenue: 78000, enrollments: 235 },
    { month: 'Apr', users: 145, revenue: 95000, enrollments: 310 },
    { month: 'May', users: 175, revenue: 118000, enrollments: 385 },
    { month: 'Jun', users: 200, revenue: 145000, enrollments: 450 },
  ];

  const enrollmentData = [
    { name: 'Programozás', value: 145, color: '#3B82F6' },
    { name: 'Design', value: 85, color: '#10B981' },
    { name: 'Marketing', value: 65, color: '#F59E0B' },
    { name: 'Üzleti ismeretek', value: 45, color: '#EF4444' },
    { name: 'Egyéb', value: 30, color: '#8B5CF6' },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'enrollment',
      user: 'Kovács János',
      action: 'enrolled in',
      target: 'Webfejlesztés React-tel',
      time: '2 hours ago',
      avatar: 'KJ'
    },
    {
      id: 2,
      type: 'completion',
      user: 'Nagy Anna',
      action: 'completed',
      target: 'JavaScript Alapok',
      time: '4 hours ago',
      avatar: 'NA'
    },
    {
      id: 3,
      type: 'course',
      user: 'System',
      action: 'published new course',
      target: 'Vue.js Fejlesztés',
      time: '6 hours ago',
      avatar: 'SY'
    },
    {
      id: 4,
      type: 'user',
      user: 'Szabó Péter',
      action: 'joined the platform',
      target: '',
      time: '8 hours ago',
      avatar: 'SP'
    },
    {
      id: 5,
      type: 'revenue',
      user: 'Takács Mária',
      action: 'purchased premium plan',
      target: 'Pro Package',
      time: '1 day ago',
      avatar: 'TM'
    }
  ];

  const statCards = [
    {
      title: 'Total Users',
      value: 1247,
      change: '+12.5%',
      changeType: 'increase',
      description: 'Active platform users',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Courses',
      value: stats?.totalCourses || 0,
      change: '+8.2%',
      changeType: 'increase',
      description: 'Published courses',
      icon: BookOpen,
      color: 'text-green-600',
    },
    {
      title: 'Total Enrollments',
      value: 2847,
      change: '+15.3%',
      changeType: 'increase',
      description: 'Course enrollments',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Revenue',
      value: '₹145,000',
      change: '+23.1%',
      changeType: 'increase',
      description: 'Monthly revenue',
      icon: DollarSign,
      color: 'text-orange-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your platform performance and key metrics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              Last 30 days
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <span className={stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Revenue Growth
              </CardTitle>
              <CardDescription>Monthly revenue trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                User Growth
              </CardTitle>
              <CardDescription>New user registrations and total enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3B82F6" name="New Users" />
                  <Bar dataKey="enrollments" fill="#10B981" name="Enrollments" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Enrollment Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Course Categories
              </CardTitle>
              <CardDescription>Enrollment distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={enrollmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {enrollmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest platform activities and user interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-muted-foreground"> {activity.action} </span>
                        {activity.target && (
                          <span className="font-medium">{activity.target}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        activity.type === 'enrollment' ? 'border-blue-200 text-blue-700' :
                        activity.type === 'completion' ? 'border-green-200 text-green-700' :
                        activity.type === 'course' ? 'border-purple-200 text-purple-700' :
                        activity.type === 'revenue' ? 'border-orange-200 text-orange-700' :
                        'border-gray-200 text-gray-700'
                      }
                    >
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Frequently used admin actions and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              <Button className="justify-start gap-2 h-auto p-4" variant="outline">
                <Plus className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Add Course</div>
                  <div className="text-xs text-muted-foreground">Create new course</div>
                </div>
              </Button>
              <Button className="justify-start gap-2 h-auto p-4" variant="outline">
                <UserPlus className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Add University</div>
                  <div className="text-xs text-muted-foreground">Partner institution</div>
                </div>
              </Button>
              <Button className="justify-start gap-2 h-auto p-4" variant="outline">
                <BarChart3 className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">View Analytics</div>
                  <div className="text-xs text-muted-foreground">Detailed reports</div>
                </div>
              </Button>
              <Button className="justify-start gap-2 h-auto p-4" variant="outline">
                <Settings className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Sync Content</div>
                  <div className="text-xs text-muted-foreground">Update course data</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}