import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useRoute } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

const courseSchema = z.object({
  title: z.string().min(1, 'A cím megadása kötelező'),
  description: z.string().min(10, 'A leírás legalább 10 karakter hosszú legyen'),
  imageUrl: z.string().url('Érvényes URL-t adjon meg'),
  universityId: z.number().min(1, 'Válasszon egy egyetemet'),
  isFree: z.boolean(),
  level: z.string().min(1, 'Válasszon szintet'),
  category: z.string().min(1, 'Válasszon kategóriát'),
});

type CourseFormData = z.infer<typeof courseSchema>;

const categories = [
  'Programozás',
  'Adattudományok',
  'Üzleti tanulmányok',
  'Dizajn',
  'Marketing',
  'Egészségügy',
  'Mérnöki tudományok',
  'Nyelvi tanulmányok',
  'Művészetek',
  'Természettudományok'
];

const levels = [
  'Kezdő',
  'Középhaladó', 
  'Haladó',
  'Szakértő'
];

export default function AdminCourseForm() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/admin/courses/:id/edit');
  const isEdit = !!match;
  const courseId = params?.id ? parseInt(params.id) : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      universityId: 0,
      isFree: true,
      level: '',
      category: '',
    },
  });

  // Fetch course data for editing
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/admin/courses/${courseId}`],
    enabled: isEdit && !!courseId,
    retry: false,
  });

  // Fetch universities for dropdown
  const { data: universities } = useQuery({
    queryKey: ['/api/admin/universities'],
    retry: false,
  });

  // Create course mutation
  const createMutation = useMutation({
    mutationFn: (data: CourseFormData) => apiRequest(`/api/admin/courses`, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        isFree: data.isFree ? 1 : 0
      }),
    }),
    onSuccess: () => {
      toast({
        title: 'Siker!',
        description: 'A kurzus sikeresen létrehozva.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      navigate('/admin');
    },
    onError: () => {
      toast({
        title: 'Hiba!',
        description: 'Nem sikerült létrehozni a kurzust.',
        variant: 'destructive',
      });
    },
  });

  // Update course mutation
  const updateMutation = useMutation({
    mutationFn: (data: CourseFormData) => apiRequest(`/api/admin/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        isFree: data.isFree ? 1 : 0
      }),
    }),
    onSuccess: () => {
      toast({
        title: 'Siker!',
        description: 'A kurzus sikeresen frissítve.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      navigate('/admin');
    },
    onError: () => {
      toast({
        title: 'Hiba!',
        description: 'Nem sikerült frissíteni a kurzust.',
        variant: 'destructive',
      });
    },
  });

  // Set form values when course data is loaded
  useEffect(() => {
    if (course && isEdit) {
      form.reset({
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        universityId: course.universityId,
        isFree: !!course.isFree,
        level: course.level,
        category: course.category,
      });
    }
  }, [course, isEdit, form]);

  const onSubmit = (data: CourseFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Vissza az admin panelhez
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {isEdit ? 'Kurzus szerkesztése' : 'Új kurzus létrehozása'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Módosítsa a kurzus adatait' : 'Adja meg az új kurzus részleteit'}
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{isEdit ? 'Kurzus szerkesztése' : 'Új kurzus'}</CardTitle>
            <CardDescription>
              Töltse ki az alábbi mezőket a kurzus {isEdit ? 'frissítéséhez' : 'létrehozásához'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kurzus címe</FormLabel>
                      <FormControl>
                        <Input placeholder="Adja meg a kurzus címét" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leírás</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Adja meg a kurzus részletes leírását"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kép URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Adjon meg egy érvényes URL-t a kurzus képéhez
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="universityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Egyetem</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Válasszon egyetemet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {universities?.map((university: any) => (
                            <SelectItem key={university.id} value={university.id.toString()}>
                              {university.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategória</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Válasszon kategóriát" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Szint</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Válasszon szintet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {levels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Ingyenes kurzus
                        </FormLabel>
                        <FormDescription>
                          Jelölje be, ha a kurzus ingyenesen elérhető
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

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1"
                  >
                    {createMutation.isPending || updateMutation.isPending 
                      ? 'Mentés...' 
                      : isEdit ? 'Frissítés' : 'Létrehozás'
                    }
                  </Button>
                  <Link href="/admin">
                    <Button type="button" variant="outline">
                      Mégse
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}