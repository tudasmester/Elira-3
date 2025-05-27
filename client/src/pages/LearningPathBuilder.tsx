import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Plus, 
  GripVertical, 
  Target, 
  Clock, 
  Star,
  Save,
  Play,
  Trash2,
  Edit3
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  duration: string;
  level: string;
  category: string;
  imageUrl: string;
  description: string;
  rating: number;
}

interface LearningPathStep {
  id: string;
  courseId: string;
  course: Course;
  order: number;
  isCompleted: boolean;
  estimatedDuration: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  steps: LearningPathStep[];
  totalDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isPublic: boolean;
}

// Mock courses data - in real app this would come from API
const availableCourses: Course[] = [
  {
    id: 'course-1',
    title: 'JavaScript Alapok',
    duration: '4 hét',
    level: 'Kezdő',
    category: 'Programozás',
    imageUrl: '/api/placeholder/300/200',
    description: 'JavaScript programozás alapjai',
    rating: 4.8
  },
  {
    id: 'course-2', 
    title: 'React Fejlesztés',
    duration: '6 hét',
    level: 'Haladó',
    category: 'Programozás',
    imageUrl: '/api/placeholder/300/200',
    description: 'Modern React alkalmazások fejlesztése',
    rating: 4.9
  },
  {
    id: 'course-3',
    title: 'Node.js Backend',
    duration: '5 hét', 
    level: 'Középhaladó',
    category: 'Programozás',
    imageUrl: '/api/placeholder/300/200',
    description: 'Szerver oldali fejlesztés Node.js-sel',
    rating: 4.7
  },
  {
    id: 'course-4',
    title: 'Adatbázis Tervezés',
    duration: '3 hét',
    level: 'Középhaladó', 
    category: 'Adatbázis',
    imageUrl: '/api/placeholder/300/200',
    description: 'SQL és NoSQL adatbázisok tervezése',
    rating: 4.6
  }
];

export default function LearningPathBuilder() {
  const { toast } = useToast();
  const [learningPath, setLearningPath] = useState<LearningPath>({
    id: 'new-path',
    title: '',
    description: '',
    steps: [],
    totalDuration: '0 hét',
    difficulty: 'beginner',
    tags: [],
    isPublic: false
  });

  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = availableCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Moving course from available courses to learning path
    if (source.droppableId === 'available-courses' && destination.droppableId === 'learning-path') {
      const course = availableCourses.find(c => c.id === draggableId);
      if (!course) return;

      // Check if course already exists in path
      if (learningPath.steps.some(step => step.courseId === course.id)) {
        toast({
          title: "Kurzus már hozzáadva",
          description: "Ez a kurzus már szerepel a tanulási útvonalban",
          variant: "destructive"
        });
        return;
      }

      const newStep: LearningPathStep = {
        id: `step-${Date.now()}`,
        courseId: course.id,
        course,
        order: destination.index,
        isCompleted: false,
        estimatedDuration: course.duration
      };

      setLearningPath(prev => ({
        ...prev,
        steps: [
          ...prev.steps.slice(0, destination.index),
          newStep,
          ...prev.steps.slice(destination.index).map(step => ({
            ...step,
            order: step.order + 1
          }))
        ]
      }));

      toast({
        title: "Kurzus hozzáadva",
        description: `${course.title} sikeresen hozzáadva a tanulási útvonalhoz`,
      });
    }

    // Reordering within learning path
    if (source.droppableId === 'learning-path' && destination.droppableId === 'learning-path') {
      const newSteps = Array.from(learningPath.steps);
      const [reorderedStep] = newSteps.splice(source.index, 1);
      newSteps.splice(destination.index, 0, reorderedStep);

      // Update order values
      const updatedSteps = newSteps.map((step, index) => ({
        ...step,
        order: index
      }));

      setLearningPath(prev => ({
        ...prev,
        steps: updatedSteps
      }));
    }
  }, [learningPath.steps, toast]);

  const removeStep = (stepId: string) => {
    setLearningPath(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
        .map((step, index) => ({ ...step, order: index }))
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !learningPath.tags.includes(newTag.trim())) {
      setLearningPath(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setLearningPath(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const saveLearningPath = async () => {
    if (!learningPath.title.trim()) {
      toast({
        title: "Hiányzó cím",
        description: "Kérjük, adjon címet a tanulási útvonalnak",
        variant: "destructive"
      });
      return;
    }

    if (learningPath.steps.length === 0) {
      toast({
        title: "Nincs kurzus",
        description: "Adjon hozzá legalább egy kurzust a tanulási útvonalhoz",
        variant: "destructive"
      });
      return;
    }

    // Here you would save to API
    toast({
      title: "Tanulási útvonal mentve",
      description: `"${learningPath.title}" sikeresen mentve`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tanulási Útvonal Tervező
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Hozza létre személyre szabott tanulási útvonalát drag & drop segítségével
              </p>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Available Courses */}
            <div className="lg:col-span-1">
              <Card className="h-fit sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Elérhető Kurzusok
                  </CardTitle>
                  <Input
                    placeholder="Kurzus keresése..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-2"
                  />
                </CardHeader>
                <CardContent>
                  <Droppable droppableId="available-courses" isDropDisabled>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3"
                      >
                        {filteredCourses.map((course, index) => (
                          <Draggable
                            key={course.id}
                            draggableId={course.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-grab hover:border-blue-300 transition-all ${
                                  snapshot.isDragging ? 'rotate-3 shadow-lg scale-105' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <GripVertical className="h-5 w-5 text-slate-400 mt-1" />
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-sm mb-1">
                                      {course.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                      <Clock className="h-3 w-3" />
                                      {course.duration}
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      {course.rating}
                                    </div>
                                    <Badge variant="secondary" className="mt-2 text-xs">
                                      {course.level}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>

            {/* Learning Path Builder */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="space-y-4">
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="h-5 w-5" />
                      Tanulási Útvonal Részletei
                    </CardTitle>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Cím</label>
                        <Input
                          placeholder="Tanulási útvonal címe..."
                          value={learningPath.title}
                          onChange={(e) => setLearningPath(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nehézség</label>
                        <select
                          className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                          value={learningPath.difficulty}
                          onChange={(e) => setLearningPath(prev => ({ 
                            ...prev, 
                            difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                          }))}
                        >
                          <option value="beginner">Kezdő</option>
                          <option value="intermediate">Középhaladó</option>
                          <option value="advanced">Haladó</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Leírás</label>
                      <Textarea
                        placeholder="Írja le a tanulási útvonal célját és tartalmát..."
                        value={learningPath.description}
                        onChange={(e) => setLearningPath(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Címkék</label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder="Új címke..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          className="flex-1"
                        />
                        <Button onClick={addTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {learningPath.tags.map(tag => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer hover:bg-red-100"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Kurzusok Sorrendje</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Húzza át a kurzusokat a bal oldalról, vagy rendezze át őket a kívánt sorrendbe
                    </p>
                  </div>

                  <Droppable droppableId="learning-path">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-[200px] p-4 border-2 border-dashed rounded-lg transition-all ${
                          snapshot.isDraggingOver 
                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950' 
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {learningPath.steps.length === 0 ? (
                          <div className="text-center text-slate-500 py-12">
                            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg mb-2">Üres tanulási útvonal</p>
                            <p className="text-sm">Húzza át a kurzusokat ide a tanulási útvonal létrehozásához</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {learningPath.steps.map((step, index) => (
                              <Draggable
                                key={step.id}
                                draggableId={step.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`bg-white dark:bg-slate-800 p-4 rounded-lg border shadow-sm transition-all ${
                                      snapshot.isDragging ? 'shadow-lg scale-105' : ''
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="cursor-grab hover:cursor-grabbing"
                                        >
                                          <GripVertical className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                                          {index + 1}
                                        </div>
                                      </div>
                                      
                                      <div className="flex-1">
                                        <h4 className="font-semibold">{step.course.title}</h4>
                                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {step.course.duration}
                                          </div>
                                          <Badge variant="outline" className="text-xs">
                                            {step.course.level}
                                          </Badge>
                                          <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            {step.course.rating}
                                          </div>
                                        </div>
                                      </div>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeStep(step.id)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {learningPath.steps.length > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                            Tanulási Útvonal Összesítő
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            {learningPath.steps.length} kurzus • Becsült időtartam: {learningPath.steps.length * 4} hét
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveLearningPath} className="bg-gradient-to-r from-blue-500 to-indigo-600">
                            <Save className="h-4 w-4 mr-2" />
                            Mentés
                          </Button>
                          <Button variant="outline">
                            <Play className="h-4 w-4 mr-2" />
                            Előnézet
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}