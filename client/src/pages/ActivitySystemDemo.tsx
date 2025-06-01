import React from 'react';
import { ActivityManager } from '@/components/admin/ActivityManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Boxes, 
  Code, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function ActivitySystemDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Boxes className="h-4 w-4 mr-2" />
              Elira Modular Activity System
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Moodle-inspirált moduláris aktivitásrendszer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hatékony és rugalmas LMS architektúra TypeScript-tel és React-tel, 
            plugin-alapú tevékenységkezeléssel és független fejlesztési lehetőségekkel.
          </p>
        </div>

        {/* Architecture Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Architektúra áttekintés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Factory Pattern</h3>
                </div>
                <p className="text-sm text-gray-600">
                  ActivityFactory osztály dinamikus aktivitás létrehozásához és 
                  típusbiztos inicializáláshoz
                </p>
                <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                  ActivityFactory.create(data)
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Registry System</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Központi regiszter a rendelkezésre álló aktivitástípusok 
                  kezeléséhez és metaadatok tárolásához
                </p>
                <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                  ActivityRegistry.register()
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Boxes className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Base Classes</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Absztrakt BaseActivityClass közös funkcionalitással 
                  és konzisztens interfészekkel
                </p>
                <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                  extends BaseActivityClass
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implemented Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Implementált aktivitástípusok</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'Quiz Activity',
                  description: 'Többféle kérdéstípus, időkorlát, keverés',
                  features: ['Többszörös válasz', 'Igaz/hamis', 'Numerikus', 'Esszé']
                },
                {
                  name: 'Assignment Activity', 
                  description: 'Fájl és szöveges beadás, értékelési folyamat',
                  features: ['Fájl feltöltés', 'Szöveges beadás', 'Csapat munka', 'Vak értékelés']
                },
                {
                  name: 'Forum Activity',
                  description: 'Diskurzus és kommunikáció támogatás',
                  features: ['Témák', 'Válaszok', 'Melléklet', 'Követés']
                },
                {
                  name: 'Workshop Activity',
                  description: 'Társértékelés és többfázisú munkafolyamat',
                  features: ['Több fázis', 'Értékelés', 'Példák', 'Pontozás']
                },
                {
                  name: 'Resource Activity',
                  description: 'Fájlok és linkek megosztása',
                  features: ['Többféle típus', 'URL linkek', 'Szöveges tartalom', 'Könyvek']
                },
                {
                  name: 'SCORM Activity',
                  description: 'SCORM csomagok integrációja',
                  features: ['SCORM 1.2/2004', 'Nyomkövetés', 'Pontozás', 'Struktúra']
                }
              ].map((activity, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h3 className="font-medium">{activity.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <div className="space-y-1">
                    {activity.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Élő bemutató - Aktivitáskezelő</CardTitle>
            <p className="text-sm text-gray-600">
              Interaktív felület az aktivitások létrehozásához, szerkesztéséhez és előnézetéhez
            </p>
          </CardHeader>
          <CardContent>
            <ActivityManager courseId={1} moduleId={1} />
          </CardContent>
        </Card>

        {/* Technical Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Technikai előnyök</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Moduláris fejlesztés</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    Független aktivitás implementációk
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    Plugin-szerű architektúra
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    Könnyű bővíthetőség
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">TypeScript biztonság</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    Típusbiztos interfészek
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    Automatikus validáció
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    IntelliSense támogatás
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}