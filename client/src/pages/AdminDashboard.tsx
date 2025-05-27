import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Settings,
  CheckSquare,
  Square,
  Star,
  Upload,
  FileEdit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
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
  isPublished: number;
  isHighlighted?: number;
  instructorName: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; courseId: number | null; courseName: string }>({ isOpen: false, courseId: null, courseName: '' });
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
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
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete course');
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

  // Bulk operations mutation
  const bulkOperationMutation = useMutation({
    mutationFn: async ({ operation, courseIds }: { operation: string, courseIds: number[] }) => {
      const response = await fetch('/api/admin/bulk-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, courseIds })
      });
      if (!response.ok) throw new Error('Bulk operation failed');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      triggerDataRefresh(queryClient);
      toast({
        title: "Tömeges művelet sikeres!",
        description: `${data.affected || selectedCourses.length} kurzus frissítve`,
      });
      setSelectedCourses([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Hiba történt",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleBulkPublish = () => {
    bulkOperationMutation.mutate({ operation: 'publish', courseIds: selectedCourses });
  };

  const handleBulkUnpublish = () => {
    bulkOperationMutation.mutate({ operation: 'unpublish', courseIds: selectedCourses });
  };

  const handleBulkHighlight = () => {
    bulkOperationMutation.mutate({ operation: 'highlight', courseIds: selectedCourses });
  };

  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const selectAllCourses = () => {
    const allCourseIds = filteredCourses.map((course: any) => course.id);
    setSelectedCourses(selectedCourses.length === allCourseIds.length ? [] : allCourseIds);
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
    const university = universities?.find((u: any) => u.id === universityId);
    return university?.name || 'Ismeretlen egyetem';
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Kurzusok és tartalmak központi kezelése
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Áttekintés</TabsTrigger>
              <TabsTrigger value="courses">Kurzuskezelés</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Összes kurzus</CardTitle>
                    <Book className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
                    <p className="text-xs opacity-90">
                      {stats?.freeCourses || 0} ingyenes, {stats?.paidCourses || 0} fizetős
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Egyetemek</CardTitle>
                    <GraduationCap className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUniversities || 0}</div>
                    <p className="text-xs opacity-90">Partneregyetemek száma</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingyenes kurzusok</CardTitle>
                    <Users className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.freeCourses || 0}</div>
                    <p className="text-xs opacity-90">
                      {stats?.freeCourses && stats?.totalCourses ? 
                        Math.round((stats.freeCourses / stats.totalCourses) * 100) : 0}% az összes kurzusból
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fizetős kurzusok</CardTitle>
                    <TrendingUp className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.paidCourses || 0}</div>
                    <p className="text-xs opacity-90">
                      {stats?.paidCourses && stats?.totalCourses ? 
                        Math.round((stats.paidCourses / stats.totalCourses) * 100) : 0}% az összes kurzusból
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Kurzusok kategóriák szerint</CardTitle>
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

              {/* Enhanced Course Management Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Fejlett kurzuskezelés
                  </CardTitle>
                  <CardDescription>
                    Tömeges műveletek és speciális kurzuskezelési funkciók
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <h3 className="font-semibold text-lg mb-2">Tömeges publikálás</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Egyszerre több kurzus publikálása vagy elrejtése
                      </p>
                      <Button 
                        className="w-full"
                        onClick={handleBulkPublish}
                        disabled={selectedCourses.length === 0 || bulkOperationMutation.isPending}
                      >
                        {bulkOperationMutation.isPending ? 'Feldolgozás...' : 'Kiválasztottak publikálása'}
                      </Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h3 className="font-semibold text-lg mb-2">Kiemelt kurzusok</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Kurzusok kiemelése a kezdőlapon
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleBulkHighlight}
                        disabled={selectedCourses.length === 0 || bulkOperationMutation.isPending}
                      >
                        {bulkOperationMutation.isPending ? 'Feldolgozás...' : 'Kiemelés beállítása'}
                      </Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h3 className="font-semibold text-lg mb-2">Kategória szerkesztés</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Kategóriák és címkék kezelése
                      </p>
                      <Button variant="outline" className="w-full">
                        Kategóriák kezelése
                      </Button>
                    </Card>
                  </div>
                  
                  {selectedCourses.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium">
                        {selectedCourses.length} kurzus kiválasztva tömeges művelethez
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={handleBulkPublish} disabled={bulkOperationMutation.isPending}>
                          Publikálás
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleBulkUnpublish} disabled={bulkOperationMutation.isPending}>
                          Elrejtés
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSelectedCourses([])}>
                          Kiválasztás törlése
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                    <div className="flex items-center gap-2">
                      {selectedCourses.length > 0 && (
                        <Badge variant="secondary" className="text-sm">
                          {selectedCourses.length} kiválasztva
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-sm">
                        Összes: {courses?.length || 0}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Select All Checkbox */}
                  {filteredCourses.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <Checkbox
                        checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                        onCheckedChange={selectAllCourses}
                      />
                      <span className="text-sm font-medium">
                        {selectedCourses.length === filteredCourses.length ? 'Összes kijelölés törlése' : 'Összes kijelölése'}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {filteredCourses.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {searchTerm ? 'Nincs találat a keresési feltételekre.' : 'Még nincsenek kurzusok.'}
                      </div>
                    ) : (
                      filteredCourses.map((course: Course) => (
                        <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <Checkbox
                            checked={selectedCourses.includes(course.id)}
                            onCheckedChange={() => toggleCourseSelection(course.id)}
                          />
                          <img 
                            src={course.imageUrl} 
                            alt={course.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg truncate">{course.title}</h3>
                              {course.isHighlighted && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{course.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="outline">{course.category}</Badge>
                              <Badge variant="outline">{course.level}</Badge>
                              <Badge variant={course.isFree ? "secondary" : "default"}>
                                {course.isFree ? 'Ingyenes' : 'Fizetős'}
                              </Badge>
                              <Badge variant={course.isPublished ? "default" : "destructive"}>
                                {course.isPublished ? 'Publikált' : 'Vázlat'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {getUniversityName(course.universityId)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/courses/${course.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/courses/${course.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <FileEdit className="h-4 w-4 mr-2" />
                                  Duplikálás
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Exportálás
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteCourse(course.id, course.title)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Törlés
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, courseId: null, courseName: '' })}
          onConfirm={confirmDelete}
          title="Kurzus törlése"
          description={`Biztosan törölni szeretnéd a "${deleteDialog.courseName}" kurzust? Ez a művelet nem vonható vissza.`}
          confirmLabel="Törlés"
          cancelLabel="Mégse"
        />
      </div>
    </AdminGuard>
  );
}