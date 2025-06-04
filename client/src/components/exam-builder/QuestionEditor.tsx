import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Check, X, Upload, Image as ImageIcon } from 'lucide-react';

import { useExamBuilder } from '@/contexts/ExamBuilderContext';
import { ExamBuilderAPIService } from '@/services/examBuilderService';
import { QuizQuestionOption } from '@shared/schema';

const questionSchema = z.object({
  questionText: z.string().min(1, 'Question text is required'),
  questionType: z.string().min(1, 'Question type is required'),
  points: z.number().min(0, 'Points must be non-negative').optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  isRequired: z.boolean().optional(),
  explanation: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionOption {
  id?: number;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
}

export function QuestionEditor() {
  const { state, dispatch } = useExamBuilder();
  const { toast } = useToast();
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionText: '',
      questionType: 'multiple_choice',
      points: 1,
      imageUrl: '',
      videoUrl: '',
      isRequired: false,
      explanation: '',
    },
  });

  // Initialize form with editing question data
  useEffect(() => {
    if (state.editingQuestion) {
      const question = state.editingQuestion;
      form.reset({
        questionText: question.questionText,
        questionType: question.questionType,
        points: question.points || 1,
        imageUrl: question.imageUrl || '',
        videoUrl: question.videoUrl || '',
        isRequired: question.isRequired || false,
        explanation: question.explanation || '',
      });

      // Set options if they exist
      if (question.options) {
        setOptions(question.options.map(opt => ({
          id: opt.id,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          orderIndex: opt.orderIndex,
        })));
      } else {
        // Initialize with empty options for certain question types
        if (question.questionType === 'multiple_choice') {
          setOptions([
            { optionText: '', isCorrect: false, orderIndex: 0 },
            { optionText: '', isCorrect: false, orderIndex: 1 },
          ]);
        } else if (question.questionType === 'true_false') {
          setOptions([
            { optionText: 'True', isCorrect: false, orderIndex: 0 },
            { optionText: 'False', isCorrect: false, orderIndex: 1 },
          ]);
        }
      }
    }
  }, [state.editingQuestion, form]);

  // Update question mutation
  const updateQuestionMutation = useMutation({
    mutationFn: (questionData: any) => {
      if (state.editingQuestion) {
        return ExamBuilderAPIService.updateQuestion(state.editingQuestion.id, questionData);
      } else {
        return ExamBuilderAPIService.addQuestion(state.currentExam!.id, questionData);
      }
    },
    onSuccess: (updatedQuestion) => {
      if (state.editingQuestion) {
        dispatch({ type: 'UPDATE_QUESTION', payload: { ...updatedQuestion, options } });
      } else {
        dispatch({ type: 'ADD_QUESTION', payload: { ...updatedQuestion, options } });
      }
      handleClose();
      toast({
        title: state.editingQuestion ? "Question Updated" : "Question Added",
        description: "Question has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save question",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_QUESTION_EDITOR', payload: false });
    dispatch({ type: 'SET_EDITING_QUESTION', payload: null });
    form.reset();
    setOptions([]);
    setImageFile(null);
  };

  const handleSubmit = (data: QuestionFormData) => {
    const questionData = {
      ...data,
      options: needsOptions(data.questionType) ? options : undefined,
    };

    updateQuestionMutation.mutate(questionData);
  };

  const needsOptions = (questionType: string) => {
    return ['multiple_choice', 'true_false', 'match_ordering'].includes(questionType);
  };

  const addOption = () => {
    setOptions(prev => [
      ...prev,
      { optionText: '', isCorrect: false, orderIndex: prev.length }
    ]);
  };

  const updateOption = (index: number, field: keyof QuestionOption, value: any) => {
    setOptions(prev => prev.map((opt, i) => 
      i === index ? { ...opt, [field]: value } : opt
    ));
  };

  const removeOption = (index: number) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      // In a real implementation, you would upload this to a storage service
      const imageUrl = URL.createObjectURL(file);
      form.setValue('imageUrl', imageUrl);
    }
  };

  const watchedQuestionType = form.watch('questionType');

  return (
    <Dialog open={state.showQuestionEditor} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {state.editingQuestion ? 'Edit Question' : 'Add New Question'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Question Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="questionText">Question Text *</Label>
              <Textarea
                id="questionText"
                placeholder="Enter your question..."
                {...form.register('questionText')}
                className="min-h-[100px]"
              />
              {form.formState.errors.questionText && (
                <p className="text-sm text-red-500">{form.formState.errors.questionText.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  {...form.register('points', { valueAsNumber: true })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isRequired"
                  {...form.register('isRequired')}
                />
                <Label htmlFor="isRequired">Required Question</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="outline">{watchedQuestionType.replace('_', ' ').toUpperCase()}</Badge>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Media (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUpload">Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  <Button type="button" size="sm" variant="outline">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                {form.watch('imageUrl') && (
                  <div className="mt-2">
                    <img 
                      src={form.watch('imageUrl')} 
                      alt="Question image" 
                      className="max-w-xs max-h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  {...form.register('videoUrl')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Question Options */}
          {needsOptions(watchedQuestionType) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Answer Options</CardTitle>
                {watchedQuestionType === 'multiple_choice' && (
                  <Button type="button" size="sm" variant="outline" onClick={addOption}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateOption(index, 'isCorrect', !option.isCorrect)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          option.isCorrect 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300'
                        }`}
                      >
                        {option.isCorrect && <Check className="w-3 h-3" />}
                      </button>
                      <span className="text-sm text-gray-500">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={option.optionText}
                      onChange={(e) => updateOption(index, 'optionText', e.target.value)}
                      className="flex-1"
                      disabled={watchedQuestionType === 'true_false'}
                    />

                    {watchedQuestionType === 'multiple_choice' && options.length > 2 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {options.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No options added yet. Click "Add Option" to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              placeholder="Provide an explanation for the correct answer..."
              {...form.register('explanation')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateQuestionMutation.isPending}
            >
              {updateQuestionMutation.isPending 
                ? 'Saving...' 
                : state.editingQuestion 
                  ? 'Update Question' 
                  : 'Add Question'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}