import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { z } from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { AdminGuard } from '@/components/AdminGuard';
import { triggerDataRefresh } from '@/hooks/useRealTimeData';

// Form validation schema
const courseFormSchema = z.object({
  title: z.string().min(1, "Cím megadása kötelező").max(200, "Cím túl hosszú"),
  description: z.string().min(10, "Leírás legalább 10 karakter legyen").max(2000, "Leírás túl hosszú"),
  imageUrl: z.string().url("Érvényes URL-t adj meg").optional().or(z.literal("")),
  universityId: z.number().min(1, "Egyetem kiválasztása kötelező"),
  isFree: z.boolean(),
  price: z.number().min(0, "Ár nem lehet negatív").optional(),
  level: z.enum(["Kezdő", "Középhaladó", "Haladó", "Szakértő"], {
    required_error: "Szint kiválasztása kötelező"
  }),
  category: z.enum([
    "Programozás", "Adattudomány", "Mesterséges intelligencia", 
    "Webfejlesztés", "Mobilfejlesztés", "DevOps", "Kiberbiztonsag", 
    "Üzleti készségek", "Design", "Marketing", "Egyéb"
  ], {
    required_error: "Kategória kiválasztása kötelező"
  }),
  duration: z.number().min(1, "Időtartam legalább 1 óra legyen").optional(),
  language: z.string().min(1, "Nyelv megadása kötelező").default("Hungarian"),
  prerequisites: z.string().optional(),
  learningOutcomes: z.string().optional(),
  instructorName: z.string().optional(),
  isPublished: z.boolean().default(false),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

export default function AdminCourseForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams();
  const [, setLocation] = useLocation();
  
  const isEdit = params.id !== 'new';
  const courseId = isEdit ? parseInt(params.id as string) : null;

  // Fetch universities for dropdown
  const { data: universitiesData, isLoading: universitiesLoading } = useQuery({
    queryKey: ['/api/universities'],
    retry: false,
  });
  
  const universities = universitiesData?.universities || [];

  // Fetch existing course data for editing
  const { data: existingCourse, isLoading: courseLoading } = useQuery({
    queryKey: ['/api/courses', courseId],
    enabled: isEdit && !!courseId,
    retry: false,
  });

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      universityId: 0,
      isFree: true,
      price: 0,
      level: 'Kezdő',
      category: 'Programozás',
      duration: 10,
      language: 'Hungarian',
      prerequisites: '',
      learningOutcomes: '',
      instructorName: '',
      isPublished: false,
    },
  });

  // Update form with existing course data
  useEffect(() => {
    if (existingCourse) {
      form.reset({
        title: existingCourse.title || '',
        description: existingCourse.description || '',
        imageUrl: existingCourse.imageUrl || '',
        universityId: existingCourse.universityId || 0,
        isFree: existingCourse.isFree === 1,
        price: existingCourse.price || 0,
        level: existingCourse.level || 'Kezdő',
        category: existingCourse.category || 'Programozás',
        duration: existingCourse.duration || 10,
        language: existingCourse.language || 'Hungarian',
        prerequisites: existingCourse.prerequisites || '',
        learningOutcomes: existingCourse.learningOutcomes || '',
        instructorName: existingCourse.instructorName || '',
        isPublished: existingCourse.isPublished === 1,
      });
    }
  }, [existingCourse, form]);

  // Create course mutation
  const createMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const payload = {
        ...data,
        isFree: data.isFree ? 1 : 0,
        isPublished: data.isPublished ? 1 : 0,
        price: data.isFree ? 0 : (data.price || 0),
      };
      
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create course');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate admin queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      
      // Trigger immediate refresh of user-facing data
      triggerDataRefresh(queryClient);
      
      toast({
        title: "Kurzus létrehozva",
        description: "A kurzus sikeresen létrejött.",
      });
      
      setLocation('/admin');
    },
    onError: (error: Error) => {
      toast({
        title: "Hiba",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update course mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const payload = {
        ...data,
        isFree: data.isFree ? 1 : 0,
        isPublished: data.isPublished ? 1 : 0,
        price: data.isFree ? 0 : (data.price || 0),
      };
      
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update course');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate admin queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId] });
      
      // Trigger immediate refresh of user-facing data
      triggerDataRefresh(queryClient);
      
      toast({
        title: "Kurzus frissítve",
        description: "A kurzus adatai sikeresen frissültek.",
      });
      
      setLocation('/admin');
    },
    onError: (error: Error) => {
      toast({
        title: "Hiba",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CourseFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isLoading = courseLoading || universitiesLoading;

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vissza
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {isEdit ? 'Kurzus szerkesztése' : 'Új kurzus létrehozása'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Módosítsd a kurzus adatait' : 'Töltsd ki az alábbi adatokat az új kurzus létrehozásához'}
              </p>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Alapadatok</CardTitle>
                <CardDescription>
                  A kurzus alapvető információi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Kurzus címe *</Label>
                    <Input
                      id="title"
                      {...form.register('title')}
                      placeholder="pl. React fejlesztés kezdőknek"
                      disabled={isPending}
                    />
                    {form.formState.errors.title && (
                      <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="universityId">Egyetem *</Label>
                    <Select
                      value={form.watch('universityId').toString()}
                      onValueChange={(value) => form.setValue('universityId', parseInt(value))}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Válassz egyetmet" />
                      </SelectTrigger>
                      <SelectContent>
                        {universities?.map((university: any) => (
                          <SelectItem key={university.id} value={university.id.toString()}>
                            {university.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.universityId && (
                      <p className="text-red-500 text-sm">{form.formState.errors.universityId.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Leírás *</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    placeholder="Írj egy részletes leírást a kurzusról..."
                    rows={4}
                    disabled={isPending}
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Borítókép URL</Label>
                  <Input
                    id="imageUrl"
                    {...form.register('imageUrl')}
                    placeholder="https://example.com/image.jpg"
                    disabled={isPending}
                  />
                  {form.formState.errors.imageUrl && (
                    <p className="text-red-500 text-sm">{form.formState.errors.imageUrl.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Course Details */}
            <Card>
              <CardHeader>
                <CardTitle>Kurzus részletei</CardTitle>
                <CardDescription>
                  További információk a kurzusról
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Szint *</Label>
                    <Select
                      value={form.watch('level')}
                      onValueChange={(value) => form.setValue('level', value as any)}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Válassz szintet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kezdő">Kezdő</SelectItem>
                        <SelectItem value="Középhaladó">Középhaladó</SelectItem>
                        <SelectItem value="Haladó">Haladó</SelectItem>
                        <SelectItem value="Szakértő">Szakértő</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.level && (
                      <p className="text-red-500 text-sm">{form.formState.errors.level.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategória *</Label>
                    <Select
                      value={form.watch('category')}
                      onValueChange={(value) => form.setValue('category', value as any)}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Válassz kategóriát" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Programozás">Programozás</SelectItem>
                        <SelectItem value="Adattudomány">Adattudomány</SelectItem>
                        <SelectItem value="Mesterséges intelligencia">Mesterséges intelligencia</SelectItem>
                        <SelectItem value="Webfejlesztés">Webfejlesztés</SelectItem>
                        <SelectItem value="Mobilfejlesztés">Mobilfejlesztés</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="Kiberbiztonsag">Kiberbiztonsag</SelectItem>
                        <SelectItem value="Üzleti készségek">Üzleti készségek</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Egyéb">Egyéb</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Időtartam (órában)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      {...form.register('duration', { valueAsNumber: true })}
                      placeholder="10"
                      disabled={isPending}
                    />
                    {form.formState.errors.duration && (
                      <p className="text-red-500 text-sm">{form.formState.errors.duration.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructorName">Oktató neve</Label>
                    <Input
                      id="instructorName"
                      {...form.register('instructorName')}
                      placeholder="Dr. Kovács János"
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Nyelv</Label>
                    <Input
                      id="language"
                      {...form.register('language')}
                      placeholder="Hungarian"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prerequisites">Előfeltételek</Label>
                  <Textarea
                    id="prerequisites"
                    {...form.register('prerequisites')}
                    placeholder="Milyen előismereteket igényel a kurzus?"
                    rows={2}
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learningOutcomes">Tanulási célok</Label>
                  <Textarea
                    id="learningOutcomes"
                    {...form.register('learningOutcomes')}
                    placeholder="Mit fognak megtanulni a résztvevők?"
                    rows={3}
                    disabled={isPending}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing and Publication */}
            <Card>
              <CardHeader>
                <CardTitle>Árképzés és publikálás</CardTitle>
                <CardDescription>
                  Állítsd be a kurzus árát és láthatóságát
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFree"
                    checked={form.watch('isFree')}
                    onCheckedChange={(checked) => form.setValue('isFree', checked)}
                    disabled={isPending}
                  />
                  <Label htmlFor="isFree">Ingyenes kurzus</Label>
                </div>

                {!form.watch('isFree') && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Ár (HUF)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      {...form.register('price', { valueAsNumber: true })}
                      placeholder="15000"
                      disabled={isPending}
                    />
                    {form.formState.errors.price && (
                      <p className="text-red-500 text-sm">{form.formState.errors.price.message}</p>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={form.watch('isPublished')}
                    onCheckedChange={(checked) => form.setValue('isPublished', checked)}
                    disabled={isPending}
                  />
                  <Label htmlFor="isPublished">Kurzus publikálása</Label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Link href="/admin">
                <Button type="button" variant="outline" disabled={isPending}>
                  Mégse
                </Button>
              </Link>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEdit ? 'Frissítés...' : 'Létrehozás...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? 'Kurzus frissítése' : 'Kurzus létrehozása'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminGuard>
  );
}