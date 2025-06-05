import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { QuizManager } from '@/components/QuizManager';
import { 
  FileText, 
  Video, 
  HelpCircle,
  Edit3,
  Trash2,
  Plus,
  Save,
  X
} from 'lucide-react';

interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  description: string;
  content: string;
  type: string;
  duration: number;
  orderIndex: number;
  videoUrl?: string;
  fileUrl?: string;
}

interface Quiz {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  instructions: string;
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
  isActive: boolean;
  showCorrectAnswers: boolean;
  shuffleQuestions: boolean;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: number;
  quizId: number;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  question: string;
  correctAnswer: string;
  options?: string[];
  points: number;
  orderIndex: number;
}

interface LessonEditorProps {
  lesson: Lesson;
  onClose: () => void;
  onSave: (lesson: Lesson) => void;
}

export function LessonEditor({ lesson, onClose, onSave }: LessonEditorProps) {
  const [editedLesson, setEditedLesson] = useState<Lesson>(lesson);
  const [activeTab, setActiveTab] = useState('content');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveLesson = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('PUT', `/api/lessons/${lesson.id}`, editedLesson);
      const updatedLesson = await response.json();
      onSave(updatedLesson);
      toast({
        title: "Lecke mentve",
        description: "A lecke sikeresen frissítve.",
      });
    } catch (error) {
      toast({
        title: "Hiba",
        description: "Nem sikerült menteni a leckét.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };



  const handleDeleteLesson = async () => {
    if (!confirm(`Biztosan törli a "${lesson.title}" leckét? Ez a művelet nem visszavonható és minden kapcsolódó kvíz is törlődik.`)) {
      return;
    }

    try {
      setIsLoading(true);
      await apiRequest('DELETE', `/api/lessons/${lesson.id}`);
      toast({
        title: "Lecke törölve",
        description: "A lecke sikeresen törölve.",
      });
      onClose(); // Close the dialog
      // Trigger parent component refresh by calling onSave with null to indicate deletion
      if (onSave) {
        onSave(null as any);
      }
    } catch (error) {
      toast({
        title: "Hiba",
        description: "Nem sikerült törölni a leckét.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      text: 'bg-blue-100 text-blue-800',
      video: 'bg-purple-100 text-purple-800',
      quiz: 'bg-green-100 text-green-800',
      assignment: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || colors.text;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(editedLesson.type)}
            Lecke szerkesztése: {editedLesson.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Tartalom</TabsTrigger>
            <TabsTrigger value="quizzes">Kvízek</TabsTrigger>
            <TabsTrigger value="settings">Beállítások</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Cím</Label>
                <Input
                  id="title"
                  value={editedLesson.title}
                  onChange={(e) => setEditedLesson({ ...editedLesson, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="type">Típus</Label>
                <Select
                  value={editedLesson.type}
                  onValueChange={(value) => setEditedLesson({ ...editedLesson, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Szöveges lecke</SelectItem>
                    <SelectItem value="video">Videó lecke</SelectItem>
                    <SelectItem value="quiz">Kvíz</SelectItem>
                    <SelectItem value="assignment">Feladat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Leírás</Label>
              <Textarea
                id="description"
                value={editedLesson.description}
                onChange={(e) => setEditedLesson({ ...editedLesson, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content">Tartalom</Label>
              <Textarea
                id="content"
                value={editedLesson.content}
                onChange={(e) => setEditedLesson({ ...editedLesson, content: e.target.value })}
                rows={8}
                placeholder="A lecke tartalmát ide írhatja..."
              />
            </div>

            {editedLesson.type === 'video' && (
              <div>
                <Label htmlFor="videoUrl">Videó URL</Label>
                <Input
                  id="videoUrl"
                  value={editedLesson.videoUrl || ''}
                  onChange={(e) => setEditedLesson({ ...editedLesson, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4">
            <QuizManager lessonId={lesson.id} lessonType={lesson.type} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Időtartam (perc)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={editedLesson.duration}
                  onChange={(e) => setEditedLesson({ ...editedLesson, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="orderIndex">Sorrend</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  value={editedLesson.orderIndex}
                  onChange={(e) => setEditedLesson({ ...editedLesson, orderIndex: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Badge className={getTypeBadge(editedLesson.type)}>
                {editedLesson.type}
              </Badge>
              <span className="text-sm text-gray-600">
                Lecke típusa: {editedLesson.type}
              </span>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button 
            variant="destructive" 
            onClick={handleDeleteLesson}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Lecke törlése
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Mégse
            </Button>
            <Button onClick={handleSaveLesson} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Mentés...' : 'Mentés'}
            </Button>
          </div>
        </div>
      </DialogContent>


    </Dialog>
  );
}