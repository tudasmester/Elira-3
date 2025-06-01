import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  BookOpen,
  Eye,
  Calendar
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  // Mock analytics data - would come from real API endpoints
  const analytics = {
    userGrowth: {
      thisMonth: 156,
      lastMonth: 142,
      change: '+9.9%'
    },
    courseEngagement: {
      totalViews: 2847,
      completionRate: 68.5,
      averageRating: 4.3
    },
    popularCourses: [
      { name: 'Webfejlesztés React-tel', views: 847, enrollments: 234 },
      { name: 'Data Science Alapok', views: 612, enrollments: 178 },
      { name: 'UI/UX Design', views: 534, enrollments: 156 }
    ],
    recentActivity: [
      { action: 'Course completed', user: 'János Kovács', course: 'React Basics', time: '2 hours ago' },
      { action: 'New enrollment', user: 'Anna Szabó', course: 'UI/UX Design', time: '4 hours ago' },
      { action: 'Course rated', user: 'Péter Nagy', course: 'Data Science', time: '6 hours ago' }
    ]
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track platform performance and user engagement
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                User Growth
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.userGrowth.thisMonth}
              </div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {analytics.userGrowth.change} from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Course Views
              </CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.courseEngagement.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Total course views
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completion Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.courseEngagement.completionRate}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Average completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Rating
              </CardTitle>
              <BookOpen className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.courseEngagement.averageRating}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Out of 5 stars
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Popular Courses
              </CardTitle>
              <CardDescription>
                Most viewed and enrolled courses this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popularCourses.map((course, index) => (
                  <div key={course.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {course.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {course.views} views • {course.enrollments} enrollments
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest user interactions and course activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.user} - {activity.course}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>
              Key insights and recommendations for platform growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-400">
                    Strong Growth
                  </span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300">
                  User enrollment is up 15% this month compared to last month
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                    High Engagement
                  </span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Course completion rates are above industry average
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-400">
                    Opportunity
                  </span>
                </div>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Consider adding more beginner-level courses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}