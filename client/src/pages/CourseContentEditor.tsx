import React, { useState } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AdminGuard } from '@/components/AdminGuard';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Book, Sparkles, Upload, RefreshCw, ArrowLeft, Save, X } from 'lucide-react';
import { Link } from 'wouter';

interface SectionFormData {
  title: string;
  description: string;
  access: 'draft' | 'soon' | 'free' | 'paid';
}

export default function CourseContentEditor() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionData, setSectionData] = useState<SectionFormData>({
    title: '',
    description: '',
    access: 'draft'
  });

  const handleSectionSubmit = async () => {
    if (!sectionData.title.trim()) {
      toast({
        title: "Hiányzó cím",
        description: "Kérjük, adjon meg egy címet a modulnak.",
        variant: "destructive"
      });
      return;
    }

    try {
      const moduleData = {
        title: sectionData.title,
        description: sectionData.description,
        courseId: parseInt(id!),
        orderIndex: 0
      };

      await apiRequest('POST', `/api/courses/${id}/modules`, moduleData);
      
      toast({
        title: "Modul létrehozva",
        description: `A "${sectionData.title}" modul sikeresen létrejött.`
      });

      setIsModalOpen(false);
      setSectionData({ title: '', description: '', access: 'draft' });
      
      // Refresh or redirect as needed
      window.location.reload();
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "A modul létrehozása nem sikerült. Kérjük, próbálja újra.",
        variant: "destructive"
      });
    }
  };

  const SectionModal = () => (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            Modul szerkesztése
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          <div className="space-y-2">
            <Label htmlFor="title">Modul címe</Label>
            <p className="text-sm text-gray-600">
              Legyen rövid, informatív és érdekes!
            </p>
            <Input
              id="title"
              value={sectionData.title}
              onChange={(e) => setSectionData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="pl. Bevezetés a témába"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Modul leírása</Label>
            <p className="text-sm text-gray-600">
              Adjon meg egy tömör leírást a modulról. Nem minden tartalom sablon jeleníti meg ezt a leírást, így választhat, hogy nem ad meg. Ez attól függ, hogy milyen sablont választott a kurzus tartalmának bemutatásához.
            </p>
            <Textarea
              id="description"
              value={sectionData.description}
              onChange={(e) => setSectionData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Modul leírása..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label>Hozzáférés</Label>
            <p className="text-sm text-gray-600">
              Állítsa be a modul hozzáférését.
            </p>
            
            <RadioGroup
              value={sectionData.access}
              onValueChange={(value) => setSectionData(prev => ({ ...prev, access: value as any }))}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="draft" id="draft" className="mt-1" />
                <div>
                  <Label htmlFor="draft" className="font-medium">Vázlat</Label>
                  <p className="text-sm text-gray-600">
                    A modul láthatatlan lesz a felhasználók számára.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="soon" id="soon" className="mt-1" />
                <div>
                  <Label htmlFor="soon" className="font-medium">Hamarosan</Label>
                  <p className="text-sm text-gray-600">
                    A modul látható lesz a felhasználók számára, de a tanulási tevékenységek nem lesznek elérhetők.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="free" id="free" className="mt-1" />
                <div>
                  <Label htmlFor="free" className="font-medium">Ingyenes</Label>
                  <p className="text-sm text-gray-600">
                    A modul látható és elérhető lesz minden felhasználó számára.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="paid" id="paid" className="mt-1" />
                <div>
                  <Label htmlFor="paid" className="font-medium">Fizetős</Label>
                  <p className="text-sm text-gray-600">
                    A modul csak azoknak a felhasználóknak lesz elérhető, akik megvásárolták a kurzust.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
          >
            Mégse
          </Button>
          <Button onClick={handleSectionSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Mentés
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/admin/courses">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Vissza a kurzusokhoz
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Kurzus tartalma</h1>
                  <p className="text-gray-600">Fejlessze ki kurzusának vázlatát és tartalmát, és állítsa be a tananyag ütemezését.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
              <Book className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Készítse el online kurzusának tartalmát
            </h2>
          </div>

          <div className="grid gap-6">
            {/* Start building from scratch */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsModalOpen(true)}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Book className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Modul hozzáadása
                    </h3>
                    <p className="text-gray-600">
                      Hozzáférés a leggazdagabb tanulási tevékenységek könyvtárához és a leginkább testreszabható kurzuslejátszóhoz a piacon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-gray-500 font-medium">vagy</div>

            {/* Start building with AI */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      AI segítségével építés
                    </h3>
                    <p className="text-gray-600">
                      A fejlett generatív AI technológia által működtetve, az AI Asszisztens kiváló minőségű, lebilincselő tartalmat hoz létre.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload your files */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Fájlok feltöltése
                      </h3>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        Beta
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Töltse fel fájljait tömegesen, és nézze meg, ahogy percek alatt lebilincselő tanulási tevékenységekké alakulnak.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Import & sync */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Importálás és szinkronizálás
                    </h3>
                    <p className="text-gray-600">
                      Könnyedén átviheti és szinkronizálhatja a kurzustartalmakat kurzusok között vagy iskolák között.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <SectionModal />
      </div>
    </AdminGuard>
  );
}