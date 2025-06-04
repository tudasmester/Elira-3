import React from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock,
  Users,
  Target,
  Shuffle,
  Eye,
  CheckCircle,
  ArrowLeft,
  Settings
} from 'lucide-react';

import { useExamBuilder } from '@/contexts/ExamBuilderContext';
import { ExamBuilderAPIService, ExamSettings } from '@/services/examBuilderService';

const examSettingsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  timeLimit: z.number().min(1, 'Time limit must be at least 1 minute'),
  attemptsAllowed: z.number().min(1, 'At least 1 attempt must be allowed'),
  passingScore: z.number().min(0).max(100, 'Passing score must be between 0 and 100'),
  examType: z.enum(['quiz', 'exam', 'assessment']),
  shuffleQuestions: z.boolean(),
  showResults: z.boolean(),
  showCorrectAnswers: z.boolean(),
  allowBackTracking: z.boolean().optional(),
  randomizeOptions: z.boolean().optional(),
  immediateCorrection: z.boolean().optional(),
});

type ExamSettingsFormData = z.infer<typeof examSettingsSchema>;

export function ExamSettingsModal() {
  const { state, dispatch } = useExamBuilder();
  const { toast } = useToast();

  const form = useForm<ExamSettingsFormData>({
    resolver: zodResolver(examSettingsSchema),
    defaultValues: {
      title: state.currentExam?.title || '',
      description: state.currentExam?.description || '',
      timeLimit: state.currentExam?.timeLimit || 60,
      attemptsAllowed: state.currentExam?.attemptsAllowed || 3,
      passingScore: state.currentExam?.passingScore || 70,
      examType: (state.currentExam?.examType as 'quiz' | 'exam' | 'assessment') || 'quiz',
      shuffleQuestions: state.currentExam?.shuffleQuestions || false,
      showResults: state.currentExam?.showResults !== false,
      showCorrectAnswers: state.currentExam?.showCorrectAnswers !== false,
      allowBackTracking: true,
      randomizeOptions: false,
      immediateCorrection: false,
    },
  });

  // Update exam settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (settings: ExamSettings) => 
      ExamBuilderAPIService.updateExamSettings(state.currentExam!.id, settings),
    onSuccess: (updatedExam) => {
      dispatch({ type: 'SET_CURRENT_EXAM', payload: updatedExam });
      handleClose();
      toast({
        title: "Settings Updated",
        description: "Exam settings have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update exam settings",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_EXAM_SETTINGS', payload: false });
  };

  const handleSubmit = (data: ExamSettingsFormData) => {
    updateSettingsMutation.mutate(data);
  };

  const watchedExamType = form.watch('examType');
  const watchedTimeLimit = form.watch('timeLimit');
  const watchedAttempts = form.watch('attemptsAllowed');

  return (
    <Dialog open={state.showExamSettings} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Exam Settings
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Exam Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter exam title..."
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this exam covers..."
                  {...form.register('description')}
                  className="min-h-[80px]"
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type</Label>
                <Select
                  value={form.watch('examType')}
                  onValueChange={(value) => form.setValue('examType', value as 'quiz' | 'exam' | 'assessment')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz - Quick knowledge check</SelectItem>
                    <SelectItem value="exam">Exam - Formal assessment</SelectItem>
                    <SelectItem value="assessment">Assessment - Comprehensive evaluation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Timing & Attempts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Timing & Attempts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes) *</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1"
                    {...form.register('timeLimit', { valueAsNumber: true })}
                  />
                  {form.formState.errors.timeLimit && (
                    <p className="text-sm text-red-500">{form.formState.errors.timeLimit.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Estimated reading time: {Math.ceil(watchedTimeLimit / 2)} minutes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attemptsAllowed">Attempts Allowed *</Label>
                  <Input
                    id="attemptsAllowed"
                    type="number"
                    min="1"
                    max="10"
                    {...form.register('attemptsAllowed', { valueAsNumber: true })}
                  />
                  {form.formState.errors.attemptsAllowed && (
                    <p className="text-sm text-red-500">{form.formState.errors.attemptsAllowed.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {watchedAttempts === 1 ? 'Single attempt only' : `${watchedAttempts} attempts allowed`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scoring */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Scoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score (%) *</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    {...form.register('passingScore', { valueAsNumber: true })}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
                {form.formState.errors.passingScore && (
                  <p className="text-sm text-red-500">{form.formState.errors.passingScore.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question Behavior */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shuffle className="w-5 h-5 mr-2" />
                Question Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="shuffleQuestions">Shuffle Questions</Label>
                  <p className="text-sm text-gray-500">Randomize question order for each attempt</p>
                </div>
                <Switch
                  id="shuffleQuestions"
                  {...form.register('shuffleQuestions')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="randomizeOptions">Randomize Answer Options</Label>
                  <p className="text-sm text-gray-500">Shuffle answer choices for multiple choice questions</p>
                </div>
                <Switch
                  id="randomizeOptions"
                  {...form.register('randomizeOptions')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="allowBackTracking">Allow Back Tracking</Label>
                  <p className="text-sm text-gray-500">Students can return to previous questions</p>
                </div>
                <Switch
                  id="allowBackTracking"
                  {...form.register('allowBackTracking')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Results & Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Results & Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="showResults">Show Results</Label>
                  <p className="text-sm text-gray-500">Display score and performance to students</p>
                </div>
                <Switch
                  id="showResults"
                  {...form.register('showResults')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="showCorrectAnswers">Show Correct Answers</Label>
                  <p className="text-sm text-gray-500">Reveal correct answers after completion</p>
                </div>
                <Switch
                  id="showCorrectAnswers"
                  {...form.register('showCorrectAnswers')}
                  disabled={!form.watch('showResults')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="immediateCorrection">Immediate Correction</Label>
                  <p className="text-sm text-gray-500">Show feedback after each question</p>
                </div>
                <Switch
                  id="immediateCorrection"
                  {...form.register('immediateCorrection')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Exam Type Specific Settings */}
          {watchedExamType && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {watchedExamType.charAt(0).toUpperCase() + watchedExamType.slice(1)} Specific Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {watchedExamType === 'quiz' && (
                  <div className="text-sm text-gray-600">
                    <p>Quizzes are typically shorter assessments designed for quick knowledge checks. Recommended settings:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Time limit: 10-30 minutes</li>
                      <li>Multiple attempts allowed</li>
                      <li>Show immediate feedback</li>
                    </ul>
                  </div>
                )}

                {watchedExamType === 'exam' && (
                  <div className="text-sm text-gray-600">
                    <p>Exams are formal assessments with stricter controls. Recommended settings:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Time limit: 45-120 minutes</li>
                      <li>Limited attempts (1-2)</li>
                      <li>Shuffle questions for security</li>
                      <li>No immediate feedback</li>
                    </ul>
                  </div>
                )}

                {watchedExamType === 'assessment' && (
                  <div className="text-sm text-gray-600">
                    <p>Assessments are comprehensive evaluations. Recommended settings:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Extended time limits</li>
                      <li>Allow back tracking</li>
                      <li>Detailed feedback</li>
                      <li>Multiple question types</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}