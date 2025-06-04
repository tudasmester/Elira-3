import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface QuizAnswer {
  questionId: number;
  selectedOptionId?: number;
  textAnswer?: string;
  timeSpent: number;
}

interface QuizInterfaceProps {
  lessonId: number;
  onComplete?: (results: any) => void;
}

export default function QuizInterface({ lessonId, onComplete }: QuizInterfaceProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const startTimeRef = useRef(Date.now());
  const questionStartTimeRef = useRef(Date.now());
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [results, setResults] = useState<any>(null);

  // Fetch quiz for lesson
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: [`/api/lessons/${lessonId}/quiz`],
    enabled: !quizCompleted,
  });

  // Timer effect
  useEffect(() => {
    if (quizStarted && quiz?.timeLimit && timeRemaining !== null) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, quiz?.timeLimit, timeRemaining]);

  // Start quiz attempt
  const startQuizMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/quizzes/${quiz.id}/attempt`);
      return await response.json();
    },
    onSuccess: (attempt) => {
      setAttemptId(attempt.id);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      startTimeRef.current = Date.now();
      questionStartTimeRef.current = Date.now();
      
      if (quiz.timeLimit) {
        setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
      }
    },
    onError: (error: any) => {
      toast({
        title: "Hiba",
        description: "Nem sikerült elindítani a kvízt.",
        variant: "destructive",
      });
    },
  });

  // Submit quiz
  const submitQuizMutation = useMutation({
    mutationFn: async () => {
      const totalTimeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      const response = await apiRequest("POST", `/api/quiz-attempts/${attemptId}/submit`, {
        answers,
        timeSpent: totalTimeSpent,
      });
      return await response.json();
    },
    onSuccess: (response) => {
      setResults(response.results);
      setQuizCompleted(true);
      onComplete?.(response.results);
      
      // Show success toast
      toast({
        title: "Kvíz befejezve",
        description: `Eredményed: ${response.results.percentageScore}%`,
        variant: response.results.passed ? "default" : "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hiba",
        description: "Nem sikerült beküldeni a kvízt.",
        variant: "destructive",
      });
    },
  });

  const handleStartQuiz = () => {
    startQuizMutation.mutate();
  };

  const handleAnswerChange = (questionId: number, answer: Partial<QuizAnswer>) => {
    const questionTime = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
    
    setAnswers((prev) => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      const newAnswer: QuizAnswer = {
        questionId,
        timeSpent: questionTime,
        ...answer,
      };
      
      if (existingIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingIndex] = newAnswer;
        return newAnswers;
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      questionStartTimeRef.current = Date.now();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      questionStartTimeRef.current = Date.now();
    }
  };

  const handleSubmitQuiz = () => {
    if (answers.length === 0) {
      toast({
        title: "Hiba",
        description: "Legalább egy kérdést meg kell válaszolni.",
        variant: "destructive",
      });
      return;
    }
    
    submitQuizMutation.mutate();
  };

  const getCurrentAnswer = (questionId: number) => {
    return answers.find(a => a.questionId === questionId);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Kvíz betöltése...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nincs kvíz</h3>
        <p className="text-gray-600">Ehhez a leckéhez nem tartozik kvíz.</p>
      </div>
    );
  }

  if (quizCompleted && results) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {results.passed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              Kvíz eredménye
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {results.percentageScore}%
              </div>
              <Badge variant={results.passed ? "default" : "destructive"}>
                {results.passed ? "Sikeres" : "Sikertelen"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold">{results.totalScore}</div>
                <div className="text-sm text-gray-600">Elért pontszám</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">{results.maxScore}</div>
                <div className="text-sm text-gray-600">Maximális pontszám</div>
              </div>
            </div>

            {quiz.showCorrectAnswers && (
              <div className="space-y-4">
                <h4 className="font-semibold">Részletes eredmények:</h4>
                {results.answers.map((answer: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium">{index + 1}. {answer.question}</h5>
                      <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                        {answer.isCorrect ? "Helyes" : "Helytelen"}
                      </Badge>
                    </div>
                    
                    {answer.correctAnswer && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Helyes válasz:</strong> {answer.correctAnswer}
                      </div>
                    )}
                    
                    {answer.explanation && (
                      <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                        <strong>Magyarázat:</strong> {answer.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz.description && (
              <p className="text-gray-600">{quiz.description}</p>
            )}
            
            {quiz.instructions && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Utasítások:</h4>
                <p className="text-sm">{quiz.instructions}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{quiz.questions?.length || 0}</div>
                <div className="text-sm text-gray-600">Kérdések száma</div>
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {quiz.timeLimit ? `${quiz.timeLimit} perc` : "Korlátlan"}
                </div>
                <div className="text-sm text-gray-600">Időkorlát</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{quiz.passingScore}%</div>
                <div className="text-sm text-gray-600">Átmenő pontszám</div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={handleStartQuiz}
                disabled={startQuizMutation.isPending}
                size="lg"
              >
                {startQuizMutation.isPending ? "Indítás..." : "Kvíz indítása"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer(currentQuestion.id);
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{quiz.title}</CardTitle>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 text-red-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Kérdés {currentQuestionIndex + 1} / {quiz.questions.length}</span>
              <span>{Math.round(progress)}% kész</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Multiple Choice */}
          {currentQuestion.type === "multiple_choice" && (
            <div className="space-y-3">
              {currentQuestion.options.map((option: any) => (
                <label
                  key={option.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={currentAnswer?.selectedOptionId === option.id}
                    onChange={() => handleAnswerChange(currentQuestion.id, {
                      selectedOptionId: option.id,
                    })}
                  />
                  <span>{option.optionText}</span>
                </label>
              ))}
            </div>
          )}

          {/* True/False */}
          {currentQuestion.type === "true_false" && (
            <div className="space-y-3">
              {currentQuestion.options.map((option: any) => (
                <label
                  key={option.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={currentAnswer?.selectedOptionId === option.id}
                    onChange={() => handleAnswerChange(currentQuestion.id, {
                      selectedOptionId: option.id,
                    })}
                  />
                  <span>{option.optionText}</span>
                </label>
              ))}
            </div>
          )}

          {/* Fill in the Blank */}
          {currentQuestion.type === "fill_blank" && (
            <div>
              <Input
                value={currentAnswer?.textAnswer || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, {
                  textAnswer: e.target.value,
                })}
                placeholder="Írd be a válaszodat..."
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Előző
        </Button>
        
        <div className="flex gap-2">
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={submitQuizMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitQuizMutation.isPending ? "Beküldés..." : "Kvíz beküldése"}
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Következő
            </Button>
          )}
        </div>
      </div>

      {/* Question Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kérdések áttekintése</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {quiz.questions.map((question: any, index: number) => {
              const hasAnswer = answers.some(a => a.questionId === question.id);
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={question.id}
                  onClick={() => {
                    setCurrentQuestionIndex(index);
                    questionStartTimeRef.current = Date.now();
                  }}
                  className={`
                    w-10 h-10 rounded-lg text-sm font-medium border-2 transition-colors
                    ${isCurrent 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : hasAnswer
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}