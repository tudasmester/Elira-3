import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Save } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  level: string;
  language: string;
  duration: string;
  price: number;
  prerequisites: string;
  instructorName: string;
}

export default function AdminCourseEditPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Extract course ID from URL
  const courseId = location.split('/')[3];

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/admin/courses');
      const courses = await response.json();
      const foundCourse = courses.find((c: Course) => c.id === parseInt(courseId));
      
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        throw new Error('Kurzus nem található');
      }
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "A kurzus betöltése nem sikerült.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!course) return;

    try {
      setIsSaving(true);
      await apiRequest('PUT', `/api/admin/courses/${courseId}`, course);
      
      toast({
        title: "Sikeres mentés",
        description: "A kurzus adatai sikeresen frissültek."
      });
      
      // Navigate back to admin courses
      setLocation('/admin/courses');
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "A kurzus mentése nem sikerült.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateCourse = (field: keyof Course, value: string | number) => {
    if (!course) return;
    setCourse({ ...course, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Kurzus nem található</h1>
            <Button onClick={() => setLocation('/admin/courses')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza a kurzusokhoz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/admin/courses')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Kurzus szerkesztése</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Mentés...' : 'Mentés'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kurzus adatok</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kurzus címe
              </label>
              <Input
                value={course.title}
                onChange={(e) => updateCourse('title', e.target.value)}
                placeholder="Adja meg a kurzus címét"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leírás
              </label>
              <Textarea
                value={course.description}
                onChange={(e) => updateCourse('description', e.target.value)}
                placeholder="Adja meg a kurzus leírását"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategória
                </label>
                <Select 
                  value={course.category} 
                  onValueChange={(value) => updateCourse('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Informatika">Informatika</SelectItem>
                    <SelectItem value="Gazdaság">Gazdaság</SelectItem>
                    <SelectItem value="Jog">Jog</SelectItem>
                    <SelectItem value="Egészségügy">Egészségügy</SelectItem>
                    <SelectItem value="Művészet">Művészet</SelectItem>
                    <SelectItem value="Általános">Általános</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Szint
                </label>
                <Select 
                  value={course.level} 
                  onValueChange={(value) => updateCourse('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Kezdő</SelectItem>
                    <SelectItem value="intermediate">Közepes</SelectItem>
                    <SelectItem value="advanced">Haladó</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Időtartam (órában)
                </label>
                <Input
                  value={course.duration}
                  onChange={(e) => updateCourse('duration', e.target.value)}
                  placeholder="pl. 20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ár (Ft)
                </label>
                <Input
                  type="number"
                  value={course.price}
                  onChange={(e) => updateCourse('price', parseInt(e.target.value) || 0)}
                  placeholder="pl. 15000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Előfeltételek
              </label>
              <Textarea
                value={course.prerequisites}
                onChange={(e) => updateCourse('prerequisites', e.target.value)}
                placeholder="Adja meg a kurzus előfeltételeit"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oktató neve
              </label>
              <Input
                value={course.instructorName}
                onChange={(e) => updateCourse('instructorName', e.target.value)}
                placeholder="Adja meg az oktató nevét"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}