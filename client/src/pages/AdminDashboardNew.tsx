import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Building2, 
  TrendingUp,
  DollarSign,
  Eye,
  Calendar
} from 'lucide-react';

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

  const statCards = [
    {
      title: 'Total Courses',
      value: stats?.totalCourses || 0,
      description: 'Active courses in the system',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Universities',
      value: stats?.totalUniversities || 0,
      description: 'Partner universities',
      icon: Building2,
      color: 'text-green-600',
    },
    {
      title: 'Free Courses',
      value: stats?.freeCourses || 0,
      description: 'Available at no cost',
      icon: Eye,
      color: 'text-purple-600',
    },
    {
      title: 'Paid Courses',
      value: stats?.paidCourses || 0,
      description: 'Premium content',
      icon: DollarSign,
      color: 'text-orange-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Courses by Category
              </CardTitle>
              <CardDescription>
                Distribution of courses across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.coursesByCategory && Object.entries(stats.coursesByCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category}
                    </span>
                    <Badge variant="secondary" className="ml-2">
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Courses by Level
              </CardTitle>
              <CardDescription>
                Distribution of courses by difficulty level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.coursesByLevel && Object.entries(stats.coursesByLevel).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {level}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and changes in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New course "Webfejlesztés React-tel" was published
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    University "BME" added to the platform
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    1 day ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    System performance optimizations deployed
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    3 days ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}