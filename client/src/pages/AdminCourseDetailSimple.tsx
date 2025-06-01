import { useState } from 'react';
import { useParams } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { AdminGuard } from '@/components/AdminGuard';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Video, 
  FileText, 
  HelpCircle, 
  BarChart3,
  Users,
  Clock,
  Star,
  Save,
  ChevronRight,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { Link } from 'wouter';

interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  imageUrl: string;
  category: string;
  level: string;
  isHighlighted?: boolean;
  modules?: CourseModule[];
}

interface CourseModule {
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
  videoUrl?: string;
  orderIndex: number;
  estimatedDuration: number;
}

export default function AdminCourseDetailSimple() {
  const params = useParams();
  const courseId = parseInt(params.id as string);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [newModuleDialog, setNewModuleDialog] = useState(false);
  const [newLessonDialog, setNewLessonDialog] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  // Fetch course details
  const { data: course, isLoading } = useQuery({
    queryKey: ['/api/admin/courses', courseId, 'detailed'],
    retry: false,
  });

  // Create module mutation
  const createModuleMutation = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const response = await apiRequest('POST', `/api/courses/${courseId}/modules`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', courseId] });
      toast({ title: "Modul létrehozva", description: "Az új modul sikeresen hozzáadva." });
      setNewModuleDialog(false);
    },
  });

  // Create lesson mutation
  const createLessonMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; content: string; videoUrl?: string; estimatedDuration: number }) => {
      const response = await apiRequest('POST', `/api/modules/${selectedModuleId}/lessons`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', courseId] });
      toast({ title: "Lecke létrehozva", description: "Az új lecke sikeresen hozzáadva." });
      setNewLessonDialog(false);
      setSelectedModuleId(null);
    },
  });

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/courses">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vissza a kurzusokhoz
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{course?.title}</h1>
              <p className="text-muted-foreground">{course?.category} • {course?.level}</p>
            </div>
          </div>
          <Badge variant={course?.isHighlighted ? "default" : "secondary"}>
            {course?.isHighlighted ? "Kiemelt" : "Normál"}
          </Badge>
        </div>

        {/* Course Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Kurzus áttekintés
            </CardTitle>
            <CardDescription>
              A kurzus alapvető információi és tartalomstruktúra
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{course?.modules?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Modul</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {course?.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Lecke</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {course?.modules?.reduce((total, module) => 
                    total + (module.lessons?.reduce((lessonTotal, lesson) => 
                      lessonTotal + (lesson.estimatedDuration || 0), 0
                    ) || 0), 0
                  ) || 0} perc
                </div>
                <div className="text-sm text-muted-foreground">Teljes időtartam</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Tartalom szerkesztés</TabsTrigger>
            <TabsTrigger value="settings">Beállítások</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {/* Course Structure */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Kurzus struktúra</CardTitle>
                  <CardDescription>Modulok és leckék kezelése egyszerűen</CardDescription>
                </div>
                <Button onClick={() => setNewModuleDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Új modul
                </Button>
              </CardHeader>
              <CardContent>
                {course?.modules && course.modules.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <AccordionItem key={module.id} value={`module-${module.id}`} className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                              {moduleIndex + 1}
                            </div>
                            <div>
                              <div className="font-semibold">{module.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {module.lessons?.length || 0} lecke
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-3">
                            <p className="text-muted-foreground">{module.description}</p>
                            
                            {/* Lessons */}
                            <div className="space-y-2">
                              {module.lessons && module.lessons.length > 0 ? (
                                module.lessons.map((lesson, lessonIndex) => (
                                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div className="w-5 h-5 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">
                                        {lessonIndex + 1}
                                      </div>
                                      <div>
                                        <div className="font-medium">{lesson.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {lesson.estimatedDuration} perc
                                          {lesson.videoUrl && (
                                            <span className="ml-2 inline-flex items-center gap-1">
                                              <PlayCircle className="h-3 w-3" />
                                              Videó
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setEditingLesson(lesson)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                  <p>Még nincsenek leckék ebben a modulban</p>
                                </div>
                              )}
                            </div>

                            {/* Add Lesson Button */}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setSelectedModuleId(module.id);
                                setNewLessonDialog(true);
                              }}
                              className="w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Lecke hozzáadása
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Még nincsenek modulok</h3>
                    <p className="text-muted-foreground mb-4">
                      Kezdd el a kurzus építését az első modul létrehozásával
                    </p>
                    <Button onClick={() => setNewModuleDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Első modul létrehozása
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Kurzus beállítások</CardTitle>
                <CardDescription>Alapvető kurzus beállítások módosítása</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Beállítások hamarosan elérhetők...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* New Module Dialog */}
        <Dialog open={newModuleDialog} onOpenChange={setNewModuleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Új modul létrehozása</DialogTitle>
              <DialogDescription>
                Hozz létre egy új modult a kurzusodhoz
              </DialogDescription>
            </DialogHeader>
            <NewModuleForm onSubmit={createModuleMutation.mutate} />
          </DialogContent>
        </Dialog>

        {/* New Lesson Dialog */}
        <Dialog open={newLessonDialog} onOpenChange={setNewLessonDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Új lecke létrehozása</DialogTitle>
              <DialogDescription>
                Adj hozzá egy új leckét a kiválasztott modulhoz
              </DialogDescription>
            </DialogHeader>
            <NewLessonForm onSubmit={createLessonMutation.mutate} />
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}

// New Module Form Component
function NewModuleForm({ onSubmit }: { onSubmit: (data: { title: string; description: string }) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="moduleTitle">Modul címe *</Label>
        <Input
          id="moduleTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="pl. Bevezetés a digitális marketingbe"
          required
        />
      </div>
      <div>
        <Label htmlFor="moduleDescription">Modul leírása *</Label>
        <Textarea
          id="moduleDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Rövid leírás arról, hogy mit tanulnak meg a hallgatók ebben a modulban..."
          rows={3}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => {setTitle(''); setDescription('');}}>
          Mégse
        </Button>
        <Button type="submit" disabled={!title.trim() || !description.trim()}>
          <Save className="h-4 w-4 mr-2" />
          Modul létrehozása
        </Button>
      </div>
    </form>
  );
}

// New Lesson Form Component
function NewLessonForm({ onSubmit }: { onSubmit: (data: { title: string; description: string; content: string; videoUrl?: string; estimatedDuration: number }) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !content.trim()) return;
    
    onSubmit({ 
      title: title.trim(), 
      description: description.trim(), 
      content: content.trim(),
      videoUrl: videoUrl.trim() || undefined,
      estimatedDuration
    });
    
    setTitle('');
    setDescription('');
    setContent('');
    setVideoUrl('');
    setEstimatedDuration(30);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lessonTitle">Lecke címe *</Label>
          <Input
            id="lessonTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="pl. Mi a digitális marketing?"
            required
          />
        </div>
        <div>
          <Label htmlFor="duration">Időtartam (perc) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="480"
            value={estimatedDuration}
            onChange={(e) => setEstimatedDuration(parseInt(e.target.value) || 30)}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="lessonDescription">Lecke leírása *</Label>
        <Textarea
          id="lessonDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Rövid összefoglaló arról, mit tartalmaz ez a lecke..."
          rows={2}
          required
        />
      </div>

      <div>
        <Label htmlFor="videoUrl">Videó URL (opcionális)</Label>
        <Input
          id="videoUrl"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=... vagy más videó link"
        />
      </div>

      <div>
        <Label htmlFor="lessonContent">Lecke tartalma *</Label>
        <Textarea
          id="lessonContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Itt írhatod le a lecke részletes tartalmát, magyarázatokat, gyakorlatokat..."
          rows={6}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => {
          setTitle(''); setDescription(''); setContent(''); setVideoUrl(''); setEstimatedDuration(30);
        }}>
          Mégse
        </Button>
        <Button type="submit" disabled={!title.trim() || !description.trim() || !content.trim()}>
          <Save className="h-4 w-4 mr-2" />
          Lecke létrehozása
        </Button>
      </div>
    </form>
  );
}