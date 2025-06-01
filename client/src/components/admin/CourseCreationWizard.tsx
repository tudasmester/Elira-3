import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  CheckCircle, 
  FileText,
  BarChart3,
  DollarSign,
  Image,
  Search
} from 'lucide-react';

// Step 1: Course Basics
import { CourseBasicsStep } from './wizard-steps/CourseBasicsStep';
// Step 2: Course Structure  
import { CourseStructureStep } from './wizard-steps/CourseStructureStep';
// Step 3: Pricing & Access
import { PricingAccessStep } from './wizard-steps/PricingAccessStep';
// Step 4: Media & Branding
import { MediaBrandingStep } from './wizard-steps/MediaBrandingStep';
// Step 5: SEO & Marketing
import { SeoMarketingStep } from './wizard-steps/SeoMarketingStep';

// Form validation schema
const courseWizardSchema = z.object({
  // Step 1: Course Basics
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subtitle: z.string().min(10, 'Subtitle must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.string().min(1, 'Please select a category'),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select a difficulty level',
  }),
  estimatedDuration: z.number().min(1, 'Duration must be at least 1 hour'),
  
  // Step 2: Course Structure
  learningObjectives: z.array(z.string().min(5, 'Each objective must be at least 5 characters')).min(3, 'Add at least 3 learning objectives'),
  modules: z.array(z.object({
    title: z.string().min(3, 'Module title required'),
    description: z.string().min(10, 'Module description required'),
    estimatedDuration: z.number().min(0.5, 'Minimum 30 minutes'),
  })).min(1, 'Add at least 1 module'),
  
  // Step 3: Pricing & Access
  isPaid: z.boolean(),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  originalPrice: z.number().min(0, 'Original price cannot be negative').optional(),
  enrollmentLimit: z.number().min(0, 'Enrollment limit cannot be negative').optional(),
  prerequisites: z.array(z.string()).optional(),
  
  // Step 4: Media & Branding
  imageUrl: z.string().url('Please provide a valid image URL').optional(),
  promoVideoUrl: z.string().url('Please provide a valid video URL').optional(),
  colorScheme: z.string().optional(),
  
  // Step 5: SEO & Marketing
  metaDescription: z.string().min(120, 'Meta description should be at least 120 characters').max(160, 'Meta description should not exceed 160 characters'),
  tags: z.array(z.string().min(2, 'Each tag must be at least 2 characters')).min(3, 'Add at least 3 tags'),
  promotionalContent: z.string().min(100, 'Promotional content must be at least 100 characters'),
});

type CourseWizardFormData = z.infer<typeof courseWizardSchema>;

const steps = [
  {
    id: 1,
    title: 'Course Basics',
    description: 'Title, description, and core details',
    icon: FileText,
  },
  {
    id: 2,
    title: 'Course Structure',
    description: 'Modules and learning objectives',
    icon: BarChart3,
  },
  {
    id: 3,
    title: 'Pricing & Access',
    description: 'Pricing tiers and enrollment settings',
    icon: DollarSign,
  },
  {
    id: 4,
    title: 'Media & Branding',
    description: 'Images, videos, and visual identity',
    icon: Image,
  },
  {
    id: 5,
    title: 'SEO & Marketing',
    description: 'Optimization and promotional content',
    icon: Search,
  },
];

interface CourseCreationWizardProps {
  onComplete: (courseId: number) => void;
  onCancel: () => void;
  initialData?: Partial<CourseWizardFormData>;
}

export function CourseCreationWizard({ onComplete, onCancel, initialData }: CourseCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const methods = useForm<CourseWizardFormData>({
    resolver: zodResolver(courseWizardSchema),
    defaultValues: {
      isPaid: false,
      estimatedDuration: 1,
      learningObjectives: [''],
      modules: [{ title: '', description: '', estimatedDuration: 1 }],
      prerequisites: [],
      tags: [''],
      ...initialData,
    },
    mode: 'onChange',
  });

  const { handleSubmit, trigger, getValues, watch } = methods;
  const watchedValues = watch();

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: Partial<CourseWizardFormData>) => {
      const response = await apiRequest('POST', '/api/admin/courses/draft', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Draft Saved',
        description: 'Your course draft has been saved successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Save Failed',
        description: 'Failed to save draft. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseWizardFormData) => {
      const response = await apiRequest('POST', '/api/admin/courses', {
        ...data,
        status: 'draft',
      });
      return response.json();
    },
    onSuccess: (course) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      toast({
        title: 'Course Created',
        description: 'Your course has been created successfully!',
      });
      onComplete(course.id);
    },
    onError: () => {
      toast({
        title: 'Creation Failed',
        description: 'Failed to create course. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const validateCurrentStep = async () => {
    const stepFields = getStepFields(currentStep);
    const isValid = await trigger(stepFields as any);
    return isValid;
  };

  const getStepFields = (step: number): (keyof CourseWizardFormData)[] => {
    switch (step) {
      case 1:
        return ['title', 'subtitle', 'description', 'category', 'level', 'estimatedDuration'];
      case 2:
        return ['learningObjectives', 'modules'];
      case 3:
        return ['isPaid', 'price', 'originalPrice', 'enrollmentLimit'];
      case 4:
        return ['imageUrl', 'promoVideoUrl', 'colorScheme'];
      case 5:
        return ['metaDescription', 'tags', 'promotionalContent'];
      default:
        return [];
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = async (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    } else if (stepNumber === currentStep + 1) {
      await handleNext();
    }
  };

  const handleSaveDraft = () => {
    const currentData = getValues();
    saveDraftMutation.mutate(currentData);
  };

  const onSubmit = (data: CourseWizardFormData) => {
    createCourseMutation.mutate(data);
  };

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CourseBasicsStep />;
      case 2:
        return <CourseStructureStep />;
      case 3:
        return <PricingAccessStep />;
      case 4:
        return <MediaBrandingStep />;
      case 5:
        return <SeoMarketingStep />;
      default:
        return <CourseBasicsStep />;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">
            Follow these steps to create a comprehensive course for your students
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center">
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const isAccessible = step.id <= currentStep || completedSteps.includes(step.id);

              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && handleStepClick(step.id)}
                  disabled={!isAccessible}
                  className={`flex flex-col items-center space-y-2 p-4 rounded-lg border transition-all ${
                    isCurrent
                      ? 'border-primary bg-primary/5 text-primary'
                      : isCompleted
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : isAccessible
                      ? 'border-gray-200 hover:border-gray-300 text-gray-600'
                      : 'border-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-muted-foreground max-w-24">
                      {step.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Step Content */}
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={saveDraftMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>

          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit(onSubmit)}
                disabled={createCourseMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}