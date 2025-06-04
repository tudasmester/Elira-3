import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AdminGuard } from '@/components/AdminGuard';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Book, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  FileText, 
  Video, 
  Users, 
  Award, 
  HelpCircle,
  Eye,
  Settings,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Sparkles,
  Import,
  Link,
  ClipboardList,
  BookOpen,
  X
} from 'lucide-react';

interface Module {
  id?: number;
  title: string;
  description?: string;
  status: 'piszkozat' | 'hamarosan' | 'ingyenes' | 'fizetos';
  orderIndex: number;
  lessons?: Lesson[];
}

interface Lesson {
  id?: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'live_session';
  duration?: number;
  order: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
}

export default function CourseOutlineBuilder() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  
  // Module creation modal state
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [moduleStatus, setModuleStatus] = useState<'piszkozat' | 'hamarosan' | 'ingyenes' | 'fizetos'>('piszkozat');
  const [isCreatingModule, setIsCreatingModule] = useState(false);

  // Module editing state
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isEditModuleOpen, setIsEditModuleOpen] = useState(false);
  const [editModuleTitle, setEditModuleTitle] = useState('');
  const [editModuleDescription, setEditModuleDescription] = useState('');
  const [editModuleStatus, setEditModuleStatus] = useState<'piszkozat' | 'hamarosan' | 'ingyenes' | 'fizetos'>('piszkozat');
  const [isUpdatingModule, setIsUpdatingModule] = useState(false);

  // Activity creation state
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedActivityType, setSelectedActivityType] = useState<string>('');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [activityContent, setActivityContent] = useState('');
  const [activityVideoUrl, setActivityVideoUrl] = useState('');
  const [activityDuration, setActivityDuration] = useState(30);
  const [activityVideoEmbedCode, setActivityVideoEmbedCode] = useState('');
  const [activityVideoFile, setActivityVideoFile] = useState<File | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);

  // Lesson editing state
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonDescription, setEditLessonDescription] = useState('');
  const [editLessonContent, setEditLessonContent] = useState('');
  const [editLessonVideoUrl, setEditLessonVideoUrl] = useState('');
  const [editLessonVideoEmbedCode, setEditLessonVideoEmbedCode] = useState('');
  const [editLessonVideoFile, setEditLessonVideoFile] = useState<File | null>(null);
  const [editLessonDuration, setEditLessonDuration] = useState(30);
  const [isUpdatingLesson, setIsUpdatingLesson] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      setIsLoading(true);
      
      // Load course info
      const courseResponse = await apiRequest('GET', `/api/admin/courses/${id}`);
      const courseData = await courseResponse.json();
      setCourse(courseData);
      
      // Load modules
      const modulesResponse = await apiRequest('GET', `/api/admin/courses/${id}/modules`);
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

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim()) {
      toast({
        title: "Hiányzó adat",
        description: "Kérjük, adja meg a modul címét.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreatingModule(true);
      
      const moduleData = {
        title: newModuleTitle.trim(),
        description: newModuleDescription.trim() || null,
        status: moduleStatus
      };

      const response = await apiRequest('POST', `/api/courses/${id}/modules`, moduleData);
      const newModule = await response.json();
      
      setModules(prev => [...prev, newModule]);
      setNewModuleTitle('');
      setNewModuleDescription('');
      setModuleStatus('piszkozat');
      setIsAddModuleOpen(false);
      
      toast({
        title: "Modul létrehozva",
        description: `A "${newModuleTitle}" modul sikeresen létrejött.`
      });
      
    } catch (error) {
      console.error('Error creating module:', error);
      toast({
        title: "Hiba történt",
        description: "A modul létrehozása nem sikerült.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingModule(false);
    }
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setEditModuleTitle(module.title);
    setEditModuleDescription(module.description || '');
    setEditModuleStatus(module.status);
    setIsEditModuleOpen(true);
  };

  const handleUpdateModule = async () => {
    if (!editModuleTitle.trim() || !editingModule) {
      toast({
        title: "Hiányzó adat",
        description: "Kérjük, adja meg a modul címét.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUpdatingModule(true);
      
      const updateData = {
        title: editModuleTitle.trim(),
        description: editModuleDescription.trim() || null,
        status: editModuleStatus
      };

      const response = await apiRequest('PUT', `/api/modules/${editingModule.id}`, updateData);
      const updatedModule = await response.json();
      
      setModules(prev => prev.map(module => 
        module.id === editingModule.id ? updatedModule : module
      ));
      
      setIsEditModuleOpen(false);
      setEditingModule(null);
      
      toast({
        title: "Modul frissítve",
        description: `A "${editModuleTitle}" modul sikeresen frissült.`
      });
      
    } catch (error) {
      console.error('Error updating module:', error);
      toast({
        title: "Hiba történt",
        description: "A modul frissítése nem sikerült.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingModule(false);
    }
  };

  const handleDeleteModule = async (module: Module) => {
    if (!confirm(`Biztosan törölni szeretné a "${module.title}" modult?`)) {
      return;
    }

    try {
      await apiRequest('DELETE', `/api/modules/${module.id}`);
      setModules(prev => prev.filter(m => m.id !== module.id));
      
      toast({
        title: "Modul törölve",
        description: `A "${module.title}" modul sikeresen törölve.`
      });
      
    } catch (error) {
      console.error('Error deleting module:', error);
      toast({
        title: "Hiba történt",
        description: "A modul törlése nem sikerült.",
        variant: "destructive"
      });
    }
  };

  const handleAddActivity = (module: Module, activityType: string) => {
    setSelectedModule(module);
    setSelectedActivityType(activityType);
    setActivityTitle('');
    setActivityDescription('');
    setActivityContent('');
    setActivityVideoUrl('');
    setActivityVideoEmbedCode('');
    setActivityVideoFile(null);
    setActivityDuration(30);
    setUploadProgress(0);
    setIsAddActivityOpen(true);
  };

  const handleVideoFileUpload = async (file: File) => {
    setIsUploadingVideo(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('video', file);

      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/upload/video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Video upload failed');
      }

      const result = await response.json();
      setActivityVideoUrl(result.videoUrl);
      setUploadProgress(100);
      
      toast({
        title: "Videó feltöltve",
        description: `A videó sikeresen feltöltve: ${result.originalName}`
      });
      
      return result.videoUrl;
    } catch (error) {
      console.error('Video upload error:', error);
      toast({
        title: "Feltöltési hiba",
        description: "A videó feltöltése nem sikerült.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleCreateActivity = async () => {
    if (!activityTitle.trim() || !selectedModule) {
      toast({
        title: "Hiányzó adat",
        description: "Kérjük, adja meg az aktivitás címét.",
        variant: "destructive"
      });
      return;
    }

    // Validate specific activity type requirements
    if (selectedActivityType === 'video' && !activityVideoUrl.trim() && !activityVideoEmbedCode.trim() && !activityVideoFile) {
      toast({
        title: "Hiányzó videó",
        description: "Kérjük, adja meg a videó URL-jét, embed kódját, vagy töltsön fel egy videó fájlt.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreatingActivity(true);
      
      // Handle video file upload if a file is selected
      let finalVideoUrl = activityVideoUrl.trim() || null;
      if (selectedActivityType === 'video' && activityVideoFile && !finalVideoUrl) {
        try {
          finalVideoUrl = await handleVideoFileUpload(activityVideoFile);
        } catch (error) {
          setIsCreatingActivity(false);
          return;
        }
      }
      
      const activityData = {
        title: activityTitle.trim(),
        description: activityDescription.trim() || null,
        content: activityContent.trim() || '',
        videoUrl: selectedActivityType === 'video' ? finalVideoUrl : null,
        videoEmbedCode: selectedActivityType === 'video' ? activityVideoEmbedCode.trim() || null : null,
        estimatedDuration: activityDuration,
        moduleId: selectedModule.id,
        order: (selectedModule.lessons?.length || 0) + 1
      };

      const response = await apiRequest('POST', `/api/modules/${selectedModule.id}/lessons`, activityData);
      const newActivity = await response.json();
      
      // Update modules to include new activity
      setModules(prev => prev.map(module => {
        if (module.id === selectedModule.id) {
          return {
            ...module,
            lessons: [...(module.lessons || []), newActivity]
          };
        }
        return module;
      }));
      
      // Reset form
      setIsAddActivityOpen(false);
      setActivityTitle('');
      setActivityDescription('');
      setActivityContent('');
      setActivityVideoUrl('');
      setActivityVideoEmbedCode('');
      setActivityDuration(30);
      
      toast({
        title: "Aktivitás létrehozva",
        description: `Az "${activityTitle}" aktivitás sikeresen létrejött.`
      });
      
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({
        title: "Hiba történt",
        description: "Az aktivitás létrehozása nem sikerült.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingActivity(false);
    }
  };

  const toggleModuleExpansion = (moduleIndex: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleIndex)) {
      newExpanded.delete(moduleIndex);
    } else {
      newExpanded.add(moduleIndex);
    }
    setExpandedModules(newExpanded);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditLessonTitle(lesson.title);
    setEditLessonDescription(''); // Will be fetched from API
    setEditLessonContent(''); // Will be fetched from API
    setEditLessonVideoUrl(''); // Will be fetched from API
    setEditLessonVideoEmbedCode(''); // Will be fetched from API
    setEditLessonVideoFile(null);
    setEditLessonDuration(lesson.duration || 30);
    setIsEditLessonOpen(true);
    
    // Load full lesson data
    loadLessonData(lesson.id!);
  };

  const loadLessonData = async (lessonId: number) => {
    try {
      const response = await apiRequest('GET', `/api/lessons/${lessonId}`);
      const lessonData = await response.json();
      
      setEditLessonTitle(lessonData.title || '');
      setEditLessonDescription(lessonData.description || '');
      setEditLessonContent(lessonData.content || '');
      setEditLessonVideoUrl(lessonData.videoUrl || '');
      setEditLessonVideoEmbedCode(lessonData.videoEmbedCode || '');
      setEditLessonDuration(lessonData.estimatedDuration || 30);
    } catch (error) {
      console.error('Error loading lesson data:', error);
      toast({
        title: "Hiba",
        description: "A lecke adatainak betöltése nem sikerült.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateLesson = async () => {
    if (!editLessonTitle.trim() || !editingLesson) {
      toast({
        title: "Hiányzó adat",
        description: "Kérjük, adja meg a lecke címét.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUpdatingLesson(true);
      
      // Handle video file upload if a new file is selected
      let finalVideoUrl = editLessonVideoUrl.trim() || null;
      if (editingLesson.type === 'video' && editLessonVideoFile && !finalVideoUrl) {
        try {
          finalVideoUrl = await handleVideoFileUpload(editLessonVideoFile);
        } catch (error) {
          setIsUpdatingLesson(false);
          return;
        }
      }
      
      const updateData = {
        title: editLessonTitle.trim(),
        description: editLessonDescription.trim() || null,
        content: editLessonContent.trim() || '',
        videoUrl: editingLesson.type === 'video' ? finalVideoUrl : null,
        videoEmbedCode: editingLesson.type === 'video' ? editLessonVideoEmbedCode.trim() || null : null,
        estimatedDuration: editLessonDuration
      };

      const response = await apiRequest('PUT', `/api/lessons/${editingLesson.id}`, updateData);
      const updatedLesson = await response.json();
      
      // Update modules to reflect changes
      setModules(prev => prev.map(module => ({
        ...module,
        lessons: module.lessons?.map(lesson => 
          lesson.id === editingLesson.id 
            ? { ...lesson, ...updatedLesson }
            : lesson
        )
      })));
      
      // Reset form
      setIsEditLessonOpen(false);
      setEditingLesson(null);
      resetEditLessonForm();
      
      toast({
        title: "Lecke frissítve",
        description: `A "${editLessonTitle}" lecke sikeresen frissítve.`
      });
      
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast({
        title: "Hiba történt",
        description: "A lecke frissítése nem sikerült.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingLesson(false);
    }
  };

  const resetEditLessonForm = () => {
    setEditLessonTitle('');
    setEditLessonDescription('');
    setEditLessonContent('');
    setEditLessonVideoUrl('');
    setEditLessonVideoEmbedCode('');
    setEditLessonVideoFile(null);
    setEditLessonDuration(30);
  };

  const addActivityOptions = [
    { icon: Video, label: 'Videó', type: 'video', color: 'bg-blue-500' },
    { icon: FileText, label: 'Szöveg/PDF', type: 'text', color: 'bg-green-500' },
    { icon: HelpCircle, label: 'Quiz', type: 'quiz', color: 'bg-purple-500' },
    { icon: Users, label: 'Élő session', type: 'live_session', color: 'bg-orange-500' },
    { icon: ClipboardList, label: 'Feladat', type: 'assignment', color: 'bg-red-500' },
  ];

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Kurzus adatok betöltése...</p>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course outline</h1>
              <p className="text-gray-600 mt-1">
                Develop your course outline and contents and set up the drip feed to schedule lesson delivery.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Drip Feed
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-6">
          {modules.map((module, moduleIndex) => (
            <Card key={module.id || moduleIndex} className="mb-6 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleModuleExpansion(moduleIndex)}
                      className="mt-1 p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedModules.has(moduleIndex) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Edit3 className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{String(moduleIndex + 1).padStart(2, '0')}</h3>
                          <Badge 
                            variant={
                              module.status === 'piszkozat' ? 'secondary' :
                              module.status === 'hamarosan' ? 'outline' :
                              module.status === 'ingyenes' ? 'default' :
                              'destructive'
                            }
                            className={`text-xs ${
                              module.status === 'piszkozat' ? 'bg-gray-100 text-gray-600' :
                              module.status === 'hamarosan' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                              module.status === 'ingyenes' ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {module.status === 'piszkozat' ? 'Piszkozat' :
                             module.status === 'hamarosan' ? 'Hamarosan' :
                             module.status === 'ingyenes' ? 'Ingyenes' :
                             'Fizetős'}
                          </Badge>
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-semibold text-gray-900 mb-1">
                        {module.title}
                      </h4>
                      {module.description && (
                        <p className="text-gray-600 text-sm">{module.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditModule(module)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Modul szerkesztése
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteModule(module)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Modul törlése
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {expandedModules.has(moduleIndex) && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4">
                    {/* Activity buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {addActivityOptions.map((option) => (
                        <Button
                          key={option.type}
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => handleAddActivity(module, option.type)}
                        >
                          <option.icon className="h-3 w-3 mr-1" />
                          Add {option.label.toLowerCase()}
                        </Button>
                      ))}
                      <Button variant="outline" size="sm" className="h-8">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload activity
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <Import className="h-3 w-3 mr-1" />
                        Import activity
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-purple-600 border-purple-200">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Create activity with AI
                      </Button>
                    </div>

                    {/* Existing activities */}
                    {module.lessons && module.lessons.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id || lessonIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                              addActivityOptions.find(opt => opt.type === lesson.type)?.color || 'bg-gray-500'
                            }`}>
                              {React.createElement(
                                addActivityOptions.find(opt => opt.type === lesson.type)?.icon || FileText,
                                { className: "h-4 w-4" }
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                              <p className="text-sm text-gray-600">
                                {addActivityOptions.find(opt => opt.type === lesson.type)?.label || 'Ismeretlen típus'}
                                {lesson.duration && ` • ${lesson.duration} perc`}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleEditLesson(lesson)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add section area */}
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Plus className="h-4 w-4 mr-1" />
                          Add section
                        </Button>
                        <span>or</span>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload section
                        </Button>
                        <span>or</span>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Import className="h-4 w-4 mr-1" />
                          Import section
                        </Button>
                        <span>or</span>
                        <Button variant="ghost" size="sm" className="text-purple-600">
                          <Sparkles className="h-4 w-4 mr-1" />
                          Create section with AI
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {/* Add new module button */}
          <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
            <DialogTrigger asChild>
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Új modul hozzáadása</p>
                    <p className="text-sm text-gray-500">Kattintson ide új modul létrehozásához</p>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Új modul létrehozása</DialogTitle>
                <DialogDescription>
                  Hozzon létre egy új modult a kurzushoz. A modulok segítenek a tartalom strukturálásában.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="module-title">Modul címe *</Label>
                  <Input
                    id="module-title"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="pl. Bevezetés a témába"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="module-description">Modul leírása</Label>
                  <Textarea
                    id="module-description"
                    value={newModuleDescription}
                    onChange={(e) => setNewModuleDescription(e.target.value)}
                    placeholder="Rövid leírás a modulról..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="module-status">Modul státusza *</Label>
                  <Select value={moduleStatus} onValueChange={(value: 'piszkozat' | 'hamarosan' | 'ingyenes' | 'fizetos') => setModuleStatus(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Válasszon státuszt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piszkozat">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          Piszkozat
                        </div>
                      </SelectItem>
                      <SelectItem value="hamarosan">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          Hamarosan
                        </div>
                      </SelectItem>
                      <SelectItem value="ingyenes">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          Ingyenes
                        </div>
                      </SelectItem>
                      <SelectItem value="fizetos">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          Fizetős
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsAddModuleOpen(false)}
                  disabled={isCreatingModule}
                >
                  Mégse
                </Button>
                <Button 
                  onClick={handleCreateModule}
                  disabled={isCreatingModule || !newModuleTitle.trim()}
                >
                  {isCreatingModule ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Létrehozás...
                    </>
                  ) : (
                    'Modul létrehozása'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Module Edit Dialog */}
          <Dialog open={isEditModuleOpen} onOpenChange={setIsEditModuleOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Modul szerkesztése</DialogTitle>
                <DialogDescription>
                  Módosítsa a modul tulajdonságait. A változtatások azonnal érvényesülnek.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-module-title">Modul címe *</Label>
                  <Input
                    id="edit-module-title"
                    value={editModuleTitle}
                    onChange={(e) => setEditModuleTitle(e.target.value)}
                    placeholder="pl. Bevezetés a témába"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-module-description">Modul leírása</Label>
                  <Textarea
                    id="edit-module-description"
                    value={editModuleDescription}
                    onChange={(e) => setEditModuleDescription(e.target.value)}
                    placeholder="Rövid leírás a modulról..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-module-status">Modul állapota</Label>
                  <Select value={editModuleStatus} onValueChange={(value: 'piszkozat' | 'hamarosan' | 'ingyenes' | 'fizetos') => setEditModuleStatus(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piszkozat">Piszkozat</SelectItem>
                      <SelectItem value="hamarosan">Hamarosan</SelectItem>
                      <SelectItem value="ingyenes">Ingyenes</SelectItem>
                      <SelectItem value="fizetos">Fizetős</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModuleOpen(false)}
                  disabled={isUpdatingModule}
                >
                  Mégse
                </Button>
                <Button 
                  onClick={handleUpdateModule}
                  disabled={isUpdatingModule || !editModuleTitle.trim()}
                >
                  {isUpdatingModule ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Frissítés...
                    </>
                  ) : (
                    'Modul frissítése'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Activity Creation Dialog */}
          <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {React.createElement(
                    addActivityOptions.find(opt => opt.type === selectedActivityType)?.icon || FileText,
                    { 
                      className: `h-5 w-5 ${addActivityOptions.find(opt => opt.type === selectedActivityType)?.color?.replace('bg-', 'text-') || 'text-gray-500'}` 
                    }
                  )}
                  Új {addActivityOptions.find(opt => opt.type === selectedActivityType)?.label} aktivitás
                </DialogTitle>
                <DialogDescription>
                  Hozzon létre egy új aktivitást a "{selectedModule?.title}" modulhoz.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="activity-title">Aktivitás címe *</Label>
                    <Input
                      id="activity-title"
                      value={activityTitle}
                      onChange={(e) => setActivityTitle(e.target.value)}
                      placeholder={`pl. ${
                        selectedActivityType === 'video' ? 'Bevezetővideó' : 
                        selectedActivityType === 'quiz' ? 'Ellenőrző kvíz' : 
                        selectedActivityType === 'text' ? 'Szöveges lecke' :
                        selectedActivityType === 'assignment' ? 'Házi feladat' :
                        'Új aktivitás'
                      }`}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="activity-description">Aktivitás leírása</Label>
                    <Textarea
                      id="activity-description"
                      value={activityDescription}
                      onChange={(e) => setActivityDescription(e.target.value)}
                      placeholder="Rövid leírás az aktivitásról..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="activity-duration">Becsült időtartam (perc)</Label>
                    <Input
                      id="activity-duration"
                      type="number"
                      min="1"
                      max="300"
                      value={activityDuration}
                      onChange={(e) => setActivityDuration(parseInt(e.target.value) || 30)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Activity Type Specific Fields */}
                {selectedActivityType === 'video' && (
                  <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Videó beállítások
                    </h4>
                    
                    {/* Video File Upload */}
                    <div>
                      <Label htmlFor="video-file">Videó fájl feltöltése</Label>
                      <div className="mt-1">
                        <input
                          id="video-file"
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/avi,video/mov,video/wmv"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setActivityVideoFile(file);
                              // Clear URL and embed code when file is selected
                              setActivityVideoUrl('');
                              setActivityVideoEmbedCode('');
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          disabled={isUploadingVideo}
                        />
                        {activityVideoFile && (
                          <div className="mt-2 flex items-center justify-between p-2 bg-white rounded border">
                            <span className="text-sm text-gray-700">{activityVideoFile.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setActivityVideoFile(null);
                                const fileInput = document.getElementById('video-file') as HTMLInputElement;
                                if (fileInput) fileInput.value = '';
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {isUploadingVideo && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Feltöltés folyamatban... {uploadProgress}%</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-600 mt-1">Támogatott formátumok: MP4, WebM, OGG, AVI, MOV, WMV (max. 500MB)</p>
                      </div>
                    </div>

                    <div className="text-center text-gray-500">vagy</div>
                    
                    <div>
                      <Label htmlFor="video-url">Videó URL</Label>
                      <Input
                        id="video-url"
                        value={activityVideoUrl}
                        onChange={(e) => {
                          setActivityVideoUrl(e.target.value);
                          // Clear file when URL is entered
                          if (e.target.value.trim()) {
                            setActivityVideoFile(null);
                            const fileInput = document.getElementById('video-file') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }
                        }}
                        placeholder="https://youtube.com/watch?v=... vagy https://vimeo.com/..."
                        className="mt-1"
                        disabled={!!activityVideoFile}
                      />
                      <p className="text-xs text-gray-600 mt-1">YouTube, Vimeo vagy közvetlen videó link</p>
                    </div>

                    <div className="text-center text-gray-500">vagy</div>

                    <div>
                      <Label htmlFor="video-embed">Beágyazási kód</Label>
                      <Textarea
                        id="video-embed"
                        value={activityVideoEmbedCode}
                        onChange={(e) => {
                          setActivityVideoEmbedCode(e.target.value);
                          // Clear file when embed code is entered
                          if (e.target.value.trim()) {
                            setActivityVideoFile(null);
                            const fileInput = document.getElementById('video-file') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }
                        }}
                        placeholder='<iframe src="..." width="560" height="315"></iframe>'
                        rows={3}
                        className="mt-1 font-mono text-sm"
                        disabled={!!activityVideoFile}
                      />
                      <p className="text-xs text-gray-600 mt-1">Teljes iframe embed kód</p>
                    </div>
                  </div>
                )}

                {selectedActivityType === 'text' && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Szöveges tartalom
                    </h4>
                    
                    <div>
                      <Label htmlFor="text-content">Lecke tartalma</Label>
                      <Textarea
                        id="text-content"
                        value={activityContent}
                        onChange={(e) => setActivityContent(e.target.value)}
                        placeholder="Írja be a lecke tartalmát... (Markdown formátum támogatott)"
                        rows={8}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-600 mt-1">Markdown formázás használható (**félkövér**, *dőlt*, stb.)</p>
                    </div>
                  </div>
                )}

                {selectedActivityType === 'assignment' && (
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Feladat beállítások
                    </h4>
                    
                    <div>
                      <Label htmlFor="assignment-instructions">Feladat leírása</Label>
                      <Textarea
                        id="assignment-instructions"
                        value={activityContent}
                        onChange={(e) => setActivityContent(e.target.value)}
                        placeholder="Adja meg a feladat részletes leírását, elvárásokat, értékelési szempontokat..."
                        rows={6}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {selectedActivityType === 'quiz' && (
                  <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Kvíz beállítások
                    </h4>
                    
                    <div>
                      <Label htmlFor="quiz-instructions">Kvíz utasítások</Label>
                      <Textarea
                        id="quiz-instructions"
                        value={activityContent}
                        onChange={(e) => setActivityContent(e.target.value)}
                        placeholder="Utasítások a kvíz kitöltéséhez..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        💡 A kvíz kérdéseit a lecke létrehozása után adhatja hozzá a részletes szerkesztőben.
                      </p>
                    </div>
                  </div>
                )}

                {selectedActivityType === 'live_session' && (
                  <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-900 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Élő session beállítások
                    </h4>
                    
                    <div>
                      <Label htmlFor="session-description">Session leírása</Label>
                      <Textarea
                        id="session-description"
                        value={activityContent}
                        onChange={(e) => setActivityContent(e.target.value)}
                        placeholder="Írja le a session témáját, célját és menetét..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div className="bg-orange-100 p-3 rounded-lg">
                      <p className="text-sm text-orange-800">
                        📅 Az élő session időpontját és részleteit később állíthatja be.
                      </p>
                    </div>
                  </div>
                )}

                {selectedActivityType === 'text' && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Szöveges tartalom
                    </h4>
                    
                    <div>
                      <Label htmlFor="text-content">Lecke tartalma</Label>
                      <Textarea
                        id="text-content"
                        value={activityContent}
                        onChange={(e) => setActivityContent(e.target.value)}
                        placeholder="Írja be a lecke tartalmát... (Markdown formátum támogatott)"
                        rows={8}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-600 mt-1">Markdown formázás használható (**félkövér**, *dőlt*, stb.)</p>
                    </div>
                  </div>
                )}

                {selectedActivityType === 'assignment' && (
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Feladat beállítások
                    </h4>
                    
                    <div>
                      <Label htmlFor="assignment-instructions">Feladat leírása</Label>
                      <Textarea
                        id="assignment-instructions"
                        value={activityContent}
                        onChange={(e) => setActivityContent(e.target.value)}
                        placeholder="Adja meg a feladat részletes leírását, elvárásokat, értékelési szempontokat..."
                        rows={6}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {selectedActivityType === 'quiz' && (
                  <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Kvíz beállítások
                    </h4>
                    
                    <div>
                      <Label htmlFor="quiz-instructions">Kvíz utasítások</Label>
                      <Textarea
                        id="quiz-instructions"
                        value={activityContent}
                        onChange={(e) => setActivityContent(e.target.value)}
                        placeholder="Utasítások a kvíz kitöltéséhez..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <BookOpen className="h-4 w-4 inline mr-1" />
                        A kvíz kérdések hozzáadása az aktivitás létrehozása után történik.
                      </p>
                    </div>
                  </div>
                )}

                {selectedActivityType === 'live_session' && (
                  <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-900 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Élő oktatás beállítások
                    </h4>
                    
                    <div>
                      <Label htmlFor="session-details">Részletek és menetrend</Label>
                      <Textarea
                        id="session-details"
                        value={activityContent}
                        onChange={(e) => setActivityContent(e.target.value)}
                        placeholder="Az élő oktatás részletei, témái, időpontja..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsAddActivityOpen(false)}
                  disabled={isCreatingActivity}
                >
                  Mégse
                </Button>
                <Button 
                  onClick={handleCreateActivity}
                  disabled={isCreatingActivity || !activityTitle.trim()}
                >
                  {isCreatingActivity ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Létrehozás...
                    </>
                  ) : (
                    'Aktivitás létrehozása'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Lesson Dialog */}
          <Dialog open={isEditLessonOpen} onOpenChange={setIsEditLessonOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Lecke szerkesztése</DialogTitle>
                <DialogDescription>
                  Módosítsa a lecke részleteit és tartalmát.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-lesson-title">Lecke címe *</Label>
                    <Input
                      id="edit-lesson-title"
                      value={editLessonTitle}
                      onChange={(e) => setEditLessonTitle(e.target.value)}
                      placeholder="pl. Bevezetővideó"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-lesson-duration">Becsült időtartam (perc)</Label>
                    <Input
                      id="edit-lesson-duration"
                      type="number"
                      min="1"
                      max="300"
                      value={editLessonDuration}
                      onChange={(e) => setEditLessonDuration(parseInt(e.target.value) || 30)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-lesson-description">Lecke leírása</Label>
                  <Textarea
                    id="edit-lesson-description"
                    value={editLessonDescription}
                    onChange={(e) => setEditLessonDescription(e.target.value)}
                    placeholder="Rövid leírás a lecke tartalmáról..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Video-specific fields */}
                {editingLesson?.type === 'video' && (
                  <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Videó beállítások
                    </h4>
                    
                    {/* Video File Upload */}
                    <div>
                      <Label htmlFor="edit-video-file">Új videó fájl feltöltése</Label>
                      <div className="mt-1">
                        <input
                          id="edit-video-file"
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/avi,video/mov,video/wmv"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setEditLessonVideoFile(file);
                              setEditLessonVideoUrl('');
                              setEditLessonVideoEmbedCode('');
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          disabled={isUploadingVideo}
                        />
                        {editLessonVideoFile && (
                          <div className="mt-2 flex items-center justify-between p-2 bg-white rounded border">
                            <span className="text-sm text-gray-700">{editLessonVideoFile.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditLessonVideoFile(null);
                                const fileInput = document.getElementById('edit-video-file') as HTMLInputElement;
                                if (fileInput) fileInput.value = '';
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {isUploadingVideo && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Feltöltés folyamatban... {uploadProgress}%</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-600 mt-1">Új videó fájl feltöltése (max. 500MB)</p>
                      </div>
                    </div>

                    <div className="text-center text-gray-500">vagy</div>
                    
                    <div>
                      <Label htmlFor="edit-video-url">Videó URL</Label>
                      <Input
                        id="edit-video-url"
                        value={editLessonVideoUrl}
                        onChange={(e) => {
                          setEditLessonVideoUrl(e.target.value);
                          if (e.target.value.trim()) {
                            setEditLessonVideoFile(null);
                            const fileInput = document.getElementById('edit-video-file') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }
                        }}
                        placeholder="https://youtube.com/watch?v=... vagy https://vimeo.com/..."
                        className="mt-1"
                        disabled={!!editLessonVideoFile}
                      />
                      <p className="text-xs text-gray-600 mt-1">YouTube, Vimeo vagy közvetlen videó link</p>
                    </div>

                    <div className="text-center text-gray-500">vagy</div>

                    <div>
                      <Label htmlFor="edit-video-embed">Beágyazási kód</Label>
                      <Textarea
                        id="edit-video-embed"
                        value={editLessonVideoEmbedCode}
                        onChange={(e) => {
                          setEditLessonVideoEmbedCode(e.target.value);
                          if (e.target.value.trim()) {
                            setEditLessonVideoFile(null);
                            const fileInput = document.getElementById('edit-video-file') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }
                        }}
                        placeholder='<iframe src="..." width="560" height="315"></iframe>'
                        rows={3}
                        className="mt-1 font-mono text-sm"
                        disabled={!!editLessonVideoFile}
                      />
                      <p className="text-xs text-gray-600 mt-1">HTML embed kód (iframe)</p>
                    </div>
                  </div>
                )}

                {/* Text content for non-video lessons */}
                {editingLesson?.type !== 'video' && (
                  <div>
                    <Label htmlFor="edit-lesson-content">Lecke tartalma</Label>
                    <Textarea
                      id="edit-lesson-content"
                      value={editLessonContent}
                      onChange={(e) => setEditLessonContent(e.target.value)}
                      placeholder="Írja be a lecke tartalmát..."
                      rows={8}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditLessonOpen(false);
                    setEditingLesson(null);
                    resetEditLessonForm();
                  }}
                >
                  Mégse
                </Button>
                <Button 
                  onClick={handleUpdateLesson}
                  disabled={isUpdatingLesson || !editLessonTitle.trim()}
                >
                  {isUpdatingLesson ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Frissítés...
                    </>
                  ) : (
                    'Lecke frissítése'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminGuard>
  );
}