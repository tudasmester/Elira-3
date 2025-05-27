import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import {
  Book, Plus, Edit3, Trash2, Video, FileText, 
  Quiz, Upload, Save, Eye, ChevronDown, ChevronRight,
  PlayCircle, CheckCircle, Clock, Users, Star,
  Settings, Layers, GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AdminGuard } from '@/components/AdminGuard';

interface Module {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  videoUrl: string | null;
  duration: number;
  orderIndex: number;
  quizzes: Quiz[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  passingScore: number;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: number;
  question: string;
  orderIndex: number;
  answers: QuizAnswer[];
}

interface QuizAnswer {
  id: number;
  answerText: string;
  isCorrect: number;
  orderIndex: number;
}

interface CourseResource {
  id: number;
  title: string;
  description: string;
  type: string;
  url: string;
}

export default function AdminCourseBuilder() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [editingModule, setEditingModule] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const courseId = parseInt(id || '0');

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/admin/courses/${courseId}`],
    enabled: !!courseId,
  });

  // Fetch course structure
  const { data: courseStructure, isLoading: structureLoading } = useQuery({
    queryKey: [`/api/admin/courses/${courseId}/structure`],
    enabled: !!courseId,
  });

  // Fetch course resources
  const { data: resources } = useQuery({
    queryKey: [`/api/admin/courses/${courseId}/resources`],
    enabled: !!courseId,
  });

  // Create module mutation
  const createModuleMutation = useMutation({
    mutationFn: async (moduleData: any) => {
      const response = await fetch(`/api/admin/courses/${courseId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData)
      });
      if (!response.ok) throw new Error('Failed to create module');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${courseId}/structure`] });
      toast({
        title: "Modul létrehozva",
        description: "Az új modul sikeresen hozzáadva a kurzushoz.",
      });
    }
  });

  // Create lesson mutation
  const createLessonMutation = useMutation({
    mutationFn: async ({ moduleId, lessonData }: { moduleId: number, lessonData: any }) => {
      const response = await fetch(`/api/admin/modules/${moduleId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonData)
      });
      if (!response.ok) throw new Error('Failed to create lesson');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${courseId}/structure`] });
      toast({
        title: "Lecke létrehozva",
        description: "Az új lecke sikeresen hozzáadva a modulhoz.",
      });
    }
  });

  // Create resource mutation
  const createResourceMutation = useMutation({
    mutationFn: async (resourceData: any) => {
      const response = await fetch(`/api/admin/courses/${courseId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceData)
      });
      if (!response.ok) throw new Error('Failed to create resource');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${courseId}/resources`] });
      toast({
        title: "Erőforrás hozzáadva",
        description: "Az új erőforrás sikeresen hozzáadva a kurzushoz.",
      });
    }
  });

  const toggleModuleExpansion = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  if (courseLoading || structureLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  ← Vissza az adminhoz
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LMS Kurzusszerkesztő
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {course?.title} - Teljes kurzusstruktúra kezelése
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Előnézet
                </Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Mentés
                </Button>
              </div>
            </div>
            
            {/* Course Info Bar */}
            <div className="flex items-center gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-sm">
                  <span className="font-medium">{course?.enrollmentCount || 0}</span> beiratkozott
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">
                  <span className="font-medium">{((course?.rating || 0) / 100).toFixed(1)}</span> értékelés
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <span className="text-sm">
                  <span className="font-medium">{course?.duration || 'N/A'}</span> időtartam
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={course?.isPublished ? "default" : "destructive"}>
                  {course?.isPublished ? 'Publikált' : 'Vázlat'}
                </Badge>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Áttekintés</TabsTrigger>
              <TabsTrigger value="content">Tartalom</TabsTrigger>
              <TabsTrigger value="resources">Erőforrások</TabsTrigger>
              <TabsTrigger value="settings">Beállítások</TabsTrigger>
              <TabsTrigger value="analytics">Analitika</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Modulok</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{courseStructure?.modules?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {courseStructure?.modules?.reduce((acc: number, module: Module) => acc + module.lessons.length, 0) || 0} lecke összesen
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Videók</CardTitle>
                    <Video className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {courseStructure?.modules?.reduce((acc: number, module: Module) => 
                        acc + module.lessons.filter(lesson => lesson.videoUrl).length, 0) || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">videós lecke</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kvízek</CardTitle>
                    <Quiz className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {courseStructure?.modules?.reduce((acc: number, module: Module) => 
                        acc + module.lessons.reduce((lessonAcc: number, lesson: Lesson) => 
                          lessonAcc + lesson.quizzes.length, 0), 0) || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">interaktív kvíz</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Erőforrások</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{resources?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">letölthető anyag</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Gyors műveletek</CardTitle>
                  <CardDescription>
                    Gyakran használt funkciók egyszerű elérése
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="flex items-center gap-2" onClick={() => setActiveTab('content')}>
                    <Plus className="h-4 w-4" />
                    Új modul hozzáadása
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab('resources')}>
                    <Upload className="h-4 w-4" />
                    Erőforrás feltöltése
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Kurzus beállítások
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Kurzus tartalom</h2>
                <Button onClick={() => {
                  const title = prompt('Modul címe:');
                  const description = prompt('Modul leírása:');
                  if (title && description) {
                    createModuleMutation.mutate({
                      title,
                      description,
                      orderIndex: (courseStructure?.modules?.length || 0) + 1
                    });
                  }
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Új modul
                </Button>
              </div>

              {/* Course Modules */}
              <div className="space-y-4">
                {courseStructure?.modules?.map((module: Module, moduleIndex: number) => (
                  <Card key={module.id} className="overflow-hidden">
                    <CardHeader className="cursor-pointer" onClick={() => toggleModuleExpansion(module.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {expandedModules.includes(module.id) ? 
                            <ChevronDown className="h-5 w-5" /> : 
                            <ChevronRight className="h-5 w-5" />
                          }
                          <div>
                            <CardTitle className="text-lg">
                              {moduleIndex + 1}. {module.title}
                            </CardTitle>
                            <CardDescription>{module.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {module.lessons.length} lecke
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            const title = prompt('Lecke címe:');
                            const description = prompt('Lecke leírása:');
                            const content = prompt('Lecke tartalma:');
                            const duration = prompt('Időtartam (percek):');
                            if (title && description && content && duration) {
                              createLessonMutation.mutate({
                                moduleId: module.id,
                                lessonData: {
                                  title,
                                  description,
                                  content,
                                  duration: parseInt(duration),
                                  orderIndex: module.lessons.length + 1
                                }
                              });
                            }
                          }}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {expandedModules.includes(module.id) && (
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {module.lessons.map((lesson: Lesson, lessonIndex: number) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-3">
                                {lesson.videoUrl ? 
                                  <PlayCircle className="h-5 w-5 text-blue-500" /> :
                                  <FileText className="h-5 w-5 text-gray-500" />
                                }
                                <div>
                                  <h4 className="font-medium">
                                    {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {lesson.duration} perc
                                    {lesson.quizzes.length > 0 && ` • ${lesson.quizzes.length} kvíz`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Kurzus erőforrások</h2>
                <Button onClick={() => {
                  const title = prompt('Erőforrás címe:');
                  const description = prompt('Erőforrás leírása:');
                  const type = prompt('Típus (pdf, video, link):');
                  const url = prompt('URL:');
                  if (title && description && type && url) {
                    createResourceMutation.mutate({
                      title,
                      description,
                      type,
                      url
                    });
                  }
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Új erőforrás
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources?.map((resource: CourseResource) => (
                  <Card key={resource.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{resource.type}</Badge>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kurzus beállítások</CardTitle>
                  <CardDescription>
                    Alapvető kurzus konfigurációk és láthatósági beállítások
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Kurzus címe</label>
                        <Input defaultValue={course?.title} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Rövid leírás</label>
                        <Textarea defaultValue={course?.shortDescription} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Ár (HUF)</label>
                        <Input type="number" defaultValue={course?.price} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Publikált</label>
                        <Switch checked={course?.isPublished === 1} />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Ingyenes kurzus</label>
                        <Switch checked={course?.isFree === 1} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Szint</label>
                        <Input defaultValue={course?.level} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Megtekintések</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+12% az elmúlt hónapban</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Beiratkozások</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{course?.enrollmentCount || 0}</div>
                    <p className="text-xs text-muted-foreground">aktív hallgató</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Befejezési arány</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground">+5% az elmúlt hónapban</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Átlagos értékelés</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{((course?.rating || 0) / 100).toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">5 csillagból</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  );
}