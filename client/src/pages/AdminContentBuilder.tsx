import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import RichTextEditor from '@/components/admin/RichTextEditor';
import FileUpload from '@/components/admin/FileUpload';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Eye,
  PlayCircle,
  FileText,
  Image,
  Video,
  Download,
  Upload as UploadIcon
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
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const courseId = parseInt(id || '0');

  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [newModuleDialog, setNewModuleDialog] = useState(false);
  const [newLessonDialog, setNewLessonDialog] = useState(false);

  // Form states
  const [moduleForm, setModuleForm] = useState({ title: '', description: '' });
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    content: '',
    duration: 30,
    videoUrl: ''
  });

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/admin/courses/${courseId}/detailed`],
    enabled: !!courseId,
  });

  // Create module mutation
  const createModuleMutation = useMutation({
    mutationFn: async (moduleData: { title: string; description: string }) => {
      const response = await apiRequest('POST', `/api/courses/${courseId}/modules`, {
        ...moduleData,
        orderIndex: (course?.modules?.length || 0) + 1
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${courseId}/detailed`] });
      setNewModuleDialog(false);
      setModuleForm({ title: '', description: '' });
      toast({
        title: "Modul létrehozva",
        description: "Az új modul sikeresen létrejött.",
      });
    },
  });

  // Create lesson mutation
  const createLessonMutation = useMutation({
    mutationFn: async (lessonData: any) => {
      const response = await apiRequest('POST', `/api/modules/${activeModule}/lessons`, {
        ...lessonData,
        orderIndex: (course?.modules?.find(m => m.id === activeModule)?.lessons?.length || 0) + 1
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${courseId}/detailed`] });
      setNewLessonDialog(false);
      setLessonForm({
        title: '',
        description: '',
        content: '',
        duration: 30,
        videoUrl: ''
      });
      toast({
        title: "Lecke létrehozva",
        description: "Az új lecke sikeresen létrejött.",
      });
    },
  });

  // Update lesson mutation
  const updateLessonMutation = useMutation({
    mutationFn: async (lessonData: any) => {
      const response = await apiRequest('PUT', `/api/lessons/${editingLesson?.id}`, lessonData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${courseId}/detailed`] });
      setEditingLesson(null);
      toast({
        title: "Lecke frissítve",
        description: "A lecke sikeresen frissült.",
      });
    },
  });

  // File upload handler
  const handleFileUpload = async (files: File[]): Promise<string[]> => {
    // Simulate file upload - in a real app, this would upload to a storage service
    return new Promise((resolve) => {
      setTimeout(() => {
        const urls = files.map(file => `https://example.com/uploads/${file.name}`);
        resolve(urls);
      }, 1000);
    });
  };

  const handleSaveLesson = () => {
    if (editingLesson) {
      updateLessonMutation.mutate({
        ...lessonForm,
        id: editingLesson.id,
        moduleId: editingLesson.moduleId
      });
    } else if (activeModule) {
      createLessonMutation.mutate({
        ...lessonForm,
        moduleId: activeModule
      });
    }
  };

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => setLocation('/admin')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Vissza
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{course?.title}</h1>
          <p className="text-gray-600">Tartalom kezelése</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Modulok</CardTitle>
                <Dialog open={newModuleDialog} onOpenChange={setNewModuleDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
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
                        <Label htmlFor="module-description">Leírás</Label>
                        <Input
                          id="module-description"
                          value={moduleForm.description}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Rövid leírás a modulról"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => createModuleMutation.mutate(moduleForm)}
                          disabled={!moduleForm.title || createModuleMutation.isPending}
                        >
                          {createModuleMutation.isPending ? 'Létrehozás...' : 'Létrehozás'}
                        </Button>
                        <Button variant="outline" onClick={() => setNewModuleDialog(false)}>
                          Mégse
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {course?.modules?.map((module: Module) => (
                <Card 
                  key={module.id}
                  className={`cursor-pointer transition-colors ${
                    activeModule === module.id ? 'ring-2 ring-primary' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {module.lessons?.length || 0} lecke
                    </p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-2">
          {activeModule ? (
            <Tabs defaultValue="lessons" className="space-y-4">
              <TabsList>
                <TabsTrigger value="lessons">Leckék</TabsTrigger>
                <TabsTrigger value="resources">Anyagok</TabsTrigger>
                <TabsTrigger value="settings">Beállítások</TabsTrigger>
              </TabsList>

              <TabsContent value="lessons" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {course?.modules?.find(m => m.id === activeModule)?.title} - Leckék
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
                      <div className="space-y-6">
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
                              onChange={(e) => setLessonForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="lesson-description">Rövid leírás</Label>
                          <Input
                            id="lesson-description"
                            value={lessonForm.description}
                            onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Rövid leírás a leckéről"
                          />
                        </div>

                        <div>
                          <Label htmlFor="lesson-video">Videó URL (opcionális)</Label>
                          <Input
                            id="lesson-video"
                            value={lessonForm.videoUrl}
                            onChange={(e) => setLessonForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="https://example.com/video.mp4"
                          />
                        </div>

                        <div>
                          <Label>Lecke tartalma</Label>
                          <RichTextEditor
                            value={lessonForm.content}
                            onChange={(content) => setLessonForm(prev => ({ ...prev, content }))}
                            placeholder="Írja be a lecke részletes tartalmát..."
                            height="400px"
                          />
                        </div>

                        <div>
                          <Label>Fájlok és anyagok</Label>
                          <FileUpload
                            accept="image/*,video/*,.pdf,.doc,.docx"
                            maxSize={50}
                            multiple={true}
                            onUpload={handleFileUpload}
                            onComplete={(urls) => {
                              toast({
                                title: "Fájlok feltöltve",
                                description: `${urls.length} fájl sikeresen feltöltve.`,
                              });
                            }}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSaveLesson}
                            disabled={!lessonForm.title || !lessonForm.content}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {editingLesson ? 'Frissítés' : 'Létrehozás'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setNewLessonDialog(false);
                              setEditingLesson(null);
                              setLessonForm({
                                title: '',
                                description: '',
                                content: '',
                                duration: 30,
                                videoUrl: ''
                              });
                            }}
                          >
                            Mégse
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Lessons List */}
                <div className="space-y-3">
                  {course?.modules?.find(m => m.id === activeModule)?.lessons?.map((lesson: Lesson) => (
                    <Card key={lesson.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {lesson.videoUrl ? (
                              <PlayCircle className="h-5 w-5 text-blue-500" />
                            ) : (
                              <FileText className="h-5 w-5 text-gray-500" />
                            )}
                            <div>
                              <h3 className="font-semibold">{lesson.title}</h3>
                              <p className="text-sm text-gray-600">{lesson.description}</p>
                              <p className="text-xs text-gray-500">{lesson.duration} perc</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingLesson(lesson);
                                setLessonForm({
                                  title: lesson.title,
                                  description: lesson.description,
                                  content: lesson.content,
                                  duration: lesson.duration,
                                  videoUrl: lesson.videoUrl || ''
                                });
                                setNewLessonDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle>Kiegészítő anyagok</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      accept="*/*"
                      maxSize={100}
                      multiple={true}
                      onUpload={handleFileUpload}
                      onComplete={(urls) => {
                        toast({
                          title: "Anyagok feltöltve",
                          description: `${urls.length} fájl sikeresen feltöltve.`,
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Modul beállítások</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Modul specifikus beállítások itt lesznek elérhetők.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Válasszon modult</h3>
                <p className="text-gray-600">
                  Válasszon ki egy modult a bal oldali listából a tartalom szerkesztéséhez.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}