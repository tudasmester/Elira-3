import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Book,
  GraduationCap,
  Users,
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';

interface AdminStats {
  totalCourses: number;
  totalUniversities: number;
  freeCourses: number;
  paidCourses: number;
  coursesByCategory: Record<string, number>;
  coursesByLevel: Record<string, number>;
}

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  universityId: number;
  isFree: number;
  level: string;
  category: string;
  createdAt: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    retry: false,
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/admin/courses'],
    retry: false,
  });

  const { data: universities } = useQuery({
    queryKey: ['/api/admin/universities'],
    retry: false,
  });

  if (statsLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const categoryData = stats?.coursesByCategory ? 
    Object.entries(stats.coursesByCategory).map(([name, value]) => ({ name, value })) : [];

  const levelData = stats?.coursesByLevel ?
    Object.entries(stats.coursesByLevel).map(([name, value]) => ({ name, value })) : [];

  const getUniversityName = (universityId: number) => {
    const university = universities?.find(u => u.id === universityId);
    return university?.name || 'Ismeretlen egyetem';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kezeld az Academion platform tartalmait és felhasználóit
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Áttekintés</TabsTrigger>
            <TabsTrigger value="courses">Kurzusok</TabsTrigger>
            <TabsTrigger value="universities">Egyetemek</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Összes kurzus</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.freeCourses || 0} ingyenes, {stats?.paidCourses || 0} fizetős
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Egyetemek</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUniversities || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Partner intézmények
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingyenes kurzusok</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.freeCourses || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats?.freeCourses || 0) / (stats?.totalCourses || 1) * 100).toFixed(1)}% az összesből
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fizetős kurzusok</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.paidCourses || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats?.paidCourses || 0) / (stats?.totalCourses || 1) * 100).toFixed(1)}% az összesből
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kurzusok kategóriák szerint</CardTitle>
                  <CardDescription>
                    A kurzusok eloszlása kategóriánként
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kurzusok szintek szerint</CardTitle>
                  <CardDescription>
                    A kurzusok eloszlása nehézségi szintek szerint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={levelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Kurzuskezelés</h2>
              <Link href="/admin/courses/new">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Új kurzus
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Kurzusok listája</CardTitle>
                <CardDescription>
                  Összes kurzus kezelése és szerkesztése
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses?.map((course: Course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getUniversityName(course.universityId)} • {course.category} • {course.level}
                          </p>
                          <p className="text-sm text-gray-500">
                            {course.isFree ? 'Ingyenes' : 'Fizetős'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/course/${course.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/courses/${course.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="universities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Egyetemek kezelése</h2>
              <Link href="/admin/universities/new">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Új egyetem
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Egyetemek listája</CardTitle>
                <CardDescription>
                  Partner egyetemek kezelése
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {universities?.map((university: any) => (
                    <div key={university.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={university.logoUrl} 
                          alt={university.name}
                          className="w-16 h-16 object-contain"
                        />
                        <div>
                          <h3 className="font-semibold">{university.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {university.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}