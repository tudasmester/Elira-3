import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Trash2, GripVertical, Settings, Play, FileText, Image, Video, Mic, Upload } from "lucide-react";
import type { Quiz, QuizQuestion, QuizQuestionOption, QUESTION_TYPES } from "@shared/schema";

interface QuizBuilderProps {
  lessonId: number;
  onClose: () => void;
}

interface QuestionWithOptions extends QuizQuestion {
  options: QuizQuestionOption[];
}

interface QuizWithQuestions extends Quiz {
  questions: QuestionWithOptions[];
}

export default function QuizBuilder({ lessonId, onClose }: QuizBuilderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState<'settings' | 'questions' | 'preview'>('settings');
  const [selectedQuiz, setSelectedQuiz] = useState<QuizWithQuestions | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Quiz settings state
  const [quizSettings, setQuizSettings] = useState({
    title: '',
    description: '',
    examType: 'quiz' as const,
    timeLimit: 0,
    shuffleQuestions: false,
    attemptsAllowed: 1,
    passingScore: 70,
    showResults: true,
    showCorrectAnswers: true
  });

  // Get existing quizzes for this lesson
  const { data: quizzes = [] } = useQuery({
    queryKey: ['/api/lessons', lessonId, 'quizzes'],
    queryFn: () => apiRequest('GET', `/api/lessons/${lessonId}/quizzes`)
  });

  // Create quiz mutation
  const createQuizMutation = useMutation({
    mutationFn: async (quizData: typeof quizSettings) => {
      const response = await apiRequest('POST', `/api/lessons/${lessonId}/quizzes`, quizData);
      return response;
    },
    onSuccess: (newQuiz) => {
      setSelectedQuiz({ ...newQuiz, questions: [] });
      setCurrentStep('questions');
      queryClient.invalidateQueries({ queryKey: ['/api/lessons', lessonId, 'quizzes'] });
      toast({ title: "Kvíz sikeresen létrehozva" });
    },
    onError: () => {
      toast({ title: "Hiba", description: "Kvíz létrehozása sikertelen", variant: "destructive" });
    }
  });

  // Add question mutation
  const addQuestionMutation = useMutation({
    mutationFn: async (questionData: any) => {
      return await apiRequest('POST', `/api/quizzes/${selectedQuiz?.id}/questions`, questionData);
    },
    onSuccess: () => {
      if (selectedQuiz) {
        queryClient.invalidateQueries({ queryKey: ['/api/quizzes', selectedQuiz.id] });
      }
      toast({ title: "Kérdés sikeresen hozzáadva" });
    }
  });

  const handleCreateQuiz = () => {
    if (!quizSettings.title.trim()) {
      toast({ title: "Hiba", description: "A kvíz címe kötelező", variant: "destructive" });
      return;
    }
    createQuizMutation.mutate(quizSettings);
  };

  const handleQuizSelect = async (quiz: Quiz) => {
    try {
      const response = await apiRequest('GET', `/api/quizzes/${quiz.id}`);
      setSelectedQuiz(response);
      setCurrentStep('questions');
    } catch (error) {
      toast({ title: "Hiba", description: "Kvíz betöltése sikertelen", variant: "destructive" });
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice': return <FileText className="w-4 h-4" />;
      case 'true_false': return <FileText className="w-4 h-4" />;
      case 'short_text': return <FileText className="w-4 h-4" />;
      case 'text_assignment': return <FileText className="w-4 h-4" />;
      case 'file_assignment': return <Upload className="w-4 h-4" />;
      case 'video_recording': return <Video className="w-4 h-4" />;
      case 'audio_recording': return <Mic className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'Feleletválasztás';
      case 'true_false': return 'Igaz/Hamis';
      case 'short_text': return 'Rövid szöveg';
      case 'text_assignment': return 'Szöveges feladat';
      case 'file_assignment': return 'Fájl feltöltés';
      case 'video_recording': return 'Videó felvétel';
      case 'audio_recording': return 'Hang felvétel';
      default: return type;
    }
  };

  if (currentStep === 'settings') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Kvíz/Vizsga Beállítások</h2>
          <Button variant="outline" onClick={onClose}>Bezárás</Button>
        </div>

        {/* Existing Quizzes */}
        {quizzes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Meglévő kvízek</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {quizzes.map((quiz: Quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => handleQuizSelect(quiz)}
                  >
                    <div>
                      <h4 className="font-medium">{quiz.title}</h4>
                      <p className="text-sm text-gray-500">{quiz.description}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={quiz.status === 'published' ? 'default' : 'secondary'}>
                          {quiz.status === 'published' ? 'Publikált' : 'Piszkozat'}
                        </Badge>
                        <Badge variant="outline">{quiz.examType}</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Szerkesztés
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create New Quiz */}
        <Card>
          <CardHeader>
            <CardTitle>Új kvíz létrehozása</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Kvíz címe *</Label>
                <Input
                  id="title"
                  value={quizSettings.title}
                  onChange={(e) => setQuizSettings(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Kvíz címe..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="examType">Típus</Label>
                <Select value={quizSettings.examType} onValueChange={(value: 'quiz' | 'exam' | 'assessment') => 
                  setQuizSettings(prev => ({ ...prev, examType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Kvíz</SelectItem>
                    <SelectItem value="exam">Vizsga</SelectItem>
                    <SelectItem value="assessment">Értékelés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Leírás</Label>
              <Textarea
                id="description"
                value={quizSettings.description}
                onChange={(e) => setQuizSettings(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Kvíz leírása..."
                rows={3}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Időkorlát (perc)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={quizSettings.timeLimit}
                  onChange={(e) => setQuizSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                  placeholder="0 = nincs korlát"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attempts">Próbálkozások száma</Label>
                <Input
                  id="attempts"
                  type="number"
                  value={quizSettings.attemptsAllowed}
                  onChange={(e) => setQuizSettings(prev => ({ ...prev, attemptsAllowed: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingScore">Átmenő pontszám (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={quizSettings.passingScore}
                  onChange={(e) => setQuizSettings(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 70 }))}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="shuffle">Kérdések keverése</Label>
                <Switch
                  id="shuffle"
                  checked={quizSettings.shuffleQuestions}
                  onCheckedChange={(checked) => setQuizSettings(prev => ({ ...prev, shuffleQuestions: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showResults">Eredmények megjelenítése</Label>
                <Switch
                  id="showResults"
                  checked={quizSettings.showResults}
                  onCheckedChange={(checked) => setQuizSettings(prev => ({ ...prev, showResults: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showAnswers">Helyes válaszok megjelenítése</Label>
                <Switch
                  id="showAnswers"
                  checked={quizSettings.showCorrectAnswers}
                  onCheckedChange={(checked) => setQuizSettings(prev => ({ ...prev, showCorrectAnswers: checked }))}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleCreateQuiz} 
                disabled={createQuizMutation.isPending}
                className="flex-1"
              >
                {createQuizMutation.isPending ? 'Létrehozás...' : 'Kvíz létrehozása'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'questions' && selectedQuiz) {
    return <QuestionEditor quiz={selectedQuiz} onBack={() => setCurrentStep('settings')} />;
  }

  return null;
}

// Question Editor Component
function QuestionEditor({ quiz, onBack }: { quiz: QuizWithQuestions; onBack: () => void }) {
  const { toast } = useToast();
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('multiple_choice');

  const questionTypes = [
    { value: 'multiple_choice', label: 'Feleletválasztás', icon: FileText },
    { value: 'true_false', label: 'Igaz/Hamis', icon: FileText },
    { value: 'short_text', label: 'Rövid szöveg', icon: FileText },
    { value: 'text_assignment', label: 'Szöveges feladat', icon: FileText },
    { value: 'file_assignment', label: 'Fájl feltöltés', icon: Upload },
    { value: 'video_recording', label: 'Videó felvétel', icon: Video },
    { value: 'audio_recording', label: 'Hang felvétel', icon: Mic },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <p className="text-gray-500">Kérdések szerkesztése</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>Vissza</Button>
          <Button>Mentés és bezárás</Button>
        </div>
      </div>

      {/* Question List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Kérdések ({quiz.questions?.length || 0})</CardTitle>
            <Button onClick={() => setShowAddQuestion(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Kérdés hozzáadása
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {quiz.questions?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Még nincsenek kérdések ebben a kvízben.</p>
              <Button className="mt-4" onClick={() => setShowAddQuestion(true)}>
                Első kérdés hozzáadása
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <Badge variant="outline">
                          {getQuestionTypeLabel(question.questionType)}
                        </Badge>
                        <Badge variant="secondary">{question.points} pont</Badge>
                      </div>
                      <p className="font-medium">{question.questionText}</p>
                      {question.options && question.options.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div key={option.id} className="flex items-center gap-2 text-sm">
                              <span className={`w-2 h-2 rounded-full ${option.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span>{String.fromCharCode(65 + optIndex)}. {option.optionText}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Question Dialog */}
      {showAddQuestion && (
        <Card>
          <CardHeader>
            <CardTitle>Új kérdés hozzáadása</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {questionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedQuestionType === type.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedQuestionType(type.value)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{type.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setShowAddQuestion(false)} variant="outline">
                Mégse
              </Button>
              <Button>
                Kérdés létrehozása
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  function getQuestionTypeLabel(type: string) {
    switch (type) {
      case 'multiple_choice': return 'Feleletválasztás';
      case 'true_false': return 'Igaz/Hamis';
      case 'short_text': return 'Rövid szöveg';
      case 'text_assignment': return 'Szöveges feladat';
      case 'file_assignment': return 'Fájl feltöltés';
      case 'video_recording': return 'Videó felvétel';
      case 'audio_recording': return 'Hang felvétel';
      default: return type;
    }
  }
}