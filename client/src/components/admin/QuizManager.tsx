import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  HelpCircle, Plus, Edit, Trash2, Copy, Eye, Settings, 
  Clock, Users, Shield, BarChart3, Brain, Target,
  Image, Calculator, DragHandleDots2, MapPin, FileText,
  CheckCircle2, XCircle, AlertTriangle, Lightbulb
} from 'lucide-react';
import { 
  QuizSettings, QuizQuestion, QuizOption, QuestionPool, 
  ProctoringSettings, FeedbackSettings, AccessibilitySettings,
  QuestionFeedback, CalculatedVariable, MatchingItem, ClozeOption,
  DragDropZone, ImageHotspot, EssayRubric, QuestionHint
} from '@shared/activity-types';

interface QuizManagerProps {
  courseId: number;
  onSave?: (quiz: QuizSettings) => void;
  onCancel?: () => void;
  initialQuiz?: QuizSettings;
}

export function QuizManager({ courseId, onSave, onCancel, initialQuiz }: QuizManagerProps) {
  const [quiz, setQuiz] = useState<QuizSettings>(initialQuiz || {
    attempts: 1,
    shuffleQuestions: false,
    shuffleAnswers: false,
    showCorrectAnswers: 'after_submission',
    gradeMethod: 'highest',
    questions: [],
    feedback: {
      immediate: false,
      afterSubmission: true,
      afterClosing: false,
      showCorrectAnswer: true,
      showExplanation: true,
      showGrade: true,
      showPoints: true
    }
  });

  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');

  const questionTypes = [
    { value: 'multiple_choice', label: 'Feleletválasztós', icon: HelpCircle, description: 'Egy vagy több helyes válasz' },
    { value: 'true_false', label: 'Igaz/Hamis', icon: CheckCircle2, description: 'Egyszerű igaz/hamis kérdés' },
    { value: 'short_answer', label: 'Rövid válasz', icon: FileText, description: 'Szöveges válasz' },
    { value: 'essay', label: 'Esszé', icon: FileText, description: 'Hosszú szöveges válasz rubrikával' },
    { value: 'numerical', label: 'Numerikus', icon: Calculator, description: 'Számértékek toleranciával' },
    { value: 'calculated', label: 'Számított', icon: Calculator, description: 'Változókkal számított kérdések' },
    { value: 'matching', label: 'Párosítás', icon: DragHandleDots2, description: 'Elemek párosítása' },
    { value: 'ordering', label: 'Sorbarendezés', icon: DragHandleDots2, description: 'Elemek sorrendbe állítása' },
    { value: 'cloze', label: 'Hiányos szöveg', icon: Target, description: 'Szövegben hiányzó szavak' },
    { value: 'drag_drop_image', label: 'Képre húzás', icon: Image, description: 'Elemek képre húzása' },
    { value: 'hotspot', label: 'Képi zóna', icon: MapPin, description: 'Kép területeinek kijelölése' }
  ];

  const addQuestion = (type: string) => {
    const newQuestion: QuizQuestion = {
      id: crypto.randomUUID(),
      type: type as any,
      text: '',
      points: 1,
      difficulty: 'medium',
      partialCredit: false,
      feedback: {
        correct: '',
        incorrect: '',
        general: ''
      }
    };

    if (type === 'multiple_choice' || type === 'true_false') {
      newQuestion.options = type === 'true_false' 
        ? [
            { id: 'true', text: 'Igaz', isCorrect: false },
            { id: 'false', text: 'Hamis', isCorrect: false }
          ]
        : [{ id: crypto.randomUUID(), text: '', isCorrect: false }];
    }

    setSelectedQuestion(newQuestion);
    setQuestionDialogOpen(true);
  };

  const editQuestion = (question: QuizQuestion) => {
    setSelectedQuestion({ ...question });
    setQuestionDialogOpen(true);
  };

  const saveQuestion = (question: QuizQuestion) => {
    const updatedQuestions = quiz.questions.some(q => q.id === question.id)
      ? quiz.questions.map(q => q.id === question.id ? question : q)
      : [...quiz.questions, question];

    setQuiz({ ...quiz, questions: updatedQuestions });
    setQuestionDialogOpen(false);
    setSelectedQuestion(null);
  };

  const deleteQuestion = (questionId: string) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter(q => q.id !== questionId)
    });
  };

  const duplicateQuestion = (question: QuizQuestion) => {
    const duplicated = {
      ...question,
      id: crypto.randomUUID(),
      text: `${question.text} (másolat)`
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, duplicated] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Kvíz szerkesztő</h2>
          <p className="text-gray-600">Hozz létre és szerkeszd a kvízkérdéseket</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Mégse
          </Button>
          <Button onClick={() => onSave?.(quiz)}>
            Kvíz mentése
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="questions">Kérdések</TabsTrigger>
          <TabsTrigger value="settings">Beállítások</TabsTrigger>
          <TabsTrigger value="security">Biztonság</TabsTrigger>
          <TabsTrigger value="feedback">Visszajelzés</TabsTrigger>
          <TabsTrigger value="analytics">Analitika</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Kérdések ({quiz.questions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                {questionTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-1 text-xs"
                    onClick={() => addQuestion(type.value)}
                  >
                    <type.icon className="h-4 w-4" />
                    <span className="text-center">{type.label}</span>
                  </Button>
                ))}
              </div>

              <Separator className="my-4" />

              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {quiz.questions.map((question, index) => (
                    <Card key={question.id} className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{index + 1}</Badge>
                            <Badge variant="secondary">
                              {questionTypes.find(t => t.value === question.type)?.label}
                            </Badge>
                            <Badge variant="outline">{question.points} pont</Badge>
                            {question.difficulty && (
                              <Badge variant={
                                question.difficulty === 'easy' ? 'default' :
                                question.difficulty === 'medium' ? 'secondary' : 'destructive'
                              }>
                                {question.difficulty === 'easy' ? 'Könnyű' :
                                 question.difficulty === 'medium' ? 'Közepes' : 'Nehéz'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {question.text || 'Üres kérdés'}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => editQuestion(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => duplicateQuestion(question)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Kérdés törlése</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Biztosan törölni szeretnéd ezt a kérdést? Ez a művelet nem vonható vissza.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Mégse</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteQuestion(question.id)}>
                                  Törlés
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {quiz.questions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Még nincsenek kérdések hozzáadva</p>
                      <p className="text-sm">Válassz egy kérdéstípust a fenti gombokból</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Alapbeállítások
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Időkorlát (perc)</Label>
                  <Input
                    type="number"
                    value={quiz.timeLimit || ''}
                    onChange={(e) => setQuiz({
                      ...quiz,
                      timeLimit: e.target.value ? Number(e.target.value) : undefined
                    })}
                    placeholder="Nincs időkorlát"
                  />
                </div>
                <div>
                  <Label>Próbálkozások száma</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quiz.attempts}
                    onChange={(e) => setQuiz({
                      ...quiz,
                      attempts: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Jegyértékelési módszer</Label>
                  <Select
                    value={quiz.gradeMethod}
                    onValueChange={(value: any) => setQuiz({ ...quiz, gradeMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highest">Legjobb pontszám</SelectItem>
                      <SelectItem value="average">Átlagos pontszám</SelectItem>
                      <SelectItem value="first">Első próbálkozás</SelectItem>
                      <SelectItem value="last">Utolsó próbálkozás</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Megjelenítési beállítások</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="shuffle-questions">Kérdések keverése</Label>
                  <Switch
                    id="shuffle-questions"
                    checked={quiz.shuffleQuestions}
                    onCheckedChange={(checked) => setQuiz({ ...quiz, shuffleQuestions: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="shuffle-answers">Válaszok keverése</Label>
                  <Switch
                    id="shuffle-answers"
                    checked={quiz.shuffleAnswers}
                    onCheckedChange={(checked) => setQuiz({ ...quiz, shuffleAnswers: checked })}
                  />
                </div>
                <div>
                  <Label>Helyes válaszok megjelenítése</Label>
                  <Select
                    value={quiz.showCorrectAnswers}
                    onValueChange={(value: any) => setQuiz({ ...quiz, showCorrectAnswers: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Soha</SelectItem>
                      <SelectItem value="after_submission">Beadás után</SelectItem>
                      <SelectItem value="after_due_date">Határidő után</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Hozzáférés korlátozása
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-protected">Jelszavas védelem</Label>
                  <Switch
                    id="password-protected"
                    checked={quiz.passwordProtected || false}
                    onCheckedChange={(checked) => setQuiz({
                      ...quiz,
                      passwordProtected: checked,
                      password: checked ? quiz.password : undefined
                    })}
                  />
                </div>
                {quiz.passwordProtected && (
                  <div>
                    <Label>Jelszó</Label>
                    <Input
                      type="password"
                      value={quiz.password || ''}
                      onChange={(e) => setQuiz({ ...quiz, password: e.target.value })}
                      placeholder="Kvíz jelszava"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label htmlFor="secure-mode">Biztonságos mód</Label>
                  <Switch
                    id="secure-mode"
                    checked={quiz.secureMode || false}
                    onCheckedChange={(checked) => setQuiz({ ...quiz, secureMode: checked })}
                  />
                </div>
                <div>
                  <Label>IP korlátozások</Label>
                  <Textarea
                    value={quiz.ipRestrictions?.join('\n') || ''}
                    onChange={(e) => setQuiz({
                      ...quiz,
                      ipRestrictions: e.target.value.split('\n').filter(ip => ip.trim())
                    })}
                    placeholder="192.168.1.0/24&#10;10.0.0.1"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Egy IP cím vagy tartomány per sor
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Proctoring beállítások
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="proctoring-enabled">Proctoring engedélyezése</Label>
                  <Switch
                    id="proctoring-enabled"
                    checked={quiz.proctoring?.enabled || false}
                    onCheckedChange={(checked) => setQuiz({
                      ...quiz,
                      proctoring: { ...quiz.proctoring, enabled: checked }
                    })}
                  />
                </div>
                {quiz.proctoring?.enabled && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="webcam-required">Webkamera kötelező</Label>
                      <Switch
                        id="webcam-required"
                        checked={quiz.proctoring?.webcamRequired || false}
                        onCheckedChange={(checked) => setQuiz({
                          ...quiz,
                          proctoring: { ...quiz.proctoring, webcamRequired: checked }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="screen-share">Képernyő megosztás</Label>
                      <Switch
                        id="screen-share"
                        checked={quiz.proctoring?.screenShareRequired || false}
                        onCheckedChange={(checked) => setQuiz({
                          ...quiz,
                          proctoring: { ...quiz.proctoring, screenShareRequired: checked }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="lockdown-browser">Zárt böngésző</Label>
                      <Switch
                        id="lockdown-browser"
                        checked={quiz.proctoring?.lockdownBrowser || false}
                        onCheckedChange={(checked) => setQuiz({
                          ...quiz,
                          proctoring: { ...quiz.proctoring, lockdownBrowser: checked }
                        })}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Visszajelzési beállítások
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Visszajelzés időzítése</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="immediate-feedback">Azonnali visszajelzés</Label>
                    <Switch
                      id="immediate-feedback"
                      checked={quiz.feedback?.immediate || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        feedback: { ...quiz.feedback, immediate: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="after-submission">Beadás után</Label>
                    <Switch
                      id="after-submission"
                      checked={quiz.feedback?.afterSubmission || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        feedback: { ...quiz.feedback, afterSubmission: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="after-closing">Kvíz lezárása után</Label>
                    <Switch
                      id="after-closing"
                      checked={quiz.feedback?.afterClosing || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        feedback: { ...quiz.feedback, afterClosing: checked }
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Megjelenített információk</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-correct-answer">Helyes válasz</Label>
                    <Switch
                      id="show-correct-answer"
                      checked={quiz.feedback?.showCorrectAnswer || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        feedback: { ...quiz.feedback, showCorrectAnswer: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-explanation">Magyarázat</Label>
                    <Switch
                      id="show-explanation"
                      checked={quiz.feedback?.showExplanation || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        feedback: { ...quiz.feedback, showExplanation: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-grade">Jegy</Label>
                    <Switch
                      id="show-grade"
                      checked={quiz.feedback?.showGrade || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        feedback: { ...quiz.feedback, showGrade: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-points">Pontszám</Label>
                    <Switch
                      id="show-points"
                      checked={quiz.feedback?.showPoints || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        feedback: { ...quiz.feedback, showPoints: checked }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analitikai beállítások
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="track-view-time">Megtekintési idő követése</Label>
                    <Switch
                      id="track-view-time"
                      checked={quiz.analytics?.trackViewTime || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        analytics: { ...quiz.analytics, trackViewTime: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="track-click-patterns">Kattintási minták</Label>
                    <Switch
                      id="track-click-patterns"
                      checked={quiz.analytics?.trackClickPatterns || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        analytics: { ...quiz.analytics, trackClickPatterns: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="track-answer-changes">Válaszváltoztatások</Label>
                    <Switch
                      id="track-answer-changes"
                      checked={quiz.analytics?.trackAnswerChanges || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        analytics: { ...quiz.analytics, trackAnswerChanges: checked }
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="difficulty-adjustment">Nehézség automatikus beállítása</Label>
                    <Switch
                      id="difficulty-adjustment"
                      checked={quiz.analytics?.difficultyAdjustment || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        analytics: { ...quiz.analytics, difficultyAdjustment: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="performance-insights">Teljesítmény elemzések</Label>
                    <Switch
                      id="performance-insights"
                      checked={quiz.analytics?.performanceInsights || false}
                      onCheckedChange={(checked) => setQuiz({
                        ...quiz,
                        analytics: { ...quiz.analytics, performanceInsights: checked }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Question Editor Dialog */}
      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedQuestion ? 'Kérdés szerkesztése' : 'Új kérdés'}
            </DialogTitle>
            <DialogDescription>
              Állítsd be a kérdés paramétereit és válaszlehetőségeit
            </DialogDescription>
          </DialogHeader>
          {selectedQuestion && (
            <QuestionEditor
              question={selectedQuestion}
              onSave={saveQuestion}
              onCancel={() => {
                setQuestionDialogOpen(false);
                setSelectedQuestion(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface QuestionEditorProps {
  question: QuizQuestion;
  onSave: (question: QuizQuestion) => void;
  onCancel: () => void;
}

function QuestionEditor({ question, onSave, onCancel }: QuestionEditorProps) {
  const [editedQuestion, setEditedQuestion] = useState<QuizQuestion>(question);

  const addOption = () => {
    const newOption: QuizOption = {
      id: crypto.randomUUID(),
      text: '',
      isCorrect: false
    };
    setEditedQuestion({
      ...editedQuestion,
      options: [...(editedQuestion.options || []), newOption]
    });
  };

  const updateOption = (optionId: string, updates: Partial<QuizOption>) => {
    setEditedQuestion({
      ...editedQuestion,
      options: editedQuestion.options?.map(option =>
        option.id === optionId ? { ...option, ...updates } : option
      )
    });
  };

  const removeOption = (optionId: string) => {
    setEditedQuestion({
      ...editedQuestion,
      options: editedQuestion.options?.filter(option => option.id !== optionId)
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label>Kérdés szövege</Label>
            <Textarea
              value={editedQuestion.text}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, text: e.target.value })}
              placeholder="Írd be a kérdést..."
              className="min-h-24"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pontszám</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={editedQuestion.points}
                onChange={(e) => setEditedQuestion({ ...editedQuestion, points: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Nehézség</Label>
              <Select
                value={editedQuestion.difficulty}
                onValueChange={(value: any) => setEditedQuestion({ ...editedQuestion, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Könnyű</SelectItem>
                  <SelectItem value="medium">Közepes</SelectItem>
                  <SelectItem value="hard">Nehéz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Magyarázat</Label>
            <Textarea
              value={editedQuestion.explanation || ''}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, explanation: e.target.value })}
              placeholder="Magyarázat a válaszhoz..."
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="partial-credit">Részpontszám engedélyezése</Label>
            <Switch
              id="partial-credit"
              checked={editedQuestion.partialCredit || false}
              onCheckedChange={(checked) => setEditedQuestion({ ...editedQuestion, partialCredit: checked })}
            />
          </div>
        </div>
      </div>

      {/* Question Type Specific Editors */}
      {(editedQuestion.type === 'multiple_choice' || editedQuestion.type === 'true_false') && (
        <Card>
          <CardHeader>
            <CardTitle>Válaszlehetőségek</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {editedQuestion.options?.map((option, index) => (
              <div key={option.id} className="flex items-center gap-3 p-3 border rounded">
                <Badge variant="outline">{String.fromCharCode(65 + index)}</Badge>
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(option.id, { text: e.target.value })}
                  placeholder="Válasz szövege..."
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Helyes</Label>
                  <Switch
                    checked={option.isCorrect}
                    onCheckedChange={(checked) => updateOption(option.id, { isCorrect: checked })}
                  />
                </div>
                {editedQuestion.type === 'multiple_choice' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeOption(option.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {editedQuestion.type === 'multiple_choice' && (
              <Button variant="outline" onClick={addOption} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Válasz hozzáadása
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {editedQuestion.type === 'numerical' && (
        <Card>
          <CardHeader>
            <CardTitle>Numerikus beállítások</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Helyes válasz</Label>
                <Input
                  type="number"
                  value={editedQuestion.correctAnswer as number || ''}
                  onChange={(e) => setEditedQuestion({ ...editedQuestion, correctAnswer: Number(e.target.value) })}
                  placeholder="123.45"
                />
              </div>
              <div>
                <Label>Tolerancia</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editedQuestion.numericalTolerance || ''}
                  onChange={(e) => setEditedQuestion({ ...editedQuestion, numericalTolerance: Number(e.target.value) })}
                  placeholder="0.1"
                />
              </div>
            </div>
            <div>
              <Label>Tolerancia típusa</Label>
              <Select
                value={editedQuestion.toleranceType || 'nominal'}
                onValueChange={(value: any) => setEditedQuestion({ ...editedQuestion, toleranceType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nominal">Abszolút érték</SelectItem>
                  <SelectItem value="relative">Relatív százalék</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Mégse
        </Button>
        <Button onClick={() => onSave(editedQuestion)}>
          Kérdés mentése
        </Button>
      </div>
    </div>
  );
}