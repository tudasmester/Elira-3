import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminContentSync from './AdminContentSync';
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
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { AdminGuard } from '@/components/AdminGuard';
import { useAdminRealTimeData, triggerDataRefresh } from '@/hooks/useRealTimeData';

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
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; courseId: number | null; courseName: string }>({ isOpen: false, courseId: null, courseName: '' });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Enable real-time updates for admin panel
  useAdminRealTimeData();

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

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate admin queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      
      // Trigger immediate refresh of user-facing data
      triggerDataRefresh(queryClient);
      
      toast({
        title: "Course deleted",
        description: "The course has been successfully deleted.",
      });
      setDeleteDialog({ isOpen: false, courseId: null, courseName: '' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Import courses mutation
  const importMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/import-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Import failed');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      triggerDataRefresh(queryClient);
      toast({
        title: "Import sikeres!",
        description: `${data.imported || 6} kurzus importálva`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Import hiba",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Sync courses mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/sync-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Sync failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      triggerDataRefresh(queryClient);
      toast({
        title: "Szinkronizálás sikeres!",
        description: "Az összes oldal frissítve lett",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Szinkronizálás hiba",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleImportCourses = () => {
    importMutation.mutate();
  };

  const handleSyncCourses = () => {
    syncMutation.mutate();
  };

  const handleDeleteCourse = (courseId: number, courseName: string) => {
    setDeleteDialog({ isOpen: true, courseId, courseName });
  };

  const confirmDelete = () => {
    if (deleteDialog.courseId) {
      deleteMutation.mutate(deleteDialog.courseId);
    }
  };

  // Filter courses based on search term
  const filteredCourses = Array.isArray(courses) ? courses.filter((course: Course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

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
    <AdminGuard>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Áttekintés</TabsTrigger>
            <TabsTrigger value="content">Tartalom kezelés</TabsTrigger>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Kurzuskezelés</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Keresés kurzusok között..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Link href="/admin/courses/new">
                  <Button className="flex items-center gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Új kurzus
                  </Button>
                </Link>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Kurzusok listája</CardTitle>
                    <CardDescription>
                      {filteredCourses.length} kurzus találva {searchTerm && `"${searchTerm}" keresésre`}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    Összes: {courses?.length || 0}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCourses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Nincs találat a keresési feltételekre.' : 'Még nincsenek kurzusok.'}
                    </div>
                  ) : (
                    filteredCourses.map((course: Course) => (
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
                        <Link href={`/admin/courses/${course.id}`}>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/courses/${course.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Tartalom kezelés</h2>
                  <p className="text-muted-foreground">
                    Importáld és szinkronizáld a kurzusokat a frontend oldalakról
                  </p>
                </div>
              </div>

              {/* Import Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Kurzus import
                  </CardTitle>
                  <CardDescription>
                    Automatikus import a /courses, /trending, és /careers oldalakról
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <h3 className="font-semibold text-lg mb-2">Frontend kurzusok</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        6 új kurzus elérhető importálásra
                      </p>
                      <Button 
                        className="w-full"
                        onClick={handleImportCourses}
                        disabled={importMutation.isPending}
                      >
                        {importMutation.isPending ? 'Importálás...' : 'Kurzusok importálása'}
                      </Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h3 className="font-semibold text-lg mb-2">Szinkronizálás</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Valós idejű szinkronizálás aktív
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleSyncCourses}
                        disabled={syncMutation.isPending}
                      >
                        {syncMutation.isPending ? 'Szinkronizálás...' : 'Szinkronizálás most'}
                      </Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h3 className="font-semibold text-lg mb-2">Validáció</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Adatintegritás ellenőrzése
                      </p>
                      <Button variant="outline" className="w-full">
                        Validáció futtatása
                      </Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Sync Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Szinkronizálási állapot</CardTitle>
                  <CardDescription>
                    Valós idejű kapcsolat a frontend oldalakkal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">/courses oldal</span>
                        <Badge variant="default">Szinkronizálva</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">/trending oldal</span>
                        <Badge variant="default">Szinkronizálva</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">/careers oldal</span>
                        <Badge variant="default">Szinkronizálva</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Utolsó szinkronizálás</span>
                        <span className="text-sm text-muted-foreground">2 perce</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Importált kurzusok</span>
                        <span className="text-sm text-muted-foreground">{stats?.totalCourses || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Szinkronizálási mód</span>
                        <Badge variant="outline">Automatikus</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
        
        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, courseId: null, courseName: '' })}
          onConfirm={confirmDelete}
          title="Kurzus törlése"
          description={`Biztosan törölni szeretnéd a(z) "${deleteDialog.courseName}" kurzust? Ez a művelet visszavonhatatlan.`}
          confirmText="Törlés"
          cancelText="Mégse"
          isDestructive={true}
          isLoading={deleteMutation.isPending}
        />
        </div>
      </div>
    </AdminGuard>
  );
}