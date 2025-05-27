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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AdminGuard } from '@/components/AdminGuard';
import { triggerDataRefresh } from '@/hooks/useRealTimeData';
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
  Star
} from 'lucide-react';
import { Link } from 'wouter';

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
  videoUrl?: string;
  content: string;
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
  isCorrect: boolean;
  orderIndex: number;
}

export default function AdminCourseDetail() {
  const params = useParams();
  const courseId = parseInt(params.id as string);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newModuleDialog, setNewModuleDialog] = useState(false);
  const [newLessonDialog, setNewLessonDialog] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  // Fetch course details with modules and lessons
  const { data: course, isLoading } = useQuery({
    queryKey: ['/api/admin/courses', courseId, 'detailed'],
    retry: false,
  });

  // Fetch course analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/admin/courses', courseId, 'analytics'],
    retry: false,
  });

  // Create new module mutation
  const createModuleMutation = useMutation({
    mutationFn: async (moduleData: { title: string; description: string }) => {
      const response = await apiRequest('POST', `/api/admin/courses/${courseId}/modules`, moduleData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', courseId] });
      triggerDataRefresh(queryClient);
      toast({
        title: "Modul létrehozva",
        description: "A új modul sikeresen létrejött.",
      });
      setNewModuleDialog(false);
    },
  });

  // Create new lesson mutation
  const createLessonMutation = useMutation({
    mutationFn: async (lessonData: { title: string; description: string; content: string; videoUrl?: string }) => {
      const response = await apiRequest('POST', `/api/admin/modules/${selectedModuleId}/lessons`, lessonData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', courseId] });
      triggerDataRefresh(queryClient);
      toast({
        title: "Lecke létrehozva",
        description: "A új lecke sikeresen létrejött.",
      });
      setNewLessonDialog(false);
    },
  });

  // Toggle course highlight mutation
  const toggleHighlightMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/admin/courses/${courseId}/toggle-highlight`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', courseId] });
      triggerDataRefresh(queryClient);
      toast({
        title: "Kiemelés frissítve",
        description: "A kurzus kiemelése sikeresen módosítva.",
      });
    },
  });

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
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
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vissza
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{course?.title}</h1>
              <p className="text-gray-600">{course?.category} • {course?.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => toggleHighlightMutation.mutate()}
              variant={course?.isHighlighted ? "default" : "outline"}
              size="sm"
            >
              <Star className="h-4 w-4 mr-2" />
              {course?.isHighlighted ? "Kiemelt" : "Kiemelés"}
            </Button>
            <Link href={`/admin/courses/${courseId}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Szerkesztés
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Tartalom</TabsTrigger>
            <TabsTrigger value="analytics">Statisztikák</TabsTrigger>
            <TabsTrigger value="quizzes">Kvízek</TabsTrigger>
            <TabsTrigger value="settings">Beállítások</TabsTrigger>
          </TabsList>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Kurzus tartalma</h2>
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
                    <DialogDescription>
                      Hozz létre egy új modult a kurzushoz.
                    </DialogDescription>
                  </DialogHeader>
                  <NewModuleForm onSubmit={createModuleMutation.mutate} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {course?.modules?.map((module: CourseModule) => (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {module.title}
                        </CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {module.lessons?.length || 0} lecke
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedModuleId(module.id);
                            setNewLessonDialog(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Lecke
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {module.lessons && module.lessons.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        {module.lessons.map((lesson: Lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.videoUrl ? (
                                <Video className="h-4 w-4 text-blue-500" />
                              ) : (
                                <FileText className="h-4 w-4 text-gray-500" />
                              )}
                              <div>
                                <p className="font-medium">{lesson.title}</p>
                                <p className="text-sm text-gray-600">{lesson.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.quizzes && lesson.quizzes.length > 0 && (
                                <Badge variant="outline">
                                  <HelpCircle className="h-3 w-3 mr-1" />
                                  {lesson.quizzes.length} kvíz
                                </Badge>
                              )}
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold">Kurzus statisztikák</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Összes diák</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalStudents || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analytics?.newStudentsThisMonth || 0} ebben a hónapban
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Átlagos befejezési idő</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.avgCompletionTime || '0'} nap</div>
                  <p className="text-xs text-muted-foreground">
                    Teljes kurzus elvégzése
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Befejezési arány</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.completionRate || 0}%</div>
                  <p className="text-xs text-muted-foreground">
                    Diákok, akik befejezték
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Átlagos kvíz eredmény</CardTitle>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.avgQuizScore || 0}%</div>
                  <p className="text-xs text-muted-foreground">
                    Összes kvíz átlaga
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Kvízek kezelése</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Új kvíz
              </Button>
            </div>
            
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Kvíz kezelési funkciók hamarosan...</p>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold">Kurzus beállítások</h2>
            
            <div className="text-center py-8">
              <p className="text-gray-600">További beállítások hamarosan...</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* New Lesson Dialog */}
        <Dialog open={newLessonDialog} onOpenChange={setNewLessonDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Új lecke létrehozása</DialogTitle>
              <DialogDescription>
                Hozz létre egy új leckét a kiválasztott modulhoz.
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
function NewModuleForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="moduleTitle">Modul címe</Label>
        <Input
          id="moduleTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Írja be a modul címét"
          required
        />
      </div>
      <div>
        <Label htmlFor="moduleDescription">Leírás</Label>
        <Textarea
          id="moduleDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Írja be a modul leírását"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Modul létrehozása
      </Button>
    </form>
  );
}

// New Lesson Form Component
function NewLessonForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, content, videoUrl: videoUrl || undefined });
    setTitle('');
    setDescription('');
    setContent('');
    setVideoUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="lessonTitle">Lecke címe</Label>
        <Input
          id="lessonTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Írja be a lecke címét"
          required
        />
      </div>
      <div>
        <Label htmlFor="lessonDescription">Leírás</Label>
        <Textarea
          id="lessonDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Írja be a lecke leírását"
          required
        />
      </div>
      <div>
        <Label htmlFor="lessonVideo">Videó URL (opcionális)</Label>
        <Input
          id="lessonVideo"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          type="url"
        />
      </div>
      <div>
        <Label htmlFor="lessonContent">Tartalom</Label>
        <Textarea
          id="lessonContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Írja be a lecke tartalmát"
          className="min-h-[100px]"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Lecke létrehozása
      </Button>
    </form>
  );
}