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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Image, 
  Video, 
  Palette, 
  Upload, 
  Eye,
  CheckCircle 
} from 'lucide-react';

const colorSchemes = [
  { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#E0F2FE', value: 'ocean-blue' },
  { name: 'Forest Green', primary: '#10B981', secondary: '#D1FAE5', value: 'forest-green' },
  { name: 'Sunset Orange', primary: '#F97316', secondary: '#FED7AA', value: 'sunset-orange' },
  { name: 'Purple Dreams', primary: '#8B5CF6', secondary: '#EDE9FE', value: 'purple-dreams' },
  { name: 'Rose Garden', primary: '#F43F5E', secondary: '#FFE4E6', value: 'rose-garden' },
  { name: 'Golden Hour', primary: '#EAB308', secondary: '#FEF3C7', value: 'golden-hour' },
  { name: 'Midnight', primary: '#1E293B', secondary: '#F1F5F9', value: 'midnight' },
  { name: 'Coral Reef', primary: '#06B6D4', secondary: '#CFFAFE', value: 'coral-reef' },
];

export function MediaBrandingStep() {
  const { control, watch } = useFormContext();
  const imageUrl = watch('imageUrl');
  const promoVideoUrl = watch('promoVideoUrl');
  const selectedColorScheme = watch('colorScheme');

  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
    } catch {
      return false;
    }
  };

  const isValidVideoUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return /\.(mp4|webm|ogg)$/i.test(url) || 
             url.includes('youtube.com') || 
             url.includes('vimeo.com') ||
             url.includes('youtu.be');
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-8">
      {/* Course Thumbnail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Course Thumbnail
          </CardTitle>
          <FormDescription>
            Upload an eye-catching image that represents your course content and attracts students.
          </FormDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input 
                      placeholder="https://example.com/course-thumbnail.jpg" 
                      {...field} 
                    />
                    {field.value && (
                      <div className="flex items-center gap-2 text-sm">
                        {isValidImageUrl(field.value) ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Valid image URL</span>
                          </>
                        ) : (
                          <>
                            <span className="text-red-600">Invalid image URL format</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Recommended: 1280x720px, under 2MB. Supported formats: JPG, PNG, WebP
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {imageUrl && isValidImageUrl(imageUrl) && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Preview:</div>
              <div className="relative aspect-video max-w-md border rounded-lg overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Course thumbnail preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Upload className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-800 mb-1">Upload Tips</div>
                <ul className="text-blue-700 space-y-1">
                  <li>• Use high-quality, professional images</li>
                  <li>• Include text overlay with course title</li>
                  <li>• Choose images that reflect your course content</li>
                  <li>• Ensure good contrast and readability</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotional Video */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Promotional Video
          </CardTitle>
          <FormDescription>
            Add a short promotional video to showcase your course and increase enrollment rates.
          </FormDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="promoVideoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input 
                      placeholder="https://youtube.com/watch?v=... or https://example.com/promo.mp4" 
                      {...field} 
                    />
                    {field.value && (
                      <div className="flex items-center gap-2 text-sm">
                        {isValidVideoUrl(field.value) ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Valid video URL</span>
                          </>
                        ) : (
                          <>
                            <span className="text-red-600">Invalid video URL format</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  YouTube, Vimeo, or direct video file URLs supported. Keep it under 3 minutes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Video className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-purple-800 mb-1">Video Best Practices</div>
                <ul className="text-purple-700 space-y-1">
                  <li>• Keep it short and engaging (30-90 seconds)</li>
                  <li>• Introduce yourself and course benefits</li>
                  <li>• Show course content examples</li>
                  <li>• Include a clear call-to-action</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Scheme
          </CardTitle>
          <FormDescription>
            Choose a color scheme that matches your course topic and creates a cohesive visual experience.
          </FormDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="colorScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Color Theme</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {colorSchemes.map((scheme) => (
                      <button
                        key={scheme.value}
                        type="button"
                        onClick={() => field.onChange(scheme.value)}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                          field.value === scheme.value
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex gap-1">
                            <div 
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: scheme.primary }}
                            />
                            <div 
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: scheme.secondary }}
                            />
                          </div>
                          <div className="text-xs font-medium text-center">
                            {scheme.name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>
                  The selected colors will be used for course cards, progress indicators, and highlights.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedColorScheme && (
            <div className="mt-4 p-4 border rounded-lg">
              <div className="text-sm font-medium mb-2">Preview:</div>
              <div className="space-y-2">
                {(() => {
                  const scheme = colorSchemes.find(s => s.value === selectedColorScheme);
                  return scheme ? (
                    <div className="flex items-center gap-4">
                      <div 
                        className="px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: scheme.primary }}
                      >
                        Enroll Now
                      </div>
                      <div 
                        className="px-4 py-2 rounded-lg border"
                        style={{ 
                          backgroundColor: scheme.secondary,
                          borderColor: scheme.primary 
                        }}
                      >
                        Course Preview
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Media Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {imageUrl && isValidImageUrl(imageUrl) ? '✓' : '○'}
              </div>
              <div className="text-sm text-muted-foreground">Course Image</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {promoVideoUrl && isValidVideoUrl(promoVideoUrl) ? '✓' : '○'}
              </div>
              <div className="text-sm text-muted-foreground">Promo Video</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {selectedColorScheme ? '✓' : '○'}
              </div>
              <div className="text-sm text-muted-foreground">Color Theme</div>
            </div>
          </div>
          
          {selectedColorScheme && (
            <div className="mt-4 pt-4 border-t text-center">
              <Badge variant="secondary">
                Theme: {colorSchemes.find(s => s.value === selectedColorScheme)?.name}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}