import { useFormContext } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  'Programming & Development',
  'Data Science & Analytics',
  'Business & Entrepreneurship',
  'Design & Creative',
  'Marketing & Sales',
  'IT & Software',
  'Languages',
  'Health & Wellness',
  'Music & Arts',
  'Science & Engineering',
  'Personal Development',
  'Academic',
];

const levels = [
  { value: 'beginner', label: 'Beginner - No prior experience needed' },
  { value: 'intermediate', label: 'Intermediate - Some experience required' },
  { value: 'advanced', label: 'Advanced - Extensive experience required' },
];

export function CourseBasicsStep() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Complete Web Development Bootcamp" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Choose a clear, descriptive title that captures the main topic
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the most relevant category for your course
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="subtitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Subtitle *</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Learn HTML, CSS, JavaScript, React, Node.js and build real projects" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              A compelling subtitle that expands on the title and highlights key benefits
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Description *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Provide a detailed description of what students will learn, including key topics, projects, and outcomes..."
                className="min-h-32"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              A comprehensive description that explains the course content, learning outcomes, and target audience
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the appropriate skill level for your target audience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="estimatedDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Duration (hours) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0.5" 
                  step="0.5"
                  placeholder="e.g., 40" 
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Total estimated time to complete the course
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}