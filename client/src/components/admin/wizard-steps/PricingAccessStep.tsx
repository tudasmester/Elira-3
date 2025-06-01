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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, DollarSign, Users, Lock } from 'lucide-react';

export function PricingAccessStep() {
  const { control, watch } = useFormContext();
  const isPaid = watch('isPaid');
  const price = watch('price');
  const originalPrice = watch('originalPrice');
  
  const {
    fields: prerequisiteFields,
    append: appendPrerequisite,
    remove: removePrerequisite,
  } = useFieldArray({
    control,
    name: 'prerequisites',
  });

  const discountPercentage = originalPrice && price && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Pricing Model */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing Model
          </CardTitle>
          <FormDescription>
            Choose whether this course is free or paid, and set pricing options.
          </FormDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Paid Course</FormLabel>
                  <FormDescription>
                    Enable this to charge students for access to your course
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {isPaid && (
            <div className="space-y-4 border-l-4 border-l-primary pl-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Price (USD) *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="99.00" 
                            className="pl-8"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        The current selling price for your course
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="149.00" 
                            className="pl-8"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Optional: Show a crossed-out higher price
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {discountPercentage > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-800">
                        Discount Applied
                      </div>
                      <div className="text-sm text-green-600">
                        Students save ${(originalPrice - price).toFixed(2)}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access & Enrollment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Access & Enrollment
          </CardTitle>
          <FormDescription>
            Set enrollment limits and access restrictions for your course.
          </FormDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="enrollmentLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enrollment Limit</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    placeholder="Leave empty for unlimited enrollment" 
                    {...field}
                    onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of students who can enroll. Leave empty for unlimited access.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Prerequisites
          </CardTitle>
          <FormDescription>
            Define any skills, knowledge, or other courses students should have before taking this course.
          </FormDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {prerequisiteFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={control}
                name={`prerequisites.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder={`Prerequisite ${index + 1}: e.g., Basic understanding of HTML and CSS`}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePrerequisite(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => appendPrerequisite('')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Prerequisite
          </Button>

          {prerequisiteFields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No prerequisites required</p>
              <p className="text-sm">This course is suitable for complete beginners</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {isPaid ? `$${price || 0}` : 'FREE'}
              </div>
              <div className="text-sm text-muted-foreground">Course Price</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {watch('enrollmentLimit') || '∞'}
              </div>
              <div className="text-sm text-muted-foreground">Max Students</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {prerequisiteFields.length}
              </div>
              <div className="text-sm text-muted-foreground">Prerequisites</div>
            </div>
          </div>

          {isPaid && discountPercentage > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg">
                  <span className="line-through text-muted-foreground mr-2">
                    ${originalPrice}
                  </span>
                  <span className="text-primary font-bold">${price}</span>
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    Save {discountPercentage}%
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}