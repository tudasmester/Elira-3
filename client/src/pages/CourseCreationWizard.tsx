import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AdminGuard } from '@/components/AdminGuard';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Upload, Image, CheckCircle, X } from 'lucide-react';
import { Link } from 'wouter';

interface CourseFormData {
  title: string;
  description: string;
  imageUrl: string;
}

export default function CourseCreationWizard() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    imageUrl: ''
  });

  const totalSteps = 2;
  const progressPercent = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof CourseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Hibás fájl típus",
        description: "Csak JPG, PNG, GIF és WebP fájlok engedélyezettek.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Túl nagy fájl",
        description: "A maximális fájlméret 10MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload/course-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      setFormData(prev => ({ ...prev, imageUrl: result.imageUrl }));
      
      toast({
        title: "Sikeres feltöltés",
        description: "A kép sikeresen feltöltve."
      });
    } catch (error) {
      toast({
        title: "Feltöltési hiba",
        description: "A kép feltöltése nem sikerült. Kérjük, próbálja újra.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        toast({
          title: "Hiányzó adat",
          description: "A kurzus neve kötelező mező.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleCreateCourse = async () => {
    setIsCreating(true);
    try {
      const courseData = {
        title: formData.title,
        description: formData.description || `Új kurzus: ${formData.title}`,
        shortDescription: formData.description || '',
        imageUrl: formData.imageUrl || '/api/placeholder/400/300',
        category: 'Általános',
        difficulty: 'beginner',
        level: 'beginner',
        language: 'Hungarian',
        duration: 1,
        price: 0,
        originalPrice: 0,
        status: 'draft',
        accessType: 'free',
        isHighlighted: false,
        tags: [],
        enrollmentCount: 0
      };

      const response = await apiRequest('POST', '/api/admin/courses', courseData);
      const newCourse = await response.json();

      toast({
        title: "Sikeres létrehozás",
        description: `A "${formData.title}" kurzus sikeresen létrejött.`
      });

      // Navigate to course content builder with the new course ID
      window.location.href = `/admin/content-builder?courseId=${newCourse.id}`;
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "A kurzus létrehozása nem sikerült. Kérjük, próbálja újra.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Hozzuk létre a kurzusod
        </h2>
        <p className="text-gray-600">
          Mi a kurzusod neve?
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Kurzus neve
          </Label>
          <Input
            id="title"
            placeholder="pl. Bevezetés a UX tervezésbe"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="mt-1 text-lg"
            autoFocus
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Hogyan írnád le a tartalmat? (opcionális)
          </Label>
          <Textarea
            id="description"
            placeholder="pl. Bevezetés a felhasználói élmény tervezésébe"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleNextStep}
          disabled={!formData.title.trim()}
          className="px-8"
        >
          Folytatás
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Borítókép feltöltése
        </h2>
        <p className="text-gray-600">
          Tölts fel egy borítóképet a kurzusodhoz (opcionális)
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
            Kép URL (opcionális)
          </Label>
          <div className="mt-1 space-y-3">
            <Input
              id="imageUrl"
              placeholder="https://example.com/course-image.jpg"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
            />
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <Image className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Húzd ide a képet vagy add meg az URL-t
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Feltöltés...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Fájl kiválasztása
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {formData.imageUrl && (
          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700">Előnézet:</Label>
            <div className="mt-2 max-w-md relative">
              <img 
                src={formData.imageUrl} 
                alt="Kurzus borítókép előnézet"
                className="w-full h-40 object-cover rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Vissza
        </Button>
        
        <Button 
          onClick={handleCreateCourse}
          disabled={isCreating}
          className="px-8"
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Létrehozás...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Kurzus létrehozása
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/courses">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vissza a kurzusokhoz
              </Button>
            </Link>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Lépés {currentStep} / {totalSteps}</span>
                <span>{Math.round(progressPercent)}% kész</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>

          {/* Main Content */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
            </CardContent>
          </Card>

          {/* Preview Card */}
          {formData.title && (
            <Card className="mt-6 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Kurzus előnézet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {formData.imageUrl ? (
                      <img 
                        src={formData.imageUrl} 
                        alt="Kurzus"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Image className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{formData.title}</h3>
                    {formData.description && (
                      <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}