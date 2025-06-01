import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { LessonEditor } from '@/components/admin/LessonEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  Clock,
  ArrowLeft,
  Eye
} from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  description?: string;
  content: string;
  videoUrl?: string;
  estimatedDuration: number;
  order: number;
  attachmentCount: number;
  quizCount: number;
  moduleId: number;
  createdAt: string;
  updatedAt: string;
}

interface Module {
  id: number;
  title: string;
  description?: string;
  courseId: number;
  order: number;
}

export default function AdminLessonManagementPage() {
  const { moduleId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);

  const moduleIdNum = moduleId ? parseInt(moduleId) : 0;

  // Fetch module data
  const { data: moduleData } = useQuery({
    queryKey: [`/api/modules/${moduleIdNum}`],
    enabled: !!moduleIdNum,
  });

  // Fetch lessons
  const { data: lessons = [], isLoading } = useQuery<Lesson[]>({
    queryKey: [`/api/modules/${moduleIdNum}/lessons`],
    enabled: !!moduleIdNum,
  });

  // Reorder lessons mutation
  const reorderMutation = useMutation({
    mutationFn: async (newOrder: { id: number; order: number }[]) => {
      await apiRequest('PUT', `/api/modules/${moduleIdNum}/lessons/reorder`, { lessons: newOrder });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/modules/${moduleIdNum}/lessons`] });
      toast({
        title: 'Lessons reordered',
        description: 'The lesson order has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Reorder failed',
        description: 'Failed to reorder lessons. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete lesson mutation
  const deleteMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      await apiRequest('DELETE', `/api/lessons/${lessonId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/modules/${moduleIdNum}/lessons`] });
      setLessonToDelete(null);
      toast({
        title: 'Lesson deleted',
        description: 'The lesson has been deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete lesson. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const newOrder = items.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    reorderMutation.mutate(newOrder);
  };

  // Handle lesson creation/edit
  const handleLessonSave = () => {
    setIsEditorOpen(false);
    setSelectedLesson(null);
    setIsCreating(false);
    queryClient.invalidateQueries({ queryKey: [`/api/modules/${moduleIdNum}/lessons`] });
  };

  const openCreateEditor = () => {
    setIsCreating(true);
    setSelectedLesson(null);
    setIsEditorOpen(true);
  };

  const openEditEditor = (lessonId: number) => {
    setIsCreating(false);
    setSelectedLesson(lessonId);
    setIsEditorOpen(true);
  };

  if (!moduleIdNum) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Invalid Module ID</h1>
            <p className="text-gray-600 mt-2">The module ID provided is not valid.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/admin/courses')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Lesson Management</h1>
              {moduleData && (
                <p className="text-muted-foreground">
                  Module: {moduleData.title}
                </p>
              )}
            </div>
          </div>
          <Button onClick={openCreateEditor} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Lesson
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessons.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Videos</CardTitle>
              <Video className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lessons.filter(l => l.videoUrl).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Quizzes</CardTitle>
              <HelpCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lessons.filter(l => l.quizCount > 0).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lessons.reduce((total, lesson) => total + lesson.estimatedDuration, 0)} min
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons List */}
        <Card>
          <CardHeader>
            <CardTitle>Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            {lessons.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first lesson to start building this module.
                </p>
                <Button onClick={openCreateEditor} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create First Lesson
                </Button>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="lessons">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {lessons
                        .sort((a, b) => a.order - b.order)
                        .map((lesson, index) => (
                          <Draggable key={lesson.id} draggableId={lesson.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`
                                  border rounded-lg p-4 bg-white transition-shadow
                                  ${snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-sm'}
                                `}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-medium">{lesson.title}</h3>
                                        <div className="flex gap-1">
                                          {lesson.videoUrl && (
                                            <Badge variant="secondary" className="text-xs">
                                              <Video className="w-3 h-3 mr-1" />
                                              Video
                                            </Badge>
                                          )}
                                          {lesson.attachmentCount > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                              <FileText className="w-3 h-3 mr-1" />
                                              {lesson.attachmentCount} files
                                            </Badge>
                                          )}
                                          {lesson.quizCount > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                              <HelpCircle className="w-3 h-3 mr-1" />
                                              {lesson.quizCount} quiz{lesson.quizCount !== 1 ? 'es' : ''}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      {lesson.description && (
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {lesson.description}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {lesson.estimatedDuration} min
                                        </span>
                                        <span>Lesson {lesson.order}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <Eye className="w-4 h-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                          <DialogTitle>{lesson.title}</DialogTitle>
                                          <DialogDescription>
                                            Preview of lesson content
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          {lesson.videoUrl && (
                                            <div className="aspect-video bg-gray-100 rounded">
                                              <video controls className="w-full h-full">
                                                <source src={lesson.videoUrl} />
                                              </video>
                                            </div>
                                          )}
                                          <div className="prose max-w-none">
                                            {lesson.content.split('\n').map((paragraph, idx) => (
                                              <p key={idx}>{paragraph}</p>
                                            ))}
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openEditEditor(lesson.id)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setLessonToDelete(lesson.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
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
              </DragDropContext>
            )}
          </CardContent>
        </Card>

        {/* Lesson Editor Dialog */}
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
            <div className="h-full overflow-y-auto">
              <LessonEditor
                moduleId={moduleIdNum}
                lessonId={isCreating ? undefined : selectedLesson || undefined}
                onSave={handleLessonSave}
                onCancel={() => setIsEditorOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!lessonToDelete} onOpenChange={() => setLessonToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this lesson? This action cannot be undone.
                All lesson content, attachments, and quizzes will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => lessonToDelete && deleteMutation.mutate(lessonToDelete)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}