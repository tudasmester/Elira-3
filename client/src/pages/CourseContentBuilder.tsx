import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AdminGuard } from '@/components/AdminGuard';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Plus, Edit, Trash2, Save, BookOpen, Video, FileText } from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface Module {
  id?: number;
  title: string;
  description: string;
  orderIndex: number;
  lessons: Lesson[];
}

interface Lesson {
  id?: number;
  title: string;
  description: string;
  content: string;
  estimatedDuration: number;
  orderIndex: number;
  type: 'video' | 'text' | 'quiz';
}

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  level: string;
  language: string;
  duration: string;
  price: number;
  prerequisites: string;
  learningOutcomes: string;
}

export default function CourseContentBuilder() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);

  // Extract course ID from URL
  const courseId = new URLSearchParams(location.split('?')[1] || '').get('courseId');

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setIsLoading(true);
      
      // Load course details from the courses list endpoint
      const coursesResponse = await apiRequest('GET', '/api/admin/courses');
      const coursesData = await coursesResponse.json();
      
      // Find the specific course
      const courseData = coursesData.find((c: any) => c.id === parseInt(courseId!));
      if (courseData) {
        setCourse(courseData);
      } else {
        throw new Error('Course not found');
      }

      // Load modules and lessons (currently returns empty array)
      const modulesResponse = await apiRequest('GET', `/api/admin/courses/${courseId}/modules`);
      const modulesData = await modulesResponse.json();
      setModules(modulesData || []);
      
    } catch (error) {
      console.error('Error loading course data:', error);
      toast({
        title: "Hiba történt",
        description: "A kurzus adatainak betöltése nem sikerült.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addModule = () => {
    const newModule: Module = {
      title: 'Új modul',
      description: '',
      orderIndex: modules.length,
      lessons: []
    };
    setModules([...modules, newModule]);
    setActiveModule(modules.length);
  };

  const updateModule = (index: number, field: keyof Module, value: string) => {
    setModules(modules.map((module, i) => 
      i === index ? { ...module, [field]: value } : module
    ));
  };

  const deleteModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
    if (activeModule === index) {
      setActiveModule(null);
    }
  };

  const addLesson = (moduleIndex: number) => {
    const newLesson: Lesson = {
      title: 'Új lecke',
      description: '',
      content: '',
      estimatedDuration: 10,
      orderIndex: modules[moduleIndex].lessons.length,
      type: 'text'
    };
    
    setModules(modules.map((module, i) => 
      i === moduleIndex 
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    ));
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: keyof Lesson, value: string | number) => {
    setModules(modules.map((module, i) => 
      i === moduleIndex 
        ? {
            ...module,
            lessons: module.lessons.map((lesson, j) =>
              j === lessonIndex ? { ...lesson, [field]: value } : lesson
            )
          }
        : module
    ));
  };

  const deleteLesson = (moduleIndex: number, lessonIndex: number) => {
    setModules(modules.map((module, i) => 
      i === moduleIndex 
        ? {
            ...module,
            lessons: module.lessons.filter((_, j) => j !== lessonIndex)
          }
        : module
    ));
  };

  const saveCourseContent = async () => {
    try {
      setIsSaving(true);
      
      // Save modules and lessons
      await apiRequest('PUT', `/api/admin/courses/${courseId}/content`, {
        modules: modules
      });

      toast({
        title: "Sikeres mentés",
        description: "A kurzus tartalma sikeresen frissítve."
      });
      
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "A mentés nem sikerült. Kérjük, próbálja újra.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminGuard>
    );
  }

  if (!course) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Kurzus nem található</h2>
            <Link href="/admin/courses">
              <Button>Vissza a kurzusokhoz</Button>
            </Link>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/courses">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vissza a kurzusokhoz
              </Button>
            </Link>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                  <Badge variant="outline">{course.language}</Badge>
                </div>
              </div>
              
              <Button onClick={saveCourseContent} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mentés...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Mentés
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Modules List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Modulok</CardTitle>
                    <Button size="sm" onClick={addModule}>
                      <Plus className="h-4 w-4 mr-2" />
                      Új modul
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {modules.map((module, moduleIndex) => (
                    <div 
                      key={moduleIndex} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        activeModule === moduleIndex ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveModule(moduleIndex)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {module.title || `Modul ${moduleIndex + 1}`}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {module.lessons.length} lecke
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteModule(moduleIndex);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {modules.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Még nincsenek modulok</p>
                      <p className="text-sm">Kattintson az "Új modul" gombra a kezdéshez</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Content Editor */}
            <div className="lg:col-span-2">
              {activeModule !== null && modules[activeModule] ? (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {modules[activeModule].title || `Modul ${activeModule + 1}`} szerkesztése
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="details" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Modul részletek</TabsTrigger>
                        <TabsTrigger value="lessons">Leckék</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details" className="space-y-4">
                        <div>
                          <Label htmlFor="module-title">Modul címe</Label>
                          <Input
                            id="module-title"
                            value={modules[activeModule].title}
                            onChange={(e) => updateModule(activeModule, 'title', e.target.value)}
                            placeholder="Modul címe"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="module-description">Modul leírása</Label>
                          <Textarea
                            id="module-description"
                            value={modules[activeModule].description}
                            onChange={(e) => updateModule(activeModule, 'description', e.target.value)}
                            placeholder="Mit fog megtanulni a diák ebben a modulban?"
                            rows={4}
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="lessons" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Leckék</h3>
                          <Button size="sm" onClick={() => addLesson(activeModule)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Új lecke
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {modules[activeModule].lessons.map((lesson, lessonIndex) => (
                            <Card key={lessonIndex} className="border">
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">Lecke {lessonIndex + 1}</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteLesson(activeModule, lessonIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <Input
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(activeModule, lessonIndex, 'title', e.target.value)}
                                  placeholder="Lecke címe"
                                />
                                <Textarea
                                  value={lesson.description}
                                  onChange={(e) => updateLesson(activeModule, lessonIndex, 'description', e.target.value)}
                                  placeholder="Lecke leírása"
                                  rows={2}
                                />
                                <Textarea
                                  value={lesson.content}
                                  onChange={(e) => updateLesson(activeModule, lessonIndex, 'content', e.target.value)}
                                  placeholder="Lecke tartalma..."
                                  rows={4}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label>Időtartam (perc)</Label>
                                    <Input
                                      type="number"
                                      value={lesson.estimatedDuration}
                                      onChange={(e) => updateLesson(activeModule, lessonIndex, 'estimatedDuration', parseInt(e.target.value) || 0)}
                                      min="1"
                                    />
                                  </div>
                                  <div>
                                    <Label>Típus</Label>
                                    <select
                                      value={lesson.type}
                                      onChange={(e) => updateLesson(activeModule, lessonIndex, 'type', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                      <option value="text">Szöveg</option>
                                      <option value="video">Videó</option>
                                      <option value="quiz">Kvíz</option>
                                    </select>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          
                          {modules[activeModule].lessons.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                              <p>Még nincsenek leckék ebben a modulban</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Válasszon ki egy modult a szerkesztéshez</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}