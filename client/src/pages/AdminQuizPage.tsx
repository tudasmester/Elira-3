import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, Search, Settings, BarChart3, BookOpen, 
  HelpCircle, Clock, Users, Target, Edit, Trash2, 
  Copy, Eye, Download, Upload, Brain
} from 'lucide-react';
import { QuizManager } from '@/components/admin/QuizManager';
import { QuestionBank } from '@/components/admin/QuestionBank';
import { QuizAnalytics } from '@/components/admin/QuizAnalytics';
import { QuizSettings } from '@shared/activity-types';

export default function AdminQuizPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [createQuizOpen, setCreateQuizOpen] = useState(false);
  const [questionBankOpen, setQuestionBankOpen] = useState(false);

  // Mock quiz data - in real implementation, this would come from API
  const quizzes = [
    {
      id: '1',
      title: 'Matematikai alapok kvíz',
      course: 'Matematika I.',
      questions: 15,
      timeLimit: 30,
      attempts: 3,
      averageScore: 78.5,
      students: 45,
      status: 'active',
      createdAt: '2024-05-15',
      lastModified: '2024-05-20'
    },
    {
      id: '2',
      title: 'Algebra bevezető teszt',
      course: 'Matematika I.',
      questions: 20,
      timeLimit: 45,
      attempts: 2,
      averageScore: 71.2,
      students: 38,
      status: 'draft',
      createdAt: '2024-05-18',
      lastModified: '2024-05-25'
    },
    {
      id: '3',
      title: 'Fizika alapok ellenőrző',
      course: 'Fizika I.',
      questions: 12,
      timeLimit: 25,
      attempts: 1,
      averageScore: 82.1,
      students: 52,
      status: 'active',
      createdAt: '2024-05-10',
      lastModified: '2024-05-22'
    }
  ];

  const courses = ['Matematika I.', 'Fizika I.', 'Kémia I.', 'Informatika I.'];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || quiz.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktív';
      case 'draft': return 'Vázlat';
      case 'archived': return 'Archivált';
      default: return 'Ismeretlen';
    }
  };

  const handleCreateQuiz = (quiz: QuizSettings) => {
    console.log('Új kvíz létrehozva:', quiz);
    setCreateQuizOpen(false);
  };

  const duplicateQuiz = (quizId: string) => {
    console.log('Kvíz duplikálása:', quizId);
  };

  const deleteQuiz = (quizId: string) => {
    console.log('Kvíz törlése:', quizId);
  };

  const exportQuiz = (quizId: string) => {
    console.log('Kvíz exportálása:', quizId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kvíz kezelő</h1>
          <p className="text-gray-600">Kvízek létrehozása, szerkesztése és elemzése</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setQuestionBankOpen(true)}>
            <BookOpen className="h-4 w-4 mr-2" />
            Kérdésbank
          </Button>
          <Button onClick={() => setCreateQuizOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Új kvíz
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Áttekintés</TabsTrigger>
          <TabsTrigger value="analytics">Analitika</TabsTrigger>
          <TabsTrigger value="question-bank">Kérdésbank</TabsTrigger>
          <TabsTrigger value="settings">Beállítások</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Összes kvíz</p>
                    <p className="text-2xl font-bold">{quizzes.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aktív hallgatók</p>
                    <p className="text-2xl font-bold">135</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Target className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Átlagos pontszám</p>
                    <p className="text-2xl font-bold">77.3%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Átlagos idő</p>
                    <p className="text-2xl font-bold">32 perc</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Kvízek keresése..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">Minden kurzus</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Quiz List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{quiz.title}</h3>
                        <Badge className={getStatusColor(quiz.status)}>
                          {getStatusText(quiz.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{quiz.course}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Kérdések</p>
                          <p className="font-medium">{quiz.questions}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Időkorlát</p>
                          <p className="font-medium">{quiz.timeLimit} perc</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Próbálkozások</p>
                          <p className="font-medium">{quiz.attempts}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Átlagos pontszám</p>
                          <p className="font-medium">{quiz.averageScore}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Hallgatók</p>
                          <p className="font-medium">{quiz.students}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-4">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => duplicateQuiz(quiz.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => exportQuiz(quiz.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteQuiz(quiz.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Létrehozva: {quiz.createdAt}</span>
                      <span>Utolsó módosítás: {quiz.lastModified}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredQuizzes.length === 0 && (
              <Card className="p-8 text-center">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">Nincsenek kvízek</p>
                <p className="text-sm text-gray-400">
                  {quizzes.length === 0 
                    ? 'Még nincsenek kvízek létrehozva'
                    : 'A szűrési feltételeknek megfelelő kvízek nem találhatók'
                  }
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <QuizAnalytics />
        </TabsContent>

        <TabsContent value="question-bank">
          <QuestionBank mode="management" />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Kvíz rendszer beállításai
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Alapértelmezett beállítások</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Alapértelmezett időkorlát</span>
                      <Input type="number" defaultValue="30" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Alapértelmezett próbálkozások</span>
                      <Input type="number" defaultValue="3" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Átmenő pontszám</span>
                      <Input type="number" defaultValue="60" className="w-20" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Biztonsági beállítások</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Másolás tiltása</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ablakváltás tiltása</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Teljes képernyős mód</span>
                      <input type="checkbox" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Beállítások mentése</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adatkezelés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Összes kvíz exportálása
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Kvízek importálása
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Exportálás JSON, CSV vagy QTI formátumban. Támogatott importálási formátumok: JSON, GIFT, QTI 2.1.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Quiz Dialog */}
      <Dialog open={createQuizOpen} onOpenChange={setCreateQuizOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Új kvíz létrehozása</DialogTitle>
            <DialogDescription>
              Hozz létre egy új kvízt kérdésekkel és beállításokkal
            </DialogDescription>
          </DialogHeader>
          <QuizManager
            courseId={1}
            onSave={handleCreateQuiz}
            onCancel={() => setCreateQuizOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Question Bank Dialog */}
      <Dialog open={questionBankOpen} onOpenChange={setQuestionBankOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kérdésbank</DialogTitle>
            <DialogDescription>
              Kezelje és szervezze a kvízkérdéseket
            </DialogDescription>
          </DialogHeader>
          <QuestionBank mode="management" />
        </DialogContent>
      </Dialog>
    </div>
  );
}