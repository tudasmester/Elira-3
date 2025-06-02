import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminGuard } from '@/components/AdminGuard';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Upload, Image, CheckCircle, X, Plus, Trash2 } from 'lucide-react';
import { Link } from 'wouter';

interface CourseFormData {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  level: string;
  language: string;
  duration: number;
  price: number;
  prerequisites: string;
  learningOutcomes: string[];
  modules: Array<{
    title: string;
    description: string;
    lessons: Array<{
      title: string;
      description: string;
      content: string;
      estimatedDuration: number;
    }>;
  }>;
}

export default function CourseCreationWizard() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    level: 'beginner',
    language: 'Hungarian',
    duration: 0,
    price: 0,
    prerequisites: '',
    learningOutcomes: [],
    modules: []
  });

  const totalSteps = 2; // Only basic info and image upload
  const progressPercent = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof CourseFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper functions for managing learning outcomes
  const addLearningOutcome = () => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, '']
    }));
  };

  const updateLearningOutcome = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.map((outcome, i) => 
        i === index ? value : outcome
      )
    }));
  };

  const removeLearningOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index)
    }));
  };

  // Helper functions for managing modules
  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: '', description: '', lessons: [] }]
    }));
  };

  const updateModule = (index: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === index ? { ...module, [field]: value } : module
      )
    }));
  };

  const removeModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const addLesson = (moduleIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex 
          ? { 
              ...module, 
              lessons: [...module.lessons, { title: '', description: '', content: '', estimatedDuration: 0 }]
            }
          : module
      )
    }));
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: keyof CourseFormData['modules'][0]['lessons'][0], value: string | number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, j) =>
                j === lessonIndex ? { ...lesson, [field]: value } : lesson
              )
            }
          : module
      )
    }));
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.filter((_, j) => j !== lessonIndex)
            }
          : module
      )
    }));
  };

  // Drag and drop handlers
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
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Hibás fájltípus",
        description: "Csak képfájlokat lehet feltölteni (JPG, PNG, GIF).",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Túl nagy fájl",
        description: "A fájl mérete nem lehet nagyobb 5MB-nál.",
        variant: "destructive"
      });
      return;
    }

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

      // Store the created course ID and redirect to edit page
      setCreatedCourseId(newCourse.id);
      
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
                onChange={handleFileInputChange}
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

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Kurzus részletek
        </h2>
        <p className="text-gray-600">
          Add meg a kurzus alapvető információit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">
            Kategória
          </Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Válassz kategóriát" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technológia">Technológia</SelectItem>
              <SelectItem value="Üzlet">Üzlet</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Általános">Általános</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="level" className="text-sm font-medium text-gray-700">
            Szint
          </Label>
          <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Válassz szintet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Kezdő</SelectItem>
              <SelectItem value="intermediate">Középhaladó</SelectItem>
              <SelectItem value="advanced">Haladó</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="language" className="text-sm font-medium text-gray-700">
            Nyelv
          </Label>
          <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Válassz nyelvet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hungarian">Magyar</SelectItem>
              <SelectItem value="English">Angol</SelectItem>
              <SelectItem value="German">Német</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
            Időtartam (órában)
          </Label>
          <Input
            id="duration"
            type="number"
            min="0"
            step="0.5"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="pl. 4.5"
          />
        </div>

        <div>
          <Label htmlFor="price" className="text-sm font-medium text-gray-700">
            Ár (Ft)
          </Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="pl. 15000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="prerequisites" className="text-sm font-medium text-gray-700">
          Előfeltételek (opcionális)
        </Label>
        <Textarea
          id="prerequisites"
          rows={3}
          value={formData.prerequisites}
          onChange={(e) => handleInputChange('prerequisites', e.target.value)}
          placeholder="Milyen előzetes tudás szükséges a kurzushoz?"
        />
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(2)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Vissza
        </Button>
        
        <Button 
          onClick={() => setCurrentStep(4)}
          className="px-8"
        >
          Tovább
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tanulási eredmények
        </h2>
        <p className="text-gray-600">
          Mit fog megtanulni a diák a kurzus végére?
        </p>
      </div>

      <div className="space-y-4">
        {formData.learningOutcomes.map((outcome, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={`${index + 1}. tanulási eredmény`}
              value={outcome}
              onChange={(e) => updateLearningOutcome(index, e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeLearningOutcome(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          variant="outline"
          onClick={addLearningOutcome}
          className="w-full"
        >
          + Új tanulási eredmény hozzáadása
        </Button>
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(3)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Vissza
        </Button>
        
        <Button 
          onClick={() => setCurrentStep(5)}
          className="px-8"
        >
          Tovább
        </Button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Modulok és leckék
        </h2>
        <p className="text-gray-600">
          Strukturáld a kurzus tartalmát modulokba és leckékbe
        </p>
      </div>

      <div className="space-y-6">
        {formData.modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">Modul {moduleIndex + 1}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeModule(moduleIndex)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <Input
                placeholder="Modul címe"
                value={module.title}
                onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
              />
              <Textarea
                placeholder="Modul leírása"
                value={module.description}
                onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                rows={2}
              />
            </div>

            <div className="pl-4 space-y-3">
              <h4 className="font-medium text-gray-700">Leckék</h4>
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="border-l-2 border-gray-200 pl-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Lecke {lessonIndex + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLesson(moduleIndex, lessonIndex)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Lecke címe"
                    value={lesson.title}
                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Lecke leírása"
                    value={lesson.description}
                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'description', e.target.value)}
                    rows={2}
                  />
                  <Input
                    placeholder="Becsült időtartam (percben)"
                    type="number"
                    value={lesson.estimatedDuration}
                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'estimatedDuration', parseInt(e.target.value) || 0)}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addLesson(moduleIndex)}
                className="ml-4"
              >
                + Lecke hozzáadása
              </Button>
            </div>
          </div>
        ))}
        
        <Button
          variant="outline"
          onClick={addModule}
          className="w-full"
        >
          + Új modul hozzáadása
        </Button>
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(4)}
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

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tananyag létrehozása</h2>
        <p className="text-gray-600">
          Most hozzáadhatja a modulokat és leckéket a kurzusához.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">
            A kurzus sikeresen létrejött! ID: {createdCourseId}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Modulok és leckék</h3>
        
        {formData.modules.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">Még nincsenek modulok hozzáadva.</p>
            <Button onClick={addModule} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Első modul hozzáadása
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {formData.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Modul {moduleIndex + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeModule(moduleIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3 mb-4">
                  <Input
                    placeholder="Modul címe"
                    value={module.title}
                    onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Modul leírása"
                    value={module.description}
                    onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="ml-4 space-y-3">
                  <h5 className="font-medium text-sm">Leckék:</h5>
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border-l-2 border-gray-200 pl-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Lecke {lessonIndex + 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLesson(moduleIndex, lessonIndex)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Lecke címe"
                        value={lesson.title}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                      />
                      <Textarea
                        placeholder="Lecke leírása"
                        value={lesson.description}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'description', e.target.value)}
                        rows={2}
                      />
                      <Input
                        placeholder="Becsült időtartam (percben)"
                        type="number"
                        value={lesson.estimatedDuration}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'estimatedDuration', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addLesson(moduleIndex)}
                  >
                    + Lecke hozzáadása
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={addModule}
              className="w-full"
            >
              + Új modul hozzáadása
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/admin/courses'}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Befejezés
        </Button>
        
        <Button 
          onClick={() => {
            window.location.href = `/admin/courses/${createdCourseId}/edit`;
          }}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Szerkesztés folytatása
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
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
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