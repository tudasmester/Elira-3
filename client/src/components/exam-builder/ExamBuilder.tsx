import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Settings, 
  Eye, 
  Save, 
  Send, 
  AlertTriangle,
  CheckCircle,
  Edit,
  Copy,
  Trash2,
  Clock,
  Users,
  Target,
  Type,
  Circle
} from 'lucide-react';

import { useExamBuilder } from '@/contexts/ExamBuilderContext';
import { ExamBuilderAPIService } from '@/services/examBuilderService';

interface ExamBuilderProps {
  courseId?: number;
  examId?: number;
}

// Simple Question Form Component
function SimpleQuestionForm({ onSave, onCancel }: { 
  onSave: (question: any) => void; 
  onCancel: () => void;
}) {
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [points, setPoints] = useState(1);

  const handleSave = () => {
    onSave({
      questionText,
      questionType,
      points,
      orderIndex: 1,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="questionText">Kérdés szövege</Label>
        <Textarea
          id="questionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Írd be a kérdést..."
        />
      </div>
      
      <div>
        <Label htmlFor="questionType">Kérdés típusa</Label>
        <Select value={questionType} onValueChange={setQuestionType}>
          <SelectTrigger>
            <SelectValue placeholder="Válassz típust" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="multiple_choice">Feleletválasztós</SelectItem>
            <SelectItem value="true_false">Igaz/Hamis</SelectItem>
            <SelectItem value="short_text">Rövid szöveg</SelectItem>
            <SelectItem value="text_assignment">Szöveges feladat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="points">Pontszám</Label>
        <Input
          id="points"
          type="number"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
          min="1"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!questionText.trim()}>
          Mentés
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Mégse
        </Button>
      </div>
    </div>
  );
}

// Simple Question Card Component
function SimpleQuestionCard({ question, onEdit, onDelete }: {
  question: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'multiple_choice': 'Feleletválasztós',
      'true_false': 'Igaz/Hamis',
      'short_text': 'Rövid szöveg',
      'text_assignment': 'Szöveges feladat'
    };
    return labels[type] || type;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{question.questionText}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{getTypeLabel(question.questionType)}</Badge>
              <Badge variant="outline">{question.points || 1} pont</Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function ExamBuilder({ courseId, examId }: ExamBuilderProps) {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { state, dispatch } = useExamBuilder();
  
  const [showNewQuestionDialog, setShowNewQuestionDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [examTitle, setExamTitle] = useState('Új vizsga');
  const [examDescription, setExamDescription] = useState('');

  // Load exam data if examId is provided
  const { data: examData, isLoading } = useQuery({
    queryKey: ['/api/quiz-builder/exams', examId],
    enabled: !!examId,
  });

  // Mutations for CRUD operations
  const addQuestionMutation = useMutation({
    mutationFn: (questionData: any) => 
      ExamBuilderAPIService.addQuestion(examId || 1, questionData),
    onSuccess: (newQuestion) => {
      dispatch({ type: 'ADD_QUESTION', payload: newQuestion });
      setShowNewQuestionDialog(false);
      toast({
        title: "Siker",
        description: "Kérdés hozzáadva",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hiba",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: number) => 
      ExamBuilderAPIService.deleteQuestion(questionId),
    onSuccess: (_, questionId) => {
      dispatch({ type: 'DELETE_QUESTION', payload: questionId });
      toast({
        title: "Siker",
        description: "Kérdés törölve",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hiba",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateExamMutation = useMutation({
    mutationFn: (settings: any) => 
      ExamBuilderAPIService.updateExamSettings(examId || 1, settings),
    onSuccess: (updatedExam) => {
      dispatch({ type: 'SET_CURRENT_EXAM', payload: updatedExam });
      setShowSettingsDialog(false);
      toast({
        title: "Siker",
        description: "Vizsga beállítások mentve",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hiba",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddQuestion = (questionData: any) => {
    addQuestionMutation.mutate(questionData);
  };

  const handleDeleteQuestion = (questionId: number) => {
    deleteQuestionMutation.mutate(questionId);
  };

  const handleSaveExamSettings = () => {
    updateExamMutation.mutate({
      title: examTitle,
      description: examDescription,
      timeLimit: 60,
      attemptsAllowed: 1,
      passingScore: 70,
      examType: 'quiz',
      shuffleQuestions: false,
      showResults: true,
      showCorrectAnswers: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Vizsga betöltése...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{examTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {state.questions.length} kérdés
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Beállítások
          </Button>
          <Button>
            <Eye className="h-4 w-4 mr-2" />
            Előnézet
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Kérdések</CardTitle>
                <Button onClick={() => setShowNewQuestionDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Új kérdés
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {state.questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Még nincsenek kérdések</p>
                  <p className="text-sm">Kattints az "Új kérdés" gombra a kezdéshez</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.questions.map((question, index) => (
                    <SimpleQuestionCard
                      key={question.id}
                      question={question}
                      onEdit={() => dispatch({ type: 'SET_EDITING_QUESTION', payload: question })}
                      onDelete={() => handleDeleteQuestion(question.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Exam Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vizsga statisztikák</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Kérdések száma</span>
                <Badge>{state.questions.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Összpontszám</span>
                <Badge>{state.questions.reduce((sum, q) => sum + (q.points || 1), 0)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Becsült idő</span>
                <Badge>{Math.max(10, state.questions.length * 2)} perc</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gyors műveletek</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Copy className="h-4 w-4 mr-2" />
                Vizsga másolása
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Save className="h-4 w-4 mr-2" />
                Mentés sablonként
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Send className="h-4 w-4 mr-2" />
                Közzététel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Question Dialog */}
      <Dialog open={showNewQuestionDialog} onOpenChange={setShowNewQuestionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Új kérdés hozzáadása</DialogTitle>
          </DialogHeader>
          <SimpleQuestionForm
            onSave={handleAddQuestion}
            onCancel={() => setShowNewQuestionDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vizsga beállítások</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="examTitle">Vizsga címe</Label>
              <Input
                id="examTitle"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="examDescription">Leírás</Label>
              <Textarea
                id="examDescription"
                value={examDescription}
                onChange={(e) => setExamDescription(e.target.value)}
                placeholder="Vizsga leírása..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveExamSettings}>
                Mentés
              </Button>
              <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                Mégse
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}