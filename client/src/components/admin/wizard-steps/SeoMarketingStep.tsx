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
import { 
  Search, 
  Hash, 
  Megaphone, 
  Plus, 
  Trash2,
  Target,
  TrendingUp,
  CheckCircle 
} from 'lucide-react';

const suggestedTags = [
  'programming', 'web-development', 'javascript', 'react', 'nodejs',
  'python', 'data-science', 'machine-learning', 'artificial-intelligence',
  'digital-marketing', 'social-media', 'entrepreneurship', 'business',
  'design', 'ui-ux', 'graphic-design', 'photography', 'video-editing',
  'finance', 'investing', 'cryptocurrency', 'personal-development',
  'productivity', 'leadership', 'communication', 'languages', 'english',
  'spanish', 'online-learning', 'certification', 'skills-development'
];

export function SeoMarketingStep() {
  const { control, watch } = useFormContext();
  const metaDescription = watch('metaDescription');
  const promotionalContent = watch('promotionalContent');
  
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: 'tags',
  });

  const addSuggestedTag = (tag: string) => {
    const currentTags = tagFields.map((field: any) => field.value || '').filter(Boolean);
    if (!currentTags.includes(tag)) {
      appendTag(tag);
    }
  };

  const metaDescLength = metaDescription?.length || 0;
  const promoContentLength = promotionalContent?.length || 0;

  return (
    <div className="space-y-8">
      {/* SEO Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Optimization
          </CardTitle>
          <FormDescription>
            Optimize your course for search engines to increase discoverability and organic traffic.
          </FormDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description *</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="Learn complete web development from scratch with hands-on projects. Master HTML, CSS, JavaScript, React, and Node.js in this comprehensive course designed for beginners."
                      className="min-h-20"
                      maxLength={160}
                      {...field} 
                    />
                    <div className="flex justify-between text-xs">
                      <span className={`${
                        metaDescLength < 120 ? 'text-orange-600' : 
                        metaDescLength > 160 ? 'text-red-600' : 
                        'text-green-600'
                      }`}>
                        {metaDescLength}/160 characters
                      </span>
                      <span className="text-muted-foreground">
                        {metaDescLength < 120 ? 'Too short' : 
                         metaDescLength > 160 ? 'Too long' : 
                         'Perfect length'}
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  This appears in search results. Make it compelling and include key benefits.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-800 mb-1">SEO Tips</div>
                <ul className="text-blue-700 space-y-1">
                  <li>• Include your main keyword naturally</li>
                  <li>• Mention the target audience (beginners, professionals)</li>
                  <li>• Highlight unique value proposition</li>
                  <li>• Keep it between 120-160 characters</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags & Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Tags & Keywords
          </CardTitle>
          <FormDescription>
            Add relevant tags to help students find your course and improve search ranking.
          </FormDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {tagFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={control}
                  name={`tags.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input 
                          placeholder={`Tag ${index + 1}: e.g., web-development`}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {tagFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(index)}
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
              onClick={() => appendTag('')}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </div>

          {/* Suggested Tags */}
          <div>
            <div className="text-sm font-medium mb-2">Suggested Tags:</div>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.slice(0, 12).map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSuggestedTag(tag)}
                  className="text-xs h-7"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Marketing Content
          </CardTitle>
          <FormDescription>
            Create compelling promotional content to attract and engage potential students.
          </FormDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="promotionalContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promotional Description *</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="🚀 Transform your career with our comprehensive Web Development course! 

✅ Build 10+ real-world projects
✅ Learn industry-standard tools and frameworks  
✅ Get personalized feedback from experienced instructors
✅ Join a community of 5,000+ successful graduates

Perfect for beginners and professionals looking to level up their skills. Start your journey today and land your dream tech job within 6 months!"
                      className="min-h-32"
                      {...field} 
                    />
                    <div className="flex justify-between text-xs">
                      <span className={`${
                        promoContentLength < 100 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {promoContentLength} characters
                      </span>
                      <span className="text-muted-foreground">
                        {promoContentLength < 100 ? 'Add more detail' : 'Good length'}
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  This content will be used for social media, email marketing, and course promotions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-green-800 mb-1">Marketing Best Practices</div>
                <ul className="text-green-700 space-y-1">
                  <li>• Use action words and emotional triggers</li>
                  <li>• Include specific benefits and outcomes</li>
                  <li>• Add social proof (student count, success stories)</li>
                  <li>• Use emojis and bullet points for readability</li>
                  <li>• End with a clear call-to-action</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO & Marketing Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">SEO & Marketing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {metaDescLength >= 120 && metaDescLength <= 160 ? '✓' : '○'}
              </div>
              <div className="text-sm text-muted-foreground">Meta Description</div>
              <div className="text-xs text-muted-foreground mt-1">
                {metaDescLength}/160 chars
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {tagFields.length >= 3 ? '✓' : '○'}
              </div>
              <div className="text-sm text-muted-foreground">Tags Added</div>
              <div className="text-xs text-muted-foreground mt-1">
                {tagFields.length} tags
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {promoContentLength >= 100 ? '✓' : '○'}
              </div>
              <div className="text-sm text-muted-foreground">Promo Content</div>
              <div className="text-xs text-muted-foreground mt-1">
                {promoContentLength} chars
              </div>
            </div>
          </div>

          {/* Search Preview */}
          {metaDescription && (
            <div className="mt-6 pt-4 border-t">
              <div className="text-sm font-medium mb-2">Search Result Preview:</div>
              <div className="bg-white border rounded-lg p-4 max-w-lg">
                <div className="text-blue-600 text-lg font-medium cursor-pointer hover:underline">
                  {watch('title') || 'Your Course Title'}
                </div>
                <div className="text-green-700 text-sm">
                  courseplatform.com › course › your-course
                </div>
                <div className="text-gray-600 text-sm mt-1 leading-relaxed">
                  {metaDescription}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}