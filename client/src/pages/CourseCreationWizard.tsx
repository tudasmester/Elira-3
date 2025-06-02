import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Upload, Image, CheckCircle, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface CourseFormData {
  title: string;
  description: string;
  imageUrl: string;
}

export default function CourseCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fájl túl nagy",
        description: "A fájl mérete nem lehet nagyobb 5MB-nál.",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Érvénytelen fájltípus",
        description: "Csak képfájlokat lehet feltölteni.",
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
      
      // Create course immediately after image upload
      await handleCreateCourse(result.imageUrl);
      
      toast({
        title: "Sikeres feltöltés",
        description: "A kép sikeresen feltöltve. Átirányítás a szerkesztőhöz..."
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

  const handleCreateCourse = async (imageUrl?: string) => {
    setIsCreating(true);
    try {
      const courseData = {
        title: formData.title,
        description: formData.description || `Új kurzus: ${formData.title}`,
        shortDescription: formData.description || '',
        imageUrl: imageUrl || formData.imageUrl,
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

      // Redirect to content editor immediately
      setTimeout(() => {
        window.location.href = `/admin/courses/${newCourse.id}/edit`;
      }, 1500);

      toast({
        title: "Sikeres létrehozás",
        description: `A "${formData.title}" kurzus létrejött. Átirányítás a szerkesztőhöz...`
      });
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
          <ArrowRight className="h-4 w-4 ml-2" />
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
        <p className="text-gray-600 mb-4">
          Tölts fel egy borítóképet a kurzusodhoz
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="text-blue-800 font-medium mb-2">📏 Ajánlott képméret:</p>
          <ul className="text-blue-700 space-y-1">
            <li>• <strong>Felbontás:</strong> 1280×720 pixel (16:9 arány)</li>
            <li>• <strong>Formátum:</strong> JPG, PNG, WebP</li>
            <li>• <strong>Fájlméret:</strong> Maximum 5MB</li>
            <li>• <strong>Minőség:</strong> Éles, jól látható kép</li>
          </ul>
        </div>
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
            
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Image className={`mx-auto h-12 w-12 mb-3 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-sm text-gray-600 mb-2">
                {isDragOver ? 'Engedd el a képet ide' : 'Húzd ide a képet vagy kattints a feltöltéshez'}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                JPG, PNG, GIF vagy WebP • Maximum 5MB
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
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </div>

            {formData.imageUrl && (
              <div className="relative">
                <img 
                  src={formData.imageUrl} 
                  alt="Kurzus borítókép" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
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
          onClick={() => handleCreateCourse()}
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Új kurzus létrehozása</h1>
            <span className="text-sm text-gray-500">{currentStep}/{totalSteps}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <Card className="p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
        </Card>
      </div>
    </div>
  );
}