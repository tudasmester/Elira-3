import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Save, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface QuizQuestion {
  id?: number;
  type: "multiple_choice" | "true_false" | "fill_blank";
  question: string;
  explanation?: string;
  points: number;
  order: number;
  options: QuizOption[];
}

interface QuizOption {
  id?: number;
  optionText: string;
  isCorrect: boolean;
  order: number;
}

interface QuizBuilderProps {
  lessonId: number;
  quiz?: any;
  onSave?: () => void;
}

function QuizBuilder({ lessonId, quiz: existingQuiz, onSave }: QuizBuilderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [quiz, setQuiz] = useState({
    title: existingQuiz?.title || "",
    description: existingQuiz?.description || "",
    instructions: existingQuiz?.instructions || "",
    timeLimit: existingQuiz?.timeLimit || null,
    passingScore: existingQuiz?.passingScore || 70,
    maxAttempts: existingQuiz?.maxAttempts || 3,
    showCorrectAnswers: existingQuiz?.showCorrectAnswers || 1,
    shuffleQuestions: existingQuiz?.shuffleQuestions || 0,
    isActive: existingQuiz?.isActive || 1,
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>(
    existingQuiz?.questions?.map((q: any, index: number) => ({
      ...q,
      order: index,
      options: q.options || []
    })) || []
  );

  // Create or update quiz
  const saveQuizMutation = useMutation({
    mutationFn: async () => {
      if (existingQuiz?.id) {
        // Update existing quiz
        await apiRequest("PUT", `/api/admin/quizzes/${existingQuiz.id}`, quiz);
        return existingQuiz.id;
      } else {
        // Create new quiz
        const response = await apiRequest("POST", `/api/admin/lessons/${lessonId}/quizzes`, quiz);
        const result = await response.json();
        return result.id;
      }
    },
    onSuccess: (quizId) => {
      toast({
        title: "Quiz mentve",
        description: "A kvíz sikeresen mentve lett.",
      });
      saveQuestionsMutation.mutate(quizId);
    },
    onError: (error: any) => {
      toast({
        title: "Hiba",
        description: "Nem sikerült menteni a kvízt.",
        variant: "destructive",
      });
    },
  });

  // Save questions
  const saveQuestionsMutation = useMutation({
    mutationFn: async (quizId: number) => {
      // Save each question
      for (const question of questions) {
        if (question.id) {
          // Update existing question
          await apiRequest("PUT", `/api/admin/questions/${question.id}`, {
            type: question.type,
            question: question.question,
            explanation: question.explanation,
            points: question.points,
            order: question.order,
          });
        } else {
          // Create new question
          await apiRequest("POST", `/api/admin/quizzes/${quizId}/questions`, {
            type: question.type,
            question: question.question,
            explanation: question.explanation,
            points: question.points,
            order: question.order,
            options: question.options.map((opt, idx) => ({
              optionText: opt.optionText,
              isCorrect: opt.isCorrect ? 1 : 0,
              order: idx,
            })),
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/lessons/${lessonId}/quizzes`] });
      onSave?.();
    },
  });

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      type: "multiple_choice",
      question: "",
      explanation: "",
      points: 1,
      order: questions.length,
      options: [
        { optionText: "", isCorrect: true, order: 0 },
        { optionText: "", isCorrect: false, order: 1 },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    
    // Handle question type changes
    if (updates.type) {
      if (updates.type === "true_false") {
        newQuestions[index].options = [
          { optionText: "Igaz", isCorrect: true, order: 0 },
          { optionText: "Hamis", isCorrect: false, order: 1 },
        ];
      } else if (updates.type === "fill_blank") {
        newQuestions[index].options = [
          { optionText: "", isCorrect: true, order: 0 },
        ];
      } else if (updates.type === "multiple_choice" && newQuestions[index].options.length < 2) {
        newQuestions[index].options = [
          { optionText: "", isCorrect: true, order: 0 },
          { optionText: "", isCorrect: false, order: 1 },
        ];
      }
    }
    
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions.map((q, i) => ({ ...q, order: i })));
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    
    // Update order values
    newQuestions.forEach((q, i) => {
      q.order = i;
    });
    
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    question.options.push({
      optionText: "",
      isCorrect: false,
      order: question.options.length,
    });
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, updates: Partial<QuizOption>) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    
    // If marking an option as correct, make others incorrect (for single-answer questions)
    if (updates.isCorrect && (question.type === "multiple_choice" || question.type === "true_false")) {
      question.options.forEach((opt, i) => {
        opt.isCorrect = i === optionIndex;
      });
    } else {
      question.options[optionIndex] = { ...question.options[optionIndex], ...updates };
    }
    
    setQuestions(newQuestions);
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    question.options = question.options.filter((_, i) => i !== optionIndex);
    // Reorder remaining options
    question.options.forEach((opt, i) => {
      opt.order = i;
    });
    setQuestions(newQuestions);
  };

  const handleSave = () => {
    if (!quiz.title.trim()) {
      toast({
        title: "Hiba",
        description: "A kvíz címe kötelező.",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Hiba",
        description: "Legalább egy kérdést hozzá kell adni.",
        variant: "destructive",
      });
      return;
    }

    // Validate questions
    for (const question of questions) {
      if (!question.question.trim()) {
        toast({
          title: "Hiba",
          description: "Minden kérdésnek rendelkeznie kell szöveggel.",
          variant: "destructive",
        });
        return;
      }

      if (question.type === "multiple_choice" && question.options.length < 2) {
        toast({
          title: "Hiba",
          description: "A feleletválasztós kérdéseknek legalább 2 válaszlehetőségük kell hogy legyen.",
          variant: "destructive",
        });
        return;
      }

      if (!question.options.some(opt => opt.isCorrect)) {
        toast({
          title: "Hiba",
          description: "Minden kérdésnek rendelkeznie kell helyes válasszal.",
          variant: "destructive",
        });
        return;
      }
    }

    saveQuizMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Quiz Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Kvíz beállítások</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Cím *</Label>
              <Input
                id="title"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                placeholder="Kvíz címe"
              />
            </div>
            <div>
              <Label htmlFor="passingScore">Átmenő pontszám (%)</Label>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                value={quiz.passingScore}
                onChange={(e) => setQuiz({ ...quiz, passingScore: parseInt(e.target.value) || 70 })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Leírás</Label>
            <Textarea
              id="description"
              value={quiz.description}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              placeholder="Kvíz leírása"
            />
          </div>
          
          <div>
            <Label htmlFor="instructions">Utasítások</Label>
            <Textarea
              id="instructions"
              value={quiz.instructions}
              onChange={(e) => setQuiz({ ...quiz, instructions: e.target.value })}
              placeholder="Kvíz kitöltési utasítások"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="timeLimit">Időkorlát (perc)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="0"
                value={quiz.timeLimit || ""}
                onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Nincs korlát"
              />
            </div>
            <div>
              <Label htmlFor="maxAttempts">Max. próbálkozások</Label>
              <Input
                id="maxAttempts"
                type="number"
                min="1"
                value={quiz.maxAttempts}
                onChange={(e) => setQuiz({ ...quiz, maxAttempts: parseInt(e.target.value) || 3 })}
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="showCorrectAnswers"
                checked={quiz.showCorrectAnswers === 1}
                onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.checked ? 1 : 0 })}
              />
              <Label htmlFor="showCorrectAnswers">Helyes válaszok mutatása</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Kérdések ({questions.length})</h3>
          <Button onClick={addQuestion} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Kérdés hozzáadása
          </Button>
        </div>

        {questions.map((question, questionIndex) => (
          <Card key={questionIndex}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Kérdés {questionIndex + 1}</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveQuestion(questionIndex, "up")}
                  disabled={questionIndex === 0}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveQuestion(questionIndex, "down")}
                  disabled={questionIndex === questions.length - 1}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteQuestion(questionIndex)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Kérdés típusa</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value: "multiple_choice" | "true_false" | "fill_blank") =>
                      updateQuestion(questionIndex, { type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Feleletválasztós</SelectItem>
                      <SelectItem value="true_false">Igaz/Hamis</SelectItem>
                      <SelectItem value="fill_blank">Kitöltős</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Pontszám</Label>
                  <Input
                    type="number"
                    min="1"
                    value={question.points}
                    onChange={(e) =>
                      updateQuestion(questionIndex, { points: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Kérdés szövege *</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(questionIndex, { question: e.target.value })}
                  placeholder="Írd be a kérdést..."
                />
              </div>

              <div>
                <Label>Magyarázat (opcionális)</Label>
                <Textarea
                  value={question.explanation || ""}
                  onChange={(e) => updateQuestion(questionIndex, { explanation: e.target.value })}
                  placeholder="Magyarázat a helyes válaszhoz..."
                />
              </div>

              {/* Question Options */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>
                    {question.type === "multiple_choice" && "Válaszlehetőségek"}
                    {question.type === "true_false" && "Igaz/Hamis válaszok"}
                    {question.type === "fill_blank" && "Helyes válasz"}
                  </Label>
                  {question.type === "multiple_choice" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(questionIndex)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Válasz hozzáadása
                    </Button>
                  )}
                </div>

                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-3 p-3 border rounded-lg">
                    {question.type !== "fill_blank" && (
                      <input
                        type="radio"
                        name={`question-${questionIndex}-correct`}
                        checked={option.isCorrect}
                        onChange={() => updateOption(questionIndex, optionIndex, { isCorrect: true })}
                        className="mt-1"
                      />
                    )}
                    <div className="flex-1">
                      <Input
                        value={option.optionText}
                        onChange={(e) =>
                          updateOption(questionIndex, optionIndex, { optionText: e.target.value })
                        }
                        placeholder={
                          question.type === "fill_blank" 
                            ? "Helyes válasz..." 
                            : `${optionIndex + 1}. válaszlehetőség...`
                        }
                      />
                    </div>
                    {question.type === "multiple_choice" && question.options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteOption(questionIndex, optionIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saveQuizMutation.isPending || saveQuestionsMutation.isPending}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saveQuizMutation.isPending || saveQuestionsMutation.isPending ? "Mentés..." : "Kvíz mentése"}
        </Button>
      </div>
    </div>
  );
}

export default QuizBuilder;