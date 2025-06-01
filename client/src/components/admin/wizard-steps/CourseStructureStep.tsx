import { useFormContext, useFieldArray } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, Target, BookOpen } from 'lucide-react';

export function CourseStructureStep() {
  const { control, watch } = useFormContext();
  
  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = useFieldArray({
    control,
    name: 'learningObjectives',
  });

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: 'modules',
  });

  const watchedModules = watch('modules');
  const totalDuration = watchedModules?.reduce((total: number, module: any) => 
    total + (parseFloat(module.estimatedDuration) || 0), 0
  ) || 0;

  return (
    <div className="space-y-8">
      {/* Learning Objectives Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Objectives
          </CardTitle>
          <FormDescription>
            Define what students will be able to do after completing this course. These should be specific, measurable outcomes.
          </FormDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {objectiveFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={control}
                name={`learningObjectives.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder={`Objective ${index + 1}: e.g., Build responsive websites using HTML, CSS, and JavaScript`}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {objectiveFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeObjective(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => appendObjective('')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Learning Objective
          </Button>
        </CardContent>
      </Card>

      {/* Course Modules Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Modules
              </CardTitle>
              <FormDescription>
                Organize your course content into logical modules. Each module should cover a specific topic or skill area.
              </FormDescription>
            </div>
            <Badge variant="secondary">
              Total: {totalDuration.toFixed(1)} hours
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {moduleFields.map((field, index) => (
            <Card key={field.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">Module {index + 1}</Badge>
                  </div>
                  {moduleFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeModule(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      control={control}
                      name={`modules.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Module Title *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Introduction to React Fundamentals" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={control}
                    name={`modules.${index}.estimatedDuration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (hours) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0.5" 
                            step="0.5"
                            placeholder="e.g., 4" 
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name={`modules.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what students will learn in this module, including key topics and practical exercises..."
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => appendModule({ title: '', description: '', estimatedDuration: 1 })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </CardContent>
      </Card>

      {/* Course Summary */}
      {moduleFields.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Course Structure Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{moduleFields.length}</div>
                <div className="text-sm text-muted-foreground">Modules</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{objectiveFields.length}</div>
                <div className="text-sm text-muted-foreground">Learning Objectives</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{totalDuration.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Total Hours</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {Math.ceil(totalDuration / 2)}
                </div>
                <div className="text-sm text-muted-foreground">Estimated Weeks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}