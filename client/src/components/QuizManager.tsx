import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  HelpCircle, 
  Clock,
  Target,
  Users,
  Settings,
  CheckCircle,
  XCircle,
  Save
} from 'lucide-react';

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
  questionText: string;
  questionType: string;
  points: number;
  order: number;
  options?: QuizOption[];
}

interface QuizOption {
  id: number;
  questionId: number;
  optionText: string;
  isCorrect: boolean;
  order: number;
}

interface QuizManagerProps {
  lessonId: number;
  lessonType: string;
}

export function QuizManager({ lessonId, lessonType }: QuizManagerProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const { toast } = useToast();

  // Quiz form state
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    instructions: '',
    timeLimit: 30,
    passingScore: 70,
    maxAttempts: 3,
    isActive: true,
    showCorrectAnswers: true,
    shuffleQuestions: false
  });

  // Question form state
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    questionType: 'multiple_choice',
    points: 1,
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false }
    ]
  });

  useEffect(() => {
    fetchQuizzes();
  }, [lessonId]);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', `/api/lessons/${lessonId}/quizzes`);
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuiz = () => {
    setEditingQuiz(null);
    setQuizForm({
      title: '',
      description: '',
      instructions: '',
      timeLimit: 30,
      passingScore: 70,
      maxAttempts: 3,
      isActive: true,
      showCorrectAnswers: true,
      shuffleQuestions: false
    });
    setShowQuizEditor(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setQuizForm({
      title: quiz.title,
      description: quiz.description,
      instructions: quiz.instructions,
      timeLimit: quiz.timeLimit || 30,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      isActive: quiz.isActive,
      showCorrectAnswers: quiz.showCorrectAnswers,
      shuffleQuestions: quiz.shuffleQuestions
    });
    setShowQuizEditor(true);
  };

  const handleSaveQuiz = async () => {
    try {
      setIsLoading(true);
      const quizData = {
        ...quizForm,
        lessonId
      };

      if (editingQuiz) {
        await apiRequest('PUT', `/api/quizzes/${editingQuiz.id}`, quizData);
        toast({ title: "Kvíz frissítve", description: "A kvíz sikeresen frissítve." });
      } else {
        await apiRequest('POST', '/api/quizzes', quizData);
        toast({ title: "Kvíz létrehozva", description: "A kvíz sikeresen létrehozva." });
      }

      setShowQuizEditor(false);
      await fetchQuizzes();
    } catch (error) {
      toast({
        title: "Hiba",
        description: "Nem sikerült menteni a kvízt.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm('Biztosan törli ezt a kvízt? Ez a művelet nem visszavonható.')) {
      return;
    }

    try {
      setIsLoading(true);
      await apiRequest('DELETE', `/api/quizzes/${quizId}`);
      toast({ title: "Kvíz törölve", description: "A kvíz sikeresen törölve." });
      await fetchQuizzes();
    } catch (error) {
      toast({
        title: "Hiba",
        description: "Nem sikerült törölni a kvízt.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = (quiz: Quiz) => {
    setEditingQuestion(null);
    setQuestionForm({
      questionText: '',
      questionType: 'multiple_choice',
      points: 1,
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    });
    setShowQuestionEditor(true);
  };

  const handleSaveQuestion = async () => {
    try {
      setIsLoading(true);
      const questionData = {
        ...questionForm,
        quizId: editingQuiz?.id || quizzes[0]?.id
      };

      if (editingQuestion) {
        await apiRequest('PUT', `/api/quiz-questions/${editingQuestion.id}`, questionData);
        toast({ title: "Kérdés frissítve", description: "A kérdés sikeresen frissítve." });
      } else {
        await apiRequest('POST', '/api/quiz-questions', questionData);
        toast({ title: "Kérdés hozzáadva", description: "A kérdés sikeresen hozzáadva." });
      }

      setShowQuestionEditor(false);
      await fetchQuizzes();
    } catch (error) {
      toast({
        title: "Hiba",
        description: "Nem sikerült menteni a kérdést.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuestionOption = (index: number, field: string, value: any) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    // If setting as correct, uncheck others for single correct answer
    if (field === 'isCorrect' && value === true) {
      newOptions.forEach((option, i) => {
        if (i !== index) option.isCorrect = false;
      });
    }
    
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  if (lessonType !== 'quiz') {
    return (
      <div className="text-center py-8">
        <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">
          Kvízek csak kvíz típusú leckékhez adhatók hozzá.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Változtassa meg a lecke típusát "Kvíz"-re a Tartalom fülön.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Kvízek kezelése</h3>
        <Button onClick={handleCreateQuiz} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Új kvíz
        </Button>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
        </div>
      )}

      {quizzes.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <HelpCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center mb-4">
              Még nincsenek kvízek ehhez a leckéhez.
            </p>
            <Button onClick={handleCreateQuiz}>
              Első kvíz létrehozása
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {quiz.title}
                      <Badge variant={quiz.isActive ? "default" : "secondary"}>
                        {quiz.isActive ? "Aktív" : "Inaktív"}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuiz(quiz)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{quiz.timeLimit ? `${quiz.timeLimit} perc` : 'Nincs időkorlát'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-500" />
                    <span>{quiz.passingScore}% átmenő</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{quiz.maxAttempts} próbálkozás</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-gray-500" />
                    <span>{quiz.questions?.length || 0} kérdés</span>
                  </div>
                </div>
                
                {quiz.questions && quiz.questions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Kérdések:</h4>
                    <div className="space-y-2">
                      {quiz.questions.map((question, index) => (
                        <div key={question.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">
                            {index + 1}. {question.questionText.substring(0, 50)}...
                          </span>
                          <Badge variant="outline">{question.points} pont</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddQuestion(quiz)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Kérdés hozzáadása
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quiz Editor Dialog */}
      <Dialog open={showQuizEditor} onOpenChange={setShowQuizEditor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuiz ? 'Kvíz szerkesztése' : 'Új kvíz létrehozása'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="quiz-title">Kvíz címe *</Label>
              <Input
                id="quiz-title"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                placeholder="pl. Ellenőrző kvíz"
              />
            </div>
            
            <div>
              <Label htmlFor="quiz-description">Leírás</Label>
              <Textarea
                id="quiz-description"
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                placeholder="Rövid leírás a kvízről..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="quiz-instructions">Utasítások</Label>
              <Textarea
                id="quiz-instructions"
                value={quizForm.instructions}
                onChange={(e) => setQuizForm({ ...quizForm, instructions: e.target.value })}
                placeholder="Útmutató a diákoknak..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time-limit">Időkorlát (perc)</Label>
                <Input
                  id="time-limit"
                  type="number"
                  min="1"
                  max="180"
                  value={quizForm.timeLimit}
                  onChange={(e) => setQuizForm({ ...quizForm, timeLimit: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="passing-score">Átmenő pontszám (%)</Label>
                <Input
                  id="passing-score"
                  type="number"
                  min="1"
                  max="100"
                  value={quizForm.passingScore}
                  onChange={(e) => setQuizForm({ ...quizForm, passingScore: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max-attempts">Max próbálkozás</Label>
                <Input
                  id="max-attempts"
                  type="number"
                  min="1"
                  max="10"
                  value={quizForm.maxAttempts}
                  onChange={(e) => setQuizForm({ ...quizForm, maxAttempts: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="is-active">Kvíz aktív</Label>
                <Switch
                  id="is-active"
                  checked={quizForm.isActive}
                  onCheckedChange={(checked) => setQuizForm({ ...quizForm, isActive: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-answers">Helyes válaszok mutatása</Label>
                <Switch
                  id="show-answers"
                  checked={quizForm.showCorrectAnswers}
                  onCheckedChange={(checked) => setQuizForm({ ...quizForm, showCorrectAnswers: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="shuffle-questions">Kérdések keverése</Label>
                <Switch
                  id="shuffle-questions"
                  checked={quizForm.shuffleQuestions}
                  onCheckedChange={(checked) => setQuizForm({ ...quizForm, shuffleQuestions: checked })}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowQuizEditor(false)}>
              Mégse
            </Button>
            <Button onClick={handleSaveQuiz} disabled={!quizForm.title.trim()}>
              <Save className="h-4 w-4 mr-2" />
              {editingQuiz ? 'Frissítés' : 'Létrehozás'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Editor Dialog */}
      <Dialog open={showQuestionEditor} onOpenChange={setShowQuestionEditor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? 'Kérdés szerkesztése' : 'Új kérdés hozzáadása'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="question-text">Kérdés szövege *</Label>
              <Textarea
                id="question-text"
                value={questionForm.questionText}
                onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                placeholder="Írja be a kérdést..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="question-type">Kérdés típusa</Label>
                <Select
                  value={questionForm.questionType}
                  onValueChange={(value) => setQuestionForm({ ...questionForm, questionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Feleletválasztós</SelectItem>
                    <SelectItem value="true_false">Igaz/Hamis</SelectItem>
                    <SelectItem value="short_text">Rövid szöveges</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="question-points">Pontszám</Label>
                <Input
                  id="question-points"
                  type="number"
                  min="1"
                  max="10"
                  value={questionForm.points}
                  onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            {questionForm.questionType === 'multiple_choice' && (
              <div>
                <Label>Válaszlehetőségek</Label>
                <div className="space-y-2 mt-2">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-answer"
                        checked={option.isCorrect}
                        onChange={() => updateQuestionOption(index, 'isCorrect', true)}
                        className="h-4 w-4"
                      />
                      <Input
                        value={option.optionText}
                        onChange={(e) => updateQuestionOption(index, 'optionText', e.target.value)}
                        placeholder={`${String.fromCharCode(65 + index)} opció`}
                        className="flex-1"
                      />
                      {option.isCorrect && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Jelölje meg a helyes választ a rádiógombbal.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowQuestionEditor(false)}>
              Mégse
            </Button>
            <Button onClick={handleSaveQuestion} disabled={!questionForm.questionText.trim()}>
              <Save className="h-4 w-4 mr-2" />
              {editingQuestion ? 'Frissítés' : 'Hozzáadás'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}