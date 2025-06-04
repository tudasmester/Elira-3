import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Link
} from 'lucide-react';

interface Module {
  id?: number;
  title: string;
  description?: string;
  status: 'draft' | 'published';
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
  const [isCreatingModule, setIsCreatingModule] = useState(false);

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
        status: 'draft' as const
      };

      const response = await apiRequest('POST', `/api/courses/${id}/modules`, moduleData);
      const newModule = await response.json();
      
      setModules(prev => [...prev, newModule]);
      setNewModuleTitle('');
      setNewModuleDescription('');
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

  const toggleModuleExpansion = (moduleIndex: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleIndex)) {
      newExpanded.delete(moduleIndex);
    } else {
      newExpanded.add(moduleIndex);
    }
    setExpandedModules(newExpanded);
  };

  const addActivityOptions = [
    { icon: Video, label: 'Videó', type: 'video', color: 'bg-blue-500' },
    { icon: FileText, label: 'Szöveg/PDF', type: 'text', color: 'bg-green-500' },
    { icon: HelpCircle, label: 'Quiz', type: 'quiz', color: 'bg-purple-500' },
    { icon: Users, label: 'Élő session', type: 'live_session', color: 'bg-orange-500' },
    { icon: Award, label: 'Feladat', type: 'assignment', color: 'bg-red-500' },
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
                          <Badge variant="secondary" className="text-xs">
                            {module.status === 'draft' ? 'Draft' : 'Published'}
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
                  
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
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
        </div>
      </div>
    </AdminGuard>
  );
}