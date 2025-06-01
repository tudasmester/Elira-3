import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Plus, Edit, Trash2, Copy, Download, Upload, 
  Filter, Tag, BookOpen, BarChart3, Star, Clock,
  FileText, Calculator, Move, Image, MapPin,
  CheckCircle2, XCircle, AlertTriangle, Lightbulb, Archive,
  Users, Share2, Eye, Settings, TrendingUp
} from 'lucide-react';
import { QuizQuestion, QuestionPool } from '@shared/activity-types';

interface QuestionBankProps {
  courseId?: number;
  onQuestionSelect?: (questions: QuizQuestion[]) => void;
  mode?: 'selection' | 'management';
}

export function QuestionBank({ courseId, onQuestionSelect, mode = 'management' }: QuestionBankProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [poolDialogOpen, setPoolDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');

  const categories = [
    'Matematika',
    'Fizika',
    'Kémia',
    'Biológia',
    'Informatika',
    'Történelem',
    'Irodalom',
    'Nyelvtan',
    'Földrajz',
    'Egyéb'
  ];

  const allTags = [
    'alapfogalom', 'gyakorlati', 'elméleti', 'számítás', 'definíció',
    'alkalmazás', 'összehasonlítás', 'elemzés', 'szintézis', 'értékelés',
    'emlékezés', 'megértés', 'problémamegoldás', 'kritikus gondolkodás'
  ];

  const questionTypes = [
    { value: 'multiple_choice', label: 'Feleletválasztós', icon: CheckCircle2 },
    { value: 'true_false', label: 'Igaz/Hamis', icon: XCircle },
    { value: 'short_answer', label: 'Rövid válasz', icon: FileText },
    { value: 'essay', label: 'Esszé', icon: FileText },
    { value: 'numerical', label: 'Numerikus', icon: Calculator },
    { value: 'calculated', label: 'Számított', icon: Calculator },
    { value: 'matching', label: 'Párosítás', icon: Move },
    { value: 'cloze', label: 'Hiányos szöveg', icon: AlertTriangle },
    { value: 'drag_drop_image', label: 'Képre húzás', icon: Image },
    { value: 'hotspot', label: 'Képi zóna', icon: MapPin }
  ];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => question.tags?.includes(tag));
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesTags;
  });

  const toggleQuestionSelection = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const selectFilteredQuestions = () => {
    if (onQuestionSelect) {
      const selected = filteredQuestions.filter(q => selectedQuestions.has(q.id));
      onQuestionSelect(selected);
    }
  };

  const exportQuestions = (format: 'json' | 'csv' | 'gift' | 'qti') => {
    const selected = questions.filter(q => selectedQuestions.has(q.id));
    
    switch (format) {
      case 'json':
        downloadFile(JSON.stringify(selected, null, 2), 'questions.json', 'application/json');
        break;
      case 'csv':
        const csvContent = convertToCSV(selected);
        downloadFile(csvContent, 'questions.csv', 'text/csv');
        break;
      case 'gift':
        const giftContent = convertToGIFT(selected);
        downloadFile(giftContent, 'questions.gift', 'text/plain');
        break;
      case 'qti':
        const qtiContent = convertToQTI(selected);
        downloadFile(qtiContent, 'questions.xml', 'application/xml');
        break;
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (questions: QuizQuestion[]) => {
    const headers = ['ID', 'Type', 'Text', 'Points', 'Category', 'Difficulty', 'Tags', 'Correct Answer'];
    const rows = questions.map(q => [
      q.id,
      q.type,
      `"${q.text.replace(/"/g, '""')}"`,
      q.points,
      q.category || '',
      q.difficulty || '',
      q.tags?.join(';') || '',
      Array.isArray(q.correctAnswer) ? q.correctAnswer.join(';') : q.correctAnswer || ''
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const convertToGIFT = (questions: QuizQuestion[]) => {
    return questions.map(q => {
      let gift = `// ${q.category || 'General'} - ${q.difficulty || 'medium'}\n`;
      gift += `::${q.id}:: ${q.text} `;
      
      if (q.type === 'multiple_choice' && q.options) {
        gift += '{\n';
        q.options.forEach(option => {
          gift += `${option.isCorrect ? '=' : '~'}${option.text}\n`;
        });
        gift += '}\n';
      } else if (q.type === 'true_false') {
        gift += `{${q.correctAnswer === true ? 'TRUE' : 'FALSE'}}\n`;
      } else if (q.type === 'short_answer') {
        gift += `{=${q.correctAnswer}}\n`;
      }
      
      if (q.explanation) {
        gift += `# ${q.explanation}\n`;
      }
      
      return gift + '\n';
    }).join('');
  };

  const convertToQTI = (questions: QuizQuestion[]) => {
    // Simplified QTI 2.1 format
    let qti = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1"
                identifier="questions_export"
                title="Exported Questions"
                adaptive="false"
                timeDependent="false">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse>
      <value>A</value>
    </correctResponse>
  </responseDeclaration>
  <itemBody>`;

    questions.forEach(q => {
      qti += `
    <div class="question" data-id="${q.id}" data-type="${q.type}">
      <p>${q.text}</p>`;
      
      if (q.options) {
        qti += `
      <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">`;
        q.options.forEach((option, index) => {
          qti += `
        <simpleChoice identifier="${String.fromCharCode(65 + index)}" ${option.isCorrect ? 'correct="true"' : ''}>
          ${option.text}
        </simpleChoice>`;
        });
        qti += `
      </choiceInteraction>`;
      }
      
      qti += `
    </div>`;
    });

    qti += `
  </itemBody>
</assessmentItem>`;
    
    return qti;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Kérdésbank</h2>
          <p className="text-gray-600">Kérdések kezelése és szervezése</p>
        </div>
        <div className="flex gap-2">
          {mode === 'selection' && selectedQuestions.size > 0 && (
            <Button onClick={selectFilteredQuestions}>
              Kiválasztott kérdések használata ({selectedQuestions.size})
            </Button>
          )}
          {mode === 'management' && (
            <>
              <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Importálás
              </Button>
              <Button variant="outline" onClick={() => setPoolDialogOpen(true)}>
                <BookOpen className="h-4 w-4 mr-2" />
                Kérdésgyűjtemény
              </Button>
              <Button onClick={() => setQuestionDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Új kérdés
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="questions">Kérdések</TabsTrigger>
          <TabsTrigger value="analytics">Analitika</TabsTrigger>
          <TabsTrigger value="collaboration">Együttműködés</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          {/* Search and Filter Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Kérdések keresése..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategória" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Minden kategória</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nehézség" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Minden szint</SelectItem>
                    <SelectItem value="easy">Könnyű</SelectItem>
                    <SelectItem value="medium">Közepes</SelectItem>
                    <SelectItem value="hard">Nehéz</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Szűrők
                  </Button>
                  {selectedQuestions.size > 0 && (
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportQuestions('json')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedTags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Question List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.map((question) => {
              const questionType = questionTypes.find(t => t.value === question.type);
              const isSelected = selectedQuestions.has(question.id);
              
              return (
                <Card key={question.id} className={`p-4 cursor-pointer transition-colors ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}>
                  <div className="flex items-start gap-4">
                    {mode === 'selection' && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleQuestionSelection(question.id)}
                        className="mt-1"
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {questionType && <questionType.icon className="h-4 w-4" />}
                        <Badge variant="outline">{questionType?.label}</Badge>
                        <Badge variant="secondary">{question.points} pont</Badge>
                        {question.difficulty && (
                          <Badge variant={
                            question.difficulty === 'easy' ? 'default' :
                            question.difficulty === 'medium' ? 'secondary' : 'destructive'
                          }>
                            {question.difficulty === 'easy' ? 'Könnyű' :
                             question.difficulty === 'medium' ? 'Közepes' : 'Nehéz'}
                          </Badge>
                        )}
                        {question.category && (
                          <Badge variant="outline">{question.category}</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                        {question.text}
                      </p>
                      
                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {question.tags.map(tag => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs cursor-pointer"
                              onClick={() => {
                                if (!selectedTags.includes(tag)) {
                                  setSelectedTags([...selectedTags, tag]);
                                }
                              }}
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {mode === 'management' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
            
            {filteredQuestions.length === 0 && (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">Nincsenek kérdések</p>
                <p className="text-sm text-gray-400">
                  {questions.length === 0 
                    ? 'Még nincsenek kérdések hozzáadva a bankhoz'
                    : 'A szűrési feltételeknek megfelelő kérdések nem találhatók'
                  }
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Kérdésstatisztikák
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Összes kérdés:</span>
                    <Badge>{questions.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Átlagos nehézség:</span>
                    <Badge variant="secondary">Közepes</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Legnépszerűbb típus:</span>
                    <Badge variant="outline">Feleletválasztós</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Teljesítmény elemzés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Átlagos pontszám:</span>
                    <Badge>85%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Legnehezebb kérdés:</span>
                    <Badge variant="destructive">45% helyes</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Legkönnyebb kérdés:</span>
                    <Badge variant="default">95% helyes</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Használati statisztikák
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Kvízekben használt:</span>
                    <Badge>{Math.floor(questions.length * 0.8)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Utoljára módosítva:</span>
                    <Badge variant="outline">2 napja</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Legnépszerűbb kategória:</span>
                    <Badge variant="secondary">Matematika</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Kategóriánkénti megoszlás</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.slice(0, 5).map((category, index) => {
                  const count = Math.floor(Math.random() * 50) + 10;
                  const percentage = (count / questions.length * 100) || 0;
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <div className="w-24 text-sm">{category}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm text-right">{count}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Együttműködő szerzők
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      JD
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Dr. Jókai Dóra</p>
                      <p className="text-sm text-gray-500">Matematika tanár</p>
                    </div>
                    <Badge variant="outline">15 kérdés</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                      KP
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Kovács Péter</p>
                      <p className="text-sm text-gray-500">Fizika tanár</p>
                    </div>
                    <Badge variant="outline">23 kérdés</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Megosztási beállítások
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Nyilvános kérdésbank</Label>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Kollaboratív szerkesztés</Label>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Automatikus szinkronizáció</Label>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <Separator />
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Megosztási link generálása
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Közösségi kérdésbank</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Csatlakozz a tanári közösséghez és osszd meg a kérdéseidet más oktatókkal.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Közösségi kérdések böngészése
                </Button>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Saját kérdések megosztása
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kérdések importálása</DialogTitle>
            <DialogDescription>
              Támogatott formátumok: JSON, CSV, GIFT, QTI 2.1
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Fájl feltöltése</Label>
              <Input type="file" accept=".json,.csv,.gift,.xml" />
            </div>
            <div>
              <Label>Vagy illeszd be a tartalmat</Label>
              <Textarea 
                placeholder="Illeszd be a kérdéseket GIFT vagy JSON formátumban..."
                className="min-h-32"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                Mégse
              </Button>
              <Button>Importálás</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}