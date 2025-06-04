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
import { LessonEditor } from '@/components/LessonEditor';
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

// Status configuration for four-tier system
const MODULE_STATUS_CONFIG = {
  piszkozat: {
    label: 'Piszkozat',
    description: 'Csak adminok látják',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: '📝',
    accessLevel: 'admin'
  },
  hamarosan: {
    label: 'Hamarosan',
    description: 'Felhasználók látják, de nem érhetik el',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: '🔜',
    accessLevel: 'preview'
  },
  ingyenes: {
    label: 'Ingyenes',
    description: 'Minden felhasználó elérheti',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: '🆓',
    accessLevel: 'free'
  },
  fizetos: {
    label: 'Fizetős',
    description: 'Csak előfizetők érhetik el',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: '💎',
    accessLevel: 'premium'
  }
};

// Activity type options with icons and colors
const addActivityOptions = [
  { type: 'video', label: 'Videó', icon: Video, color: 'bg-purple-500', description: 'Videó lecke vagy prezentáció' },
  { type: 'text', label: 'Szöveg', icon: FileText, color: 'bg-blue-500', description: 'Szöveges tartalom vagy cikk' },
  { type: 'quiz', label: 'Kvíz', icon: HelpCircle, color: 'bg-green-500', description: 'Interaktív kvíz kérdések' },
  { type: 'assignment', label: 'Feladat', icon: ClipboardList, color: 'bg-orange-500', description: 'Gyakorlati feladat vagy projekt' },
  { type: 'live_session', label: 'Élő óra', icon: Users, color: 'bg-red-500', description: 'Élő online foglalkozás' }
];

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

// Status Badge Component
const StatusBadge = ({ status }: { status: 'piszkozat' | 'hamarosan' | 'ingyenes' | 'fizetos' }) => {
  const config = MODULE_STATUS_CONFIG[status];
  return (
    <Badge 
      variant="outline" 
      className={`${config.color} border font-medium text-xs`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};

// Status Selector Component
const StatusSelector = ({ 
  value, 
  onChange, 
  className = "" 
}: { 
  value: 'piszkozat' | 'hamarosan' | 'ingyenes' | 'fizetos';
  onChange: (value: 'piszkozat' | 'hamarosan' | 'ingyenes' | 'fizetos') => void;
  className?: string;
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          <div className="flex items-center gap-2">
            <span>{MODULE_STATUS_CONFIG[value].icon}</span>
            <span>{MODULE_STATUS_CONFIG[value].label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(MODULE_STATUS_CONFIG).map(([key, config]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <span>{config.icon}</span>
              <div>
                <div className="font-medium">{config.label}</div>
                <div className="text-xs text-muted-foreground">{config.description}</div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

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

  // Lesson editing state with LessonEditor
  const [editingLesson, setEditingLesson] = useState<any | null>(null);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Load course basic info
      const courseResponse = await apiRequest('GET', `/api/admin/courses/${id}`);
      const courseData = await courseResponse.json();
      setCourse(courseData);

      // Load course modules with lessons
      const modulesResponse = await apiRequest('GET', `/api/admin/courses/${id}/modules`);
      const modulesData = await modulesResponse.json();
      setModules(modulesData);
      
      // Expand all modules by default
      const moduleIds = new Set(modulesData.map((m: Module, index: number) => index));
      setExpandedModules(moduleIds);
    } catch (error) {
      console.error('Error loading course data:', error);
      toast({
        title: "Hiba",
        description: "A kurzus adatainak betöltése nem sikerült.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) {
      toast({
        title: "Hiba",
        description: "A modul címe kötelező.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingModule(true);
    try {
      const response = await apiRequest('POST', `/api/courses/${id}/modules`, {
        title: newModuleTitle,
        description: newModuleDescription,
        status: moduleStatus,
        orderIndex: modules.length
      });

      if (response.ok) {
        const newModule = await response.json();
        setModules(prev => [...prev, newModule]);
        setIsAddModuleOpen(false);
        setNewModuleTitle('');
        setNewModuleDescription('');
        setModuleStatus('piszkozat');
        
        toast({
          title: "Sikeres!",
          description: "Az új modul sikeresen létrehozva."
        });
      } else {
        throw new Error('Failed to create module');
      }
    } catch (error) {
      console.error('Error creating module:', error);
      toast({
        title: "Hiba",
        description: "A modul létrehozása sikertelen.",
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
    if (!editingModule || !editModuleTitle.trim()) {
      toast({
        title: "Hiba",
        description: "A modul címe kötelező.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingModule(true);
    try {
      const response = await apiRequest('PUT', `/api/modules/${editingModule.id}`, {
        title: editModuleTitle,
        description: editModuleDescription,
        status: editModuleStatus
      });

      if (response.ok) {
        setModules(prev => prev.map(module => 
          module.id === editingModule.id 
            ? { ...module, title: editModuleTitle, description: editModuleDescription, status: editModuleStatus }
            : module
        ));
        setIsEditModuleOpen(false);
        setEditingModule(null);
        
        toast({
          title: "Sikeres!",
          description: "A modul sikeresen frissítve."
        });
      } else {
        throw new Error('Failed to update module');
      }
    } catch (error) {
      console.error('Error updating module:', error);
      toast({
        title: "Hiba",
        description: "A modul frissítése sikertelen.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingModule(false);
    }
  };

  const handleDeleteModule = async (module: Module) => {
    if (!confirm(`Biztosan törli a "${module.title}" modult? Ez a művelet nem visszavonható.`)) {
      return;
    }

    try {
      const response = await apiRequest('DELETE', `/api/modules/${module.id}`);
      
      if (response.ok) {
        setModules(prev => prev.filter(m => m.id !== module.id));
        toast({
          title: "Sikeres!",
          description: "A modul sikeresen törölve."
        });
      } else {
        throw new Error('Failed to delete module');
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      toast({
        title: "Hiba",
        description: "A modul törlése sikertelen.",
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
    setIsAddActivityOpen(true);
  };

  const handleCreateActivity = async () => {
    if (!selectedModule || !activityTitle.trim()) {
      toast({
        title: "Hiba",
        description: "Az aktivitás címe kötelező.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingActivity(true);
    try {
      let videoUrl = activityVideoUrl;
      
      // Upload video file if provided
      if (activityVideoFile) {
        videoUrl = await handleVideoFileUpload(activityVideoFile);
      }

      const lessonData = {
        moduleId: selectedModule.id,
        title: activityTitle,
        description: activityDescription,
        content: activityContent,
        type: selectedActivityType,
        duration: activityDuration,
        orderIndex: selectedModule.lessons?.length || 0,
        videoUrl: selectedActivityType === 'video' ? videoUrl : undefined,
        videoEmbedCode: selectedActivityType === 'video' ? activityVideoEmbedCode : undefined
      };

      const response = await apiRequest('POST', `/api/modules/${selectedModule.id}/lessons`, lessonData);

      if (response.ok) {
        const newLesson = await response.json();
        
        // Update modules state
        setModules(prev => prev.map(module => 
          module.id === selectedModule.id 
            ? { ...module, lessons: [...(module.lessons || []), newLesson] }
            : module
        ));

        setIsAddActivityOpen(false);
        
        toast({
          title: "Sikeres!",
          description: `Az új ${addActivityOptions.find(opt => opt.type === selectedActivityType)?.label} aktivitás sikeresen létrehozva.`
        });
      } else {
        throw new Error('Failed to create activity');
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({
        title: "Hiba",
        description: "Az aktivitás létrehozása sikertelen.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingActivity(false);
    }
  };

  const handleVideoFileUpload = async (file: File): Promise<string> => {
    // This is a placeholder for video upload functionality
    // In a real implementation, you would upload to a cloud service
    return URL.createObjectURL(file);
  };

  const handleEditLesson = async (lesson: Lesson) => {
    try {
      // Load full lesson data from API
      const response = await apiRequest('GET', `/api/lessons/${lesson.id}`);
      const lessonData = await response.json();
      setEditingLesson(lessonData);
    } catch (error) {
      console.error('Error loading lesson data:', error);
      toast({
        title: "Hiba",
        description: "A lecke adatainak betöltése nem sikerült.",
        variant: "destructive"
      });
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

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[50vh]">
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Kurzus nem található</h1>
            <p className="text-gray-600">A keresett kurzus nem található vagy nincs hozzá hozzáférése.</p>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Book className="h-8 w-8 text-primary" />
                {course.title}
              </h1>
              <p className="text-gray-600 mt-1">{course.description}</p>
            </div>
            
            <Button 
              onClick={() => setIsAddModuleOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Új modul
            </Button>
          </div>

          {/* Modules List */}
          <div className="space-y-4">
            {modules.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Még nincsenek modulok</h3>
                  <p className="text-gray-500 text-center mb-6 max-w-md">
                    Kezdje el a kurzus felépítését modulok hozzáadásával. Minden modul tartalmazhat különböző típusú aktivitásokat.
                  </p>
                  <Button onClick={() => setIsAddModuleOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Első modul létrehozása
                  </Button>
                </CardContent>
              </Card>
            ) : (
              modules.map((module, moduleIndex) => (
                <Card key={module.id || moduleIndex} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleModuleExpansion(moduleIndex)}
                          className="p-1 h-auto"
                        >
                          {expandedModules.has(moduleIndex) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <CardTitle className="text-lg">{module.title}</CardTitle>
                            <StatusBadge status={module.status} />
                          </div>
                          {module.description && (
                            <p className="text-sm text-gray-600">{module.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditModule(module)}>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Szerkesztés
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteModule(module)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Törlés
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedModules.has(moduleIndex) && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Activity List */}
                        {module.lessons && module.lessons.length > 0 ? (
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div 
                                key={lesson.id || lessonIndex} 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {React.createElement(
                                    addActivityOptions.find(opt => opt.type === lesson.type)?.icon || FileText,
                                    { 
                                      className: `h-4 w-4 ${addActivityOptions.find(opt => opt.type === lesson.type)?.color?.replace('bg-', 'text-') || 'text-gray-500'}` 
                                    }
                                  )}
                                  <div>
                                    <h4 className="font-medium text-sm">{lesson.title}</h4>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span>{addActivityOptions.find(opt => opt.type === lesson.type)?.label}</span>
                                      {lesson.duration && <span>{lesson.duration} perc</span>}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditLesson(lesson)}
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Még nincsenek aktivitások ebben a modulban</p>
                          </div>
                        )}
                        
                        {/* Add Activity Buttons */}
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                          {addActivityOptions.map((option) => (
                            <Button
                              key={option.type}
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddActivity(module, option.type)}
                              className="text-xs"
                            >
                              {React.createElement(option.icon, { className: "h-3 w-3 mr-1" })}
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* Add Module Dialog */}
          <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Új modul létrehozása</DialogTitle>
                <DialogDescription>
                  Hozzon létre egy új modult a kurzushoz. A modulok segítenek a tartalom szervezésében.
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
                  <Label>Modul státusza</Label>
                  <StatusSelector 
                    value={moduleStatus} 
                    onChange={setModuleStatus}
                    className="mt-1"
                  />
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
                  onClick={handleAddModule}
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

          {/* Edit Module Dialog */}
          <Dialog open={isEditModuleOpen} onOpenChange={setIsEditModuleOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Modul szerkesztése</DialogTitle>
                <DialogDescription>
                  Módosítsa a modul adatait és beállításait.
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
                  <Label>Modul státusza</Label>
                  <StatusSelector 
                    value={editModuleStatus} 
                    onChange={setEditModuleStatus}
                    className="mt-1"
                  />
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
                      <div className="mt-1 flex items-center gap-2">
                        <Input
                          id="video-file"
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            setActivityVideoFile(e.target.files?.[0] || null);
                            setActivityVideoUrl('');
                            setActivityVideoEmbedCode('');
                          }}
                          className="flex-1"
                        />
                        {activityVideoFile && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setActivityVideoFile(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      {activityVideoFile && (
                        <p className="text-xs text-gray-500 mt-1">
                          Kiválasztott fájl: {activityVideoFile.name}
                        </p>
                      )}
                    </div>

                    <div className="text-center text-sm text-gray-500 font-medium">
                      VAGY
                    </div>

                    {/* Video URL */}
                    <div>
                      <Label htmlFor="video-url">Videó URL</Label>
                      <Input
                        id="video-url"
                        value={activityVideoUrl}
                        onChange={(e) => {
                          setActivityVideoUrl(e.target.value);
                          setActivityVideoFile(null);
                        }}
                        placeholder="https://youtube.com/watch?v=..."
                        className="mt-1"
                      />
                      {activityVideoFile && (
                        <p className="text-xs text-orange-600 mt-1">
                          Figyelem: Videó fájl kiválasztva. Az URL használatához távolítsa el a fájlt.
                        </p>
                      )}
                    </div>

                    <div className="text-center text-sm text-gray-500 font-medium">
                      VAGY
                    </div>

                    {/* Embed Code */}
                    <div>
                      <Label htmlFor="video-embed">Beágyazási kód</Label>
                      <Textarea
                        id="video-embed"
                        value={activityVideoEmbedCode}
                        onChange={(e) => {
                          setActivityVideoEmbedCode(e.target.value);
                          setActivityVideoFile(null);
                        }}
                        placeholder='<iframe src="..." width="560" height="315"></iframe>'
                        rows={3}
                        className="mt-1 font-mono text-xs"
                      />
                      {activityVideoFile && (
                        <p className="text-xs text-orange-600 mt-1">
                          Figyelem: Videó fájl kiválasztva. A beágyazási kód használatához távolítsa el a fájlt.
                        </p>
                      )}
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
                      <Label htmlFor="text-content">Tartalom</Label>
                      <Textarea
                        id="text-content"
                        value={activityContent}
                        onChange={(e) => setActivityContent(e.target.value)}
                        placeholder="Írja ide a lecke szöveges tartalmát..."
                        rows={8}
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

          {/* Lesson Editor with Quiz Integration */}
          {editingLesson && (
            <LessonEditor
              lesson={editingLesson}
              onClose={() => setEditingLesson(null)}
              onSave={(updatedLesson) => {
                // Update lesson in the modules list
                setModules(prev => prev.map(module => ({
                  ...module,
                  lessons: module.lessons?.map(lesson => 
                    lesson.id === updatedLesson.id ? updatedLesson : lesson
                  ) || []
                })));
                setEditingLesson(null);
                loadCourseData(); // Refresh data
              }}
            />
          )}
        </div>
      </div>
    </AdminGuard>
  );
}