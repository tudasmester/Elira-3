import React, { useState } from 'react';
import { BaseActivityClass } from '../activity-factory';
import { QuizActivity as QuizActivityType, QuizQuestion, QuizSettings } from '@shared/activity-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

export class QuizActivity extends BaseActivityClass {
  data: QuizActivityType;

  constructor(data: QuizActivityType) {
    super(data);
    this.data = data;
  }

  render(): React.ReactElement {
    return <QuizRenderer activity={this} />;
  }

  protected validateSpecific(): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const settings = this.data.settings as QuizSettings;

    if (!settings.questions || settings.questions.length === 0) {
      errors.push("Quiz must have at least one question");
    }

    settings.questions?.forEach((question, index) => {
      if (!question.text.trim()) {
        errors.push(`Question ${index + 1} text is required`);
      }

      if (question.points <= 0) {
        errors.push(`Question ${index + 1} must have positive points`);
      }

      if (question.type === 'multiple_choice' && (!question.options || question.options.length < 2)) {
        errors.push(`Question ${index + 1} must have at least 2 options`);
      }

      if (question.type === 'multiple_choice') {
        const hasCorrectAnswer = question.options?.some(opt => opt.isCorrect);
        if (!hasCorrectAnswer) {
          errors.push(`Question ${index + 1} must have at least one correct answer`);
        }
      }
    });

    if (settings.timeLimit && settings.timeLimit <= 0) {
      warnings.push("Time limit should be positive");
    }

    return { errors, warnings };
  }

  calculateGrade(submission: QuizSubmission): number {
    const settings = this.data.settings as QuizSettings;
    let totalPoints = 0;
    let earnedPoints = 0;

    settings.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = submission.answers[question.id];
      
      if (this.isAnswerCorrect(question, userAnswer)) {
        earnedPoints += question.points;
      }
    });

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    return Math.min(percentage, this.data.maxGrade);
  }

  private isAnswerCorrect(question: QuizQuestion, userAnswer: any): boolean {
    switch (question.type) {
      case 'multiple_choice':
        if (Array.isArray(question.correctAnswer)) {
          return Array.isArray(userAnswer) && 
                 userAnswer.sort().join(',') === question.correctAnswer.sort().join(',');
        }
        return userAnswer === question.correctAnswer;
      
      case 'true_false':
        return userAnswer === question.correctAnswer;
      
      case 'numerical':
        const numAnswer = parseFloat(userAnswer);
        const correctNum = parseFloat(question.correctAnswer as string);
        return Math.abs(numAnswer - correctNum) < 0.01;
      
      case 'short_answer':
        return userAnswer?.toLowerCase().trim() === 
               (question.correctAnswer as string)?.toLowerCase().trim();
      
      case 'essay':
        // Essays require manual grading
        return false;
      
      default:
        return false;
    }
  }
}

interface QuizSubmission {
  answers: Record<string, any>;
  startTime: Date;
  endTime: Date;
  attempt: number;
}

interface QuizRendererProps {
  activity: QuizActivity;
}

const QuizRenderer: React.FC<QuizRendererProps> = ({ activity }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const settings = activity.data.settings as QuizSettings;
  const questions = settings.questions || [];

  React.useEffect(() => {
    if (settings.timeLimit) {
      setTimeRemaining(settings.timeLimit * 60); // Convert to seconds
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    const submission: QuizSubmission = {
      answers,
      startTime: new Date(),
      endTime: new Date(),
      attempt: 1
    };
    
    const grade = activity.calculateGrade(submission);
    setIsSubmitted(true);
    
    // Here you would typically save the submission to the backend
    console.log('Quiz submitted:', { submission, grade });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <HelpCircle className="h-12 w-12 mx-auto mb-4" />
            <p>This quiz has no questions yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {activity.data.title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                {activity.data.description}
              </p>
            </div>
            {timeRemaining !== null && (
              <Badge variant={timeRemaining < 300 ? "destructive" : "secondary"}>
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestion === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestion(index)}
                className="w-10 h-10"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <Badge variant="outline">
              {questions[currentQuestion].points} points
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionRenderer
            question={questions[currentQuestion]}
            answer={answers[questions[currentQuestion].id]}
            onAnswerChange={(answer) => 
              handleAnswerChange(questions[currentQuestion].id, answer)
            }
            disabled={isSubmitted}
          />
        </CardContent>
      </Card>

      {/* Navigation and Submit */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0 || isSubmitted}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitted ? "Submitted" : "Submit Quiz"}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  disabled={isSubmitted}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isSubmitted && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Quiz submitted successfully!</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface QuestionRendererProps {
  question: QuizQuestion;
  answer: any;
  onAnswerChange: (answer: any) => void;
  disabled: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  answer,
  onAnswerChange,
  disabled
}) => {
  const renderQuestionType = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <RadioGroup
            value={answer || ""}
            onValueChange={onAnswerChange}
            disabled={disabled}
          >
            {question.options?.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'true_false':
        return (
          <RadioGroup
            value={answer || ""}
            onValueChange={onAnswerChange}
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false">False</Label>
            </div>
          </RadioGroup>
        );

      case 'short_answer':
      case 'numerical':
        return (
          <Input
            type={question.type === 'numerical' ? 'number' : 'text'}
            value={answer || ""}
            onChange={(e) => onAnswerChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter your answer..."
          />
        );

      case 'essay':
        return (
          <Textarea
            value={answer || ""}
            onChange={(e) => onAnswerChange(e.target.value)}
            disabled={disabled}
            placeholder="Write your essay response..."
            className="min-h-32"
          />
        );

      default:
        return <p className="text-gray-500">Question type not supported</p>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="prose max-w-none">
        <p className="text-lg font-medium">{question.text}</p>
      </div>
      
      {renderQuestionType()}

      {question.explanation && disabled && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Explanation:</strong> {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};