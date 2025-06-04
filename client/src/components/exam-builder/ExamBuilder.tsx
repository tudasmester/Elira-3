import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Settings, 
  Eye, 
  Save, 
  Publish, 
  AlertTriangle,
  CheckCircle,
  GripVertical,
  Edit,
  Copy,
  Trash2,
  Clock,
  Users,
  Target
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { useExamBuilder } from '@/contexts/ExamBuilderContext';
import { ExamBuilderAPIService } from '@/services/examBuilderService';
import { QuestionEditor } from './QuestionEditor';
import { ExamSettingsModal } from './ExamSettingsModal';
import { QuestionCard } from './QuestionCard';
import { QuestionTypeSelector } from './QuestionTypeSelector';

interface ExamBuilderProps {
  courseId?: number;
  examId?: number;
}

export function ExamBuilder({ courseId, examId }: ExamBuilderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { state, dispatch } = useExamBuilder();
  
  const [showNewQuestionDialog, setShowNewQuestionDialog] = useState(false);
  const [showBulkImportDialog, setShowBulkImportDialog] = useState(false);

  // Load exam data if examId is provided
  const { data: examData, isLoading: examLoading } = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => examId ? ExamBuilderAPIService.getExamDetails(examId) : null,
    enabled: !!examId,
  });

  // Load course data if courseId is provided
  const { data: courseData } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseId ? fetch(`/api/courses/${courseId}`).then(res => res.json()) : null,
    enabled: !!courseId,
  });

  // Load question templates
  const { data: questionTemplates } = useQuery({
    queryKey: ['question-templates'],
    queryFn: ExamBuilderAPIService.getQuestionTemplates,
  });

  // Load supported question types
  const { data: supportedTypes } = useQuery({
    queryKey: ['supported-question-types'],
    queryFn: ExamBuilderAPIService.getSupportedQuestionTypes,
  });

  // Initialize context with loaded data
  useEffect(() => {
    if (courseData) {
      dispatch({ type: 'SET_CURRENT_COURSE', payload: courseData });
    }
  }, [courseData, dispatch]);

  useEffect(() => {
    if (examData) {
      dispatch({ type: 'SET_CURRENT_EXAM', payload: examData.exam });
      dispatch({ type: 'SET_QUESTIONS', payload: examData.questions });
    }
  }, [examData, dispatch]);

  // Create exam mutation
  const createExamMutation = useMutation({
    mutationFn: (examData: any) => ExamBuilderAPIService.createExam(courseId!, examData),
    onSuccess: (newExam) => {
      dispatch({ type: 'SET_CURRENT_EXAM', payload: newExam });
      toast({
        title: "Exam Created",
        description: "New exam has been created successfully.",
      });
      navigate(`/admin/exam-builder/${newExam.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create exam",
        variant: "destructive",
      });
    },
  });

  // Add question mutation
  const addQuestionMutation = useMutation({
    mutationFn: (questionData: any) => ExamBuilderAPIService.addQuestion(state.currentExam!.id, questionData),
    onSuccess: (newQuestion) => {
      dispatch({ type: 'ADD_QUESTION', payload: newQuestion });
      setShowNewQuestionDialog(false);
      toast({
        title: "Question Added",
        description: "New question has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add question",
        variant: "destructive",
      });
    },
  });

  // Duplicate question mutation
  const duplicateQuestionMutation = useMutation({
    mutationFn: (questionId: number) => ExamBuilderAPIService.duplicateQuestion(questionId),
    onSuccess: (duplicatedQuestion) => {
      dispatch({ type: 'ADD_QUESTION', payload: duplicatedQuestion });
      toast({
        title: "Question Duplicated",
        description: "Question has been duplicated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to duplicate question",
        variant: "destructive",
      });
    },
  });

  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: number) => ExamBuilderAPIService.deleteQuestion(questionId),
    onSuccess: (_, questionId) => {
      dispatch({ type: 'DELETE_QUESTION', payload: questionId });
      toast({
        title: "Question Deleted",
        description: "Question has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete question",
        variant: "destructive",
      });
    },
  });

  // Reorder questions mutation
  const reorderQuestionsMutation = useMutation({
    mutationFn: (questionOrder: number[]) => ExamBuilderAPIService.reorderQuestions(state.currentExam!.id, questionOrder),
    onSuccess: () => {
      toast({
        title: "Questions Reordered",
        description: "Question order has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reorder questions",
        variant: "destructive",
      });
    },
  });

  // Validate exam mutation
  const validateExamMutation = useMutation({
    mutationFn: () => ExamBuilderAPIService.validateExam(state.currentExam!.id),
    onSuccess: (validationResult) => {
      dispatch({ type: 'SET_VALIDATION_RESULT', payload: validationResult });
      if (validationResult.isValid) {
        toast({
          title: "Validation Successful",
          description: "Exam is ready for publishing.",
        });
      } else {
        toast({
          title: "Validation Issues",
          description: `Found ${validationResult.errors.length} errors that need to be fixed.`,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to validate exam",
        variant: "destructive",
      });
    },
  });

  // Publish exam mutation
  const publishExamMutation = useMutation({
    mutationFn: () => ExamBuilderAPIService.publishExam(state.currentExam!.id),
    onSuccess: (publishedExam) => {
      dispatch({ type: 'SET_CURRENT_EXAM', payload: publishedExam });
      toast({
        title: "Exam Published",
        description: "Exam is now available to students.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to publish exam",
        variant: "destructive",
      });
    },
  });

  // Drag and drop handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = state.questions.findIndex(q => q.id === active.id);
      const newIndex = state.questions.findIndex(q => q.id === over.id);
      
      const newQuestions = arrayMove(state.questions, oldIndex, newIndex);
      dispatch({ type: 'REORDER_QUESTIONS', payload: newQuestions });
      
      const questionOrder = newQuestions.map(q => q.id);
      reorderQuestionsMutation.mutate(questionOrder);
    }
  };

  const handleCreateExam = () => {
    const examData = {
      title: 'New Exam',
      description: 'A new exam created with the exam builder',
      timeLimit: 60,
      attemptsAllowed: 3,
      passingScore: 70,
      examType: 'quiz' as const,
    };
    createExamMutation.mutate(examData);
  };

  const handleAddQuestion = (questionType: string) => {
    if (!questionTemplates || !state.currentExam) return;
    
    const template = questionTemplates[questionType];
    if (template) {
      addQuestionMutation.mutate(template);
    }
  };

  const handleEditQuestion = (question: any) => {
    dispatch({ type: 'SET_EDITING_QUESTION', payload: question });
    dispatch({ type: 'TOGGLE_QUESTION_EDITOR', payload: true });
  };

  const handleValidateAndPublish = () => {
    validateExamMutation.mutate();
  };

  if (examLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!state.currentExam && !courseId) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Create New Exam</h2>
              <p className="text-gray-600 mb-6">Start building your exam with our comprehensive quiz builder.</p>
              <Button onClick={handleCreateExam} disabled={createExamMutation.isPending}>
                {createExamMutation.isPending ? 'Creating...' : 'Create Exam'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {state.currentExam?.title || 'New Exam'}
          </h1>
          <p className="text-gray-600 mt-1">
            {state.currentCourse?.title && `Course: ${state.currentCourse.title}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: 'TOGGLE_EXAM_SETTINGS', payload: true })}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="outline"
            onClick={handleValidateAndPublish}
            disabled={validateExamMutation.isPending}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={() => publishExamMutation.mutate()}
            disabled={publishExamMutation.isPending || !state.validationResult?.isValid}
          >
            <Publish className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Exam Stats */}
      {state.currentExam && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Target className="w-4 h-4 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="text-2xl font-bold">{state.questions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Time Limit</p>
                  <p className="text-2xl font-bold">{state.currentExam.timeLimit}m</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-purple-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Attempts</p>
                  <p className="text-2xl font-bold">{state.currentExam.attemptsAllowed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Passing Score</p>
                  <p className="text-2xl font-bold">{state.currentExam.passingScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Validation Results */}
      {state.validationResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              {state.validationResult.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              )}
              Exam Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.validationResult.isValid ? (
              <p className="text-green-600">Exam is ready for publishing!</p>
            ) : (
              <div>
                <p className="text-red-600 mb-2">Issues found:</p>
                <ul className="list-disc list-inside space-y-1">
                  {state.validationResult.errors.map((error: string, index: number) => (
                    <li key={index} className="text-red-600">{error}</li>
                  ))}
                </ul>
                {state.validationResult.warnings.length > 0 && (
                  <div className="mt-4">
                    <p className="text-orange-600 mb-2">Warnings:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {state.validationResult.warnings.map((warning: string, index: number) => (
                        <li key={index} className="text-orange-600">{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Questions</CardTitle>
            <Button onClick={() => setShowNewQuestionDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {state.questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No questions added yet</p>
              <Button onClick={() => setShowNewQuestionDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Question
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext items={state.questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {state.questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      onEdit={() => handleEditQuestion(question)}
                      onDuplicate={() => duplicateQuestionMutation.mutate(question.id)}
                      onDelete={() => deleteQuestionMutation.mutate(question.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Question Type Selector Dialog */}
      <Dialog open={showNewQuestionDialog} onOpenChange={setShowNewQuestionDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>
          <QuestionTypeSelector
            onSelectType={handleAddQuestion}
            supportedTypes={supportedTypes?.supportedTypes || []}
            templates={questionTemplates || {}}
          />
        </DialogContent>
      </Dialog>

      {/* Question Editor */}
      {state.showQuestionEditor && (
        <QuestionEditor />
      )}

      {/* Exam Settings Modal */}
      {state.showExamSettings && (
        <ExamSettingsModal />
      )}
    </div>
  );
}