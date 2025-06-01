import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { AdminGuard } from '@/components/AdminGuard';
import HierarchicalCourseBuilder from '@/components/admin/HierarchicalCourseBuilder';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Eye,
  PlayCircle,
  FileText,
  Settings,
  BookOpen,
  DollarSign,
  Clock,
  Users,
  Tag,
  Network
} from 'lucide-react';

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
  content: string;
  description: string;
  duration: number;
  orderIndex: number;
  videoUrl?: string;
  moduleId: number;
}

export default function AdminContentBuilder() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const courseId = parseInt(id || '0');

  // State management
  const [activeTab, setActiveTab] = useState('settings');
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [newModuleDialog, setNewModuleDialog] = useState(false);
  const [newLessonDialog, setNewLessonDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Course basic settings form
  const [courseSettings, setCourseSettings] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: 0,
    originalPrice: 0,
    duration: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    category: '',
    tags: [] as string[],
    language: 'hungarian',
    isHighlighted: false,
    imageUrl: '',
    prerequisites: '',
    learningOutcomes: '',
    targetAudience: ''
  });

  // Module form
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    orderIndex: 1
  });

  // Lesson form
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    content: '',
    duration: 0,
    videoUrl: '',
    orderIndex: 1
  });

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/admin/courses/${courseId}/detailed`],
    enabled: !!courseId,
  });

  // Load course data into form when available
  useEffect(() => {
    if (course) {
      setCourseSettings({
        title: course.title || '',
        description: course.description || '',
        shortDescription: course.shortDescription || '',
        price: course.price || 0,
        originalPrice: course.originalPrice || 0,
        duration: course.duration || '',
        difficulty: course.difficulty || 'beginner',
        category: course.category || '',
        tags: course.tags || [],
        language: course.language || 'hungarian',
        isHighlighted: course.isHighlighted || false,
        imageUrl: course.imageUrl || '',
        prerequisites: course.prerequisites || '',
        learningOutcomes: course.learningOutcomes || '',
        targetAudience: course.targetAudience || ''
      });
    }
  }, [course]);

  // Course settings update mutation
  const updateCourseMutation = useMutation({
    mutationFn: async (settings: any) => {
      await apiRequest('PUT', `/api/admin/courses/${courseId}`, settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${courseId}/detailed`] });
      setUnsavedChanges(false);
      toast({
        title: 'Kurzus frissítve',
        description: 'A kurzus beállításai sikeresen mentve.',
      });
    },
    onError: () => {
      toast({
        title: 'Hiba',
        description: 'A kurzus frissítése sikertelen.',
        variant: 'destructive',
      });
    },
  });

  // Create module mutation
  const createModuleMutation = useMutation({
    mutationFn: async (moduleData: any) => {
      await apiRequest('POST', `/api/courses/${courseId}/modules`, moduleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${courseId}/detailed`] });
      setNewModuleDialog(false);
      setModuleForm({ title: '', description: '', orderIndex: 1 });
      toast({
        title: 'Modul létrehozva',
        description: 'Az új modul sikeresen hozzáadva.',
      });
    },
    onError: () => {
      toast({
        title: 'Hiba',
        description: 'A modul létrehozása sikertelen.',
        variant: 'destructive',
      });
    },
  });

  // Create lesson mutation
  const createLessonMutation = useMutation({
    mutationFn: async (lessonData: any) => {
      await apiRequest('POST', `/api/modules/${activeModule}/lessons`, lessonData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${courseId}/detailed`] });
      setNewLessonDialog(false);
      setLessonForm({ title: '', description: '', content: '', duration: 0, videoUrl: '', orderIndex: 1 });
      toast({
        title: 'Lecke létrehozva',
        description: 'Az új lecke sikeresen hozzáadva.',
      });
    },
    onError: () => {
      toast({
        title: 'Hiba',
        description: 'A lecke létrehozása sikertelen.',
        variant: 'destructive',
      });
    },
  });

  // Update lesson mutation
  const updateLessonMutation = useMutation({
    mutationFn: async (lessonData: any) => {
      await apiRequest('PUT', `/api/lessons/${editingLesson?.id}`, lessonData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${courseId}/detailed`] });
      setNewLessonDialog(false);
      setEditingLesson(null);
      toast({
        title: 'Lecke frissítve',
        description: 'A lecke sikeresen módosítva.',
      });
    },
    onError: () => {
      toast({
        title: 'Hiba',
        description: 'A lecke frissítése sikertelen.',
        variant: 'destructive',
      });
    },
  });

  const handleSaveSettings = () => {
    updateCourseMutation.mutate(courseSettings);
  };

  const handleCreateModule = () => {
    const orderIndex = course?.modules?.length ? Math.max(...course.modules.map((m: any) => m.orderIndex)) + 1 : 1;
    createModuleMutation.mutate({
      ...moduleForm,
      orderIndex
    });
  };

  const handleCreateLesson = () => {
    if (!activeModule) return;
    
    const module = course?.modules?.find((m: any) => m.id === activeModule);
    const orderIndex = module?.lessons?.length ? Math.max(...module.lessons.map((l: any) => l.orderIndex)) + 1 : 1;
    
    if (editingLesson) {
      updateLessonMutation.mutate({
        ...lessonForm,
        orderIndex: editingLesson.orderIndex
      });
    } else {
      createLessonMutation.mutate({
        ...lessonForm,
        orderIndex
      });
    }
  };

  const openEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl || '',
      orderIndex: lesson.orderIndex
    });
    setNewLessonDialog(true);
  };

  if (courseLoading) {
    return (
      <AdminGuard>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </AdminGuard>
    );
  }

  if (!course) {
    return (
      <AdminGuard>
        <div className="container mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Kurzus nem található</h1>
            <Button onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Vissza az adminisztrációhoz
            </Button>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Vissza
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Kurzus kezelése</h1>
              <p className="text-gray-600">{course.title}</p>
            </div>
          </div>
          {unsavedChanges && (
            <Button onClick={handleSaveSettings} disabled={updateCourseMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Változások mentése
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Alapbeállítások
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Struktúra
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Modulok
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Leckék
            </TabsTrigger>
          </TabsList>

          {/* Course Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Kurzus alapbeállítások
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Kurzus címe</Label>
                    <Input
                      id="title"
                      value={courseSettings.title}
                      onChange={(e) => {
                        setCourseSettings(prev => ({ ...prev, title: e.target.value }));
                        setUnsavedChanges(true);
                      }}
                      placeholder="Pl. React fejlesztés kezdőknek"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Kategória</Label>
                    <Select
                      value={courseSettings.category}
                      onValueChange={(value) => {
                        setCourseSettings(prev => ({ ...prev, category: value }));
                        setUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Válassz kategóriát" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="programming">Programozás</SelectItem>
                        <SelectItem value="design">Dizájn</SelectItem>
                        <SelectItem value="business">Üzlet</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="other">Egyéb</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Ár (Ft)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={courseSettings.price}
                      onChange={(e) => {
                        setCourseSettings(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }));
                        setUnsavedChanges(true);
                      }}
                      placeholder="29990"
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Eredeti ár (Ft)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={courseSettings.originalPrice}
                      onChange={(e) => {
                        setCourseSettings(prev => ({ ...prev, originalPrice: parseInt(e.target.value) || 0 }));
                        setUnsavedChanges(true);
                      }}
                      placeholder="39990"
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Nehézség</Label>
                    <Select
                      value={courseSettings.difficulty}
                      onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => {
                        setCourseSettings(prev => ({ ...prev, difficulty: value }));
                        setUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Kezdő</SelectItem>
                        <SelectItem value="intermediate">Haladó</SelectItem>
                        <SelectItem value="advanced">Szakértő</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Duration and Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Időtartam
                    </Label>
                    <Input
                      id="duration"
                      value={courseSettings.duration}
                      onChange={(e) => {
                        setCourseSettings(prev => ({ ...prev, duration: e.target.value }));
                        setUnsavedChanges(true);
                      }}
                      placeholder="8 hét"
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Nyelv</Label>
                    <Select
                      value={courseSettings.language}
                      onValueChange={(value) => {
                        setCourseSettings(prev => ({ ...prev, language: value }));
                        setUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hungarian">Magyar</SelectItem>
                        <SelectItem value="english">Angol</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <Label htmlFor="shortDescription">Rövid leírás</Label>
                  <Textarea
                    id="shortDescription"
                    value={courseSettings.shortDescription}
                    onChange={(e) => {
                      setCourseSettings(prev => ({ ...prev, shortDescription: e.target.value }));
                      setUnsavedChanges(true);
                    }}
                    placeholder="Rövid összefoglaló a kurzusról..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Részletes leírás</Label>
                  <Textarea
                    id="description"
                    value={courseSettings.description}
                    onChange={(e) => {
                      setCourseSettings(prev => ({ ...prev, description: e.target.value }));
                      setUnsavedChanges(true);
                    }}
                    placeholder="Részletes kurzus leírás..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="prerequisites">Előfeltételek</Label>
                  <Textarea
                    id="prerequisites"
                    value={courseSettings.prerequisites}
                    onChange={(e) => {
                      setCourseSettings(prev => ({ ...prev, prerequisites: e.target.value }));
                      setUnsavedChanges(true);
                    }}
                    placeholder="Milyen előzetes tudás szükséges..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="learningOutcomes">Tanulási eredmények</Label>
                  <Textarea
                    id="learningOutcomes"
                    value={courseSettings.learningOutcomes}
                    onChange={(e) => {
                      setCourseSettings(prev => ({ ...prev, learningOutcomes: e.target.value }));
                      setUnsavedChanges(true);
                    }}
                    placeholder="Mit fognak megtanulni a résztvevők..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Célközönség
                  </Label>
                  <Textarea
                    id="targetAudience"
                    value={courseSettings.targetAudience}
                    onChange={(e) => {
                      setCourseSettings(prev => ({ ...prev, targetAudience: e.target.value }));
                      setUnsavedChanges(true);
                    }}
                    placeholder="Kinek ajánljuk ezt a kurzust..."
                    rows={2}
                  />
                </div>

                <Separator />

                <Button
                  onClick={handleSaveSettings}
                  disabled={updateCourseMutation.isPending || !unsavedChanges}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateCourseMutation.isPending ? 'Mentés...' : 'Beállítások mentése'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Structure Tab */}
          <TabsContent value="structure" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Kurzus struktúra kezelése
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Hierarchikus kurzusstruktúra létrehozása és szerkesztése drag-and-drop funkcióval. 
                  Támogatja a 4 szintű hierarchiát: Kurzus → Modulok → Leckék → Al-leckék
                </p>
              </CardHeader>
              <CardContent>
                <HierarchicalCourseBuilder 
                  courseId={courseId}
                  onSave={(structure) => {
                    console.log('Kurzus struktúra mentve:', structure);
                    // A hierarchikus builder automatikusan menti a változásokat
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Modulok kezelése</h2>
              <Dialog open={newModuleDialog} onOpenChange={setNewModuleDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Új modul
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Új modul létrehozása</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="module-title">Modul címe</Label>
                      <Input
                        id="module-title"
                        value={moduleForm.title}
                        onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Pl. Bevezetés a React-ba"
                      />
                    </div>
                    <div>
                      <Label htmlFor="module-description">Modul leírása</Label>
                      <Textarea
                        id="module-description"
                        value={moduleForm.description}
                        onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="A modul tartalma..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleCreateModule} disabled={createModuleMutation.isPending}>
                      {createModuleMutation.isPending ? 'Létrehozás...' : 'Modul létrehozása'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {course?.modules?.map((module: Module) => (
                <Card key={module.id} className={activeModule === module.id ? 'ring-2 ring-primary' : ''}>
                  <CardHeader className="cursor-pointer" onClick={() => setActiveModule(module.id)}>
                    <CardTitle className="flex items-center justify-between">
                      <span>{module.title}</span>
                      <Badge variant="secondary">{module.lessons?.length || 0} lecke</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-4">
            {activeModule ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {course?.modules?.find((m: Module) => m.id === activeModule)?.title} - Leckék
                  </h2>
                  <Dialog open={newLessonDialog} onOpenChange={setNewLessonDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Új lecke
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingLesson ? 'Lecke szerkesztése' : 'Új lecke létrehozása'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="lesson-title">Lecke címe</Label>
                            <Input
                              id="lesson-title"
                              value={lessonForm.title}
                              onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Pl. React komponensek alapjai"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lesson-duration">Időtartam (perc)</Label>
                            <Input
                              id="lesson-duration"
                              type="number"
                              value={lessonForm.duration}
                              onChange={(e) => setLessonForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                              placeholder="30"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="lesson-description">Lecke leírása</Label>
                          <Textarea
                            id="lesson-description"
                            value={lessonForm.description}
                            onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Rövid leírás a leckéről..."
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lesson-video">Videó URL (opcionális)</Label>
                          <Input
                            id="lesson-video"
                            value={lessonForm.videoUrl}
                            onChange={(e) => setLessonForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="lesson-content">Lecke tartalma</Label>
                          <Textarea
                            id="lesson-content"
                            value={lessonForm.content}
                            onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="A lecke részletes tartalma..."
                            rows={8}
                          />
                        </div>
                        <Button
                          onClick={handleCreateLesson}
                          disabled={createLessonMutation.isPending || updateLessonMutation.isPending}
                        >
                          {(createLessonMutation.isPending || updateLessonMutation.isPending) 
                            ? 'Mentés...' 
                            : editingLesson ? 'Lecke frissítése' : 'Lecke létrehozása'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-3">
                  {course?.modules?.find((m: Module) => m.id === activeModule)?.lessons?.map((lesson: Lesson) => (
                    <Card key={lesson.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {lesson.videoUrl ? 
                              <PlayCircle className="h-5 w-5 text-blue-500" /> :
                              <FileText className="h-5 w-5 text-gray-500" />
                            }
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-gray-600">
                                {lesson.duration} perc • {lesson.description}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => openEditLesson(lesson)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Válassz modult</h3>
                  <p className="text-gray-600">Menj a Modulok fülre és válassz ki egy modult a leckék kezeléséhez.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}