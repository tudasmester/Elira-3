import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Upload,
  Video,
  FileText,
  HelpCircle,
  Link,
  Image,
  Play,
  Pause,
  Download,
  X
} from 'lucide-react';

// Schema for lesson content
const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  videoUrl: z.string().url().optional().or(z.literal('')),
  videoEmbedCode: z.string().optional(),
  estimatedDuration: z.number().min(1, 'Duration must be at least 1 minute'),
  order: z.number(),
  attachments: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    type: z.string(),
    size: z.number(),
  })),
  quizzes: z.array(z.object({
    id: z.string(),
    question: z.string(),
    type: z.enum(['multiple_choice', 'true_false', 'short_answer']),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string(),
    explanation: z.string().optional(),
    points: z.number().default(1),
  })),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonEditorProps {
  moduleId: number;
  lessonId?: number;
  onSave?: (lesson: LessonFormData) => void;
  onCancel?: () => void;
}

export function LessonEditor({ moduleId, lessonId, onSave, onCancel }: LessonEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Form setup
  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      videoUrl: '',
      videoEmbedCode: '',
      estimatedDuration: 10,
      order: 1,
      attachments: [],
      quizzes: [],
    },
  });

  const { fields: attachmentFields, append: appendAttachment, remove: removeAttachment } = useFieldArray({
    control: form.control,
    name: 'attachments',
  });

  const { fields: quizFields, append: appendQuiz, remove: removeQuiz, move: moveQuiz } = useFieldArray({
    control: form.control,
    name: 'quizzes',
  });

  // Load existing lesson data
  const { data: lessonData, isLoading } = useQuery({
    queryKey: [`/api/lessons/${lessonId}`],
    enabled: !!lessonId,
  });

  // Auto-save functionality
  const autoSaveMutation = useMutation({
    mutationFn: async (data: Partial<LessonFormData>) => {
      if (lessonId) {
        return await apiRequest('PUT', `/api/lessons/${lessonId}`, data);
      } else {
        return await apiRequest('POST', `/api/modules/${moduleId}/lessons`, data);
      }
    },
    onMutate: () => setAutoSaveStatus('saving'),
    onSuccess: () => {
      setAutoSaveStatus('saved');
      queryClient.invalidateQueries({ queryKey: [`/api/modules/${moduleId}/lessons`] });
    },
    onError: () => {
      setAutoSaveStatus('unsaved');
      toast({
        title: 'Auto-save failed',
        description: 'Your changes could not be saved automatically.',
        variant: 'destructive',
      });
    },
  });

  // Save lesson
  const saveMutation = useMutation({
    mutationFn: async (data: LessonFormData) => {
      if (lessonId) {
        return await apiRequest('PUT', `/api/lessons/${lessonId}`, data);
      } else {
        return await apiRequest('POST', `/api/modules/${moduleId}/lessons`, data);
      }
    },
    onSuccess: (data) => {
      toast({
        title: 'Lesson saved',
        description: 'The lesson has been saved successfully.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/modules/${moduleId}/lessons`] });
      onSave?.(data);
    },
    onError: () => {
      toast({
        title: 'Save failed',
        description: 'Failed to save the lesson. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Auto-save debounced effect
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && autoSaveStatus !== 'saving') {
        setAutoSaveStatus('unsaved');
        const timeoutId = setTimeout(() => {
          autoSaveMutation.mutate(value as Partial<LessonFormData>);
        }, 2000);
        return () => clearTimeout(timeoutId);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, autoSaveMutation, autoSaveStatus]);

  // Load lesson data into form
  useEffect(() => {
    if (lessonData) {
      form.reset(lessonData);
    }
  }, [lessonData, form]);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload/lesson-attachment', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      
      appendAttachment({
        id: result.id,
        name: file.name,
        url: result.url,
        type: file.type,
        size: file.size,
      });
      
      toast({
        title: 'File uploaded',
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingFile(false);
    }
  }, [appendAttachment, toast]);

  // Handle quiz drag and drop
  const handleQuizDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    moveQuiz(result.source.index, result.destination.index);
  }, [moveQuiz]);

  // Add new quiz
  const addQuiz = useCallback((type: 'multiple_choice' | 'true_false' | 'short_answer') => {
    appendQuiz({
      id: `quiz_${Date.now()}`,
      question: '',
      type,
      options: type === 'multiple_choice' ? ['', '', '', ''] : undefined,
      correctAnswer: '',
      explanation: '',
      points: 1,
    });
  }, [appendQuiz]);

  const onSubmit = (data: LessonFormData) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {lessonId ? 'Edit Lesson' : 'Create New Lesson'}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={autoSaveStatus === 'saved' ? 'default' : autoSaveStatus === 'saving' ? 'secondary' : 'destructive'}>
              {autoSaveStatus === 'saved' ? 'Saved' : autoSaveStatus === 'saving' ? 'Saving...' : 'Unsaved'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={saveMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save Lesson'}
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        <LessonPreview data={form.getValues()} />
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Lesson Title</Label>
                    <Input
                      id="title"
                      {...form.register('title')}
                      placeholder="Enter lesson title"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...form.register('description')}
                      placeholder="Brief description of the lesson"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimatedDuration">Duration (minutes)</Label>
                      <Input
                        id="estimatedDuration"
                        type="number"
                        {...form.register('estimatedDuration', { valueAsNumber: true })}
                        min={1}
                      />
                    </div>
                    <div>
                      <Label htmlFor="order">Lesson Order</Label>
                      <Input
                        id="order"
                        type="number"
                        {...form.register('order', { valueAsNumber: true })}
                        min={1}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lesson Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    value={form.watch('content')}
                    onChange={(content) => form.setValue('content', content)}
                    placeholder="Write your lesson content here..."
                  />
                  {form.formState.errors.content && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      {...form.register('videoUrl')}
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>

                  <div>
                    <Label htmlFor="videoEmbedCode">Or Embed Code</Label>
                    <Textarea
                      id="videoEmbedCode"
                      {...form.register('videoEmbedCode')}
                      placeholder="<iframe src='...'></iframe>"
                      rows={4}
                    />
                  </div>

                  {(form.watch('videoUrl') || form.watch('videoEmbedCode')) && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Video Preview</h3>
                      <VideoPreview 
                        url={form.watch('videoUrl')} 
                        embedCode={form.watch('videoEmbedCode')} 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attachments Tab */}
            <TabsContent value="attachments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    File Attachments
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(handleFileUpload);
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={uploadingFile}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingFile ? 'Uploading...' : 'Upload Files'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {attachmentFields.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No attachments yet. Upload files to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {attachmentFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{field.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(field.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(field.url, '_blank')}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Lesson Quizzes
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addQuiz('multiple_choice')}
                      >
                        Multiple Choice
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addQuiz('true_false')}
                      >
                        True/False
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addQuiz('short_answer')}
                      >
                        Short Answer
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {quizFields.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No quizzes yet. Add questions to test student understanding.</p>
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={handleQuizDragEnd}>
                      <Droppable droppableId="quizzes">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                            {quizFields.map((field, index) => (
                              <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="border rounded-lg p-4"
                                  >
                                    <QuizEditor
                                      quiz={field}
                                      index={index}
                                      form={form}
                                      onRemove={() => removeQuiz(index)}
                                      dragHandleProps={provided.dragHandleProps}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      )}
    </div>
  );
}

// Rich Text Editor Component
function RichTextEditor({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="border rounded-lg">
      <div className="border-b p-2 flex gap-1">
        <Button type="button" variant="ghost" size="sm">Bold</Button>
        <Button type="button" variant="ghost" size="sm">Italic</Button>
        <Button type="button" variant="ghost" size="sm">Link</Button>
        <Button type="button" variant="ghost" size="sm">List</Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={10}
        className="border-0 resize-none focus-visible:ring-0"
      />
    </div>
  );
}

// Video Preview Component
function VideoPreview({ url, embedCode }: { url?: string; embedCode?: string }) {
  if (embedCode) {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: embedCode }}
        className="aspect-video bg-gray-100 rounded"
      />
    );
  }

  if (url) {
    return (
      <video controls className="aspect-video w-full bg-gray-100 rounded">
        <source src={url} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
      <Video className="w-12 h-12 text-gray-400" />
    </div>
  );
}

// Quiz Editor Component
function QuizEditor({ quiz, index, form, onRemove, dragHandleProps }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps}>
            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
          </div>
          <Badge variant="outline">
            {quiz.type.replace('_', ' ').toUpperCase()}
          </Badge>
          <span className="text-sm text-muted-foreground">Question {index + 1}</span>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <Label>Question</Label>
        <Textarea
          {...form.register(`quizzes.${index}.question`)}
          placeholder="Enter your question"
          rows={2}
        />
      </div>

      {quiz.type === 'multiple_choice' && (
        <div>
          <Label>Answer Options</Label>
          <div className="space-y-2">
            {[0, 1, 2, 3].map((optionIndex) => (
              <Input
                key={optionIndex}
                {...form.register(`quizzes.${index}.options.${optionIndex}`)}
                placeholder={`Option ${optionIndex + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>Correct Answer</Label>
        {quiz.type === 'true_false' ? (
          <Select
            value={form.watch(`quizzes.${index}.correctAnswer`)}
            onValueChange={(value) => form.setValue(`quizzes.${index}.correctAnswer`, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select correct answer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            {...form.register(`quizzes.${index}.correctAnswer`)}
            placeholder="Enter correct answer"
          />
        )}
      </div>

      <div>
        <Label>Explanation (Optional)</Label>
        <Textarea
          {...form.register(`quizzes.${index}.explanation`)}
          placeholder="Explain why this is the correct answer"
          rows={2}
        />
      </div>

      <div>
        <Label>Points</Label>
        <Input
          type="number"
          {...form.register(`quizzes.${index}.points`, { valueAsNumber: true })}
          min={1}
          max={10}
        />
      </div>
    </div>
  );
}

// Lesson Preview Component
function LessonPreview({ data }: { data: LessonFormData }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        {data.description && (
          <p className="text-lg text-muted-foreground">{data.description}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Estimated duration: {data.estimatedDuration} minutes
        </p>
      </div>

      {(data.videoUrl || data.videoEmbedCode) && (
        <Card>
          <CardContent className="p-6">
            <VideoPreview url={data.videoUrl} embedCode={data.videoEmbedCode} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            {data.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {data.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center gap-3 p-2 border rounded">
                  <FileText className="w-4 h-4" />
                  <span>{attachment.name}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.quizzes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.quizzes.map((quiz, index) => (
                <div key={quiz.id} className="space-y-3">
                  <h3 className="font-medium">Question {index + 1}: {quiz.question}</h3>
                  {quiz.type === 'multiple_choice' && quiz.options && (
                    <div className="space-y-2">
                      {quiz.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input type="radio" name={`quiz-${index}`} />
                          <label>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  {quiz.type === 'true_false' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="radio" name={`quiz-${index}`} />
                        <label>True</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name={`quiz-${index}`} />
                        <label>False</label>
                      </div>
                    </div>
                  )}
                  {quiz.type === 'short_answer' && (
                    <Input placeholder="Your answer..." />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}