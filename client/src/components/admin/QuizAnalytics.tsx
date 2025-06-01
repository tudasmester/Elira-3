import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, TrendingUp, TrendingDown, Clock, Users, 
  Target, AlertTriangle, CheckCircle2, XCircle, 
  Brain, Award, Calendar, Download, Filter,
  PieChart, LineChart, Activity, Zap, Eye
} from 'lucide-react';

interface QuizAnalyticsProps {
  quizId?: string;
  courseId?: number;
}

interface QuizPerformanceData {
  quizId: string;
  title: string;
  attempts: number;
  averageScore: number;
  passRate: number;
  averageTime: number;
  difficultyRating: 'easy' | 'medium' | 'hard';
  completionRate: number;
}

interface QuestionAnalytics {
  questionId: string;
  text: string;
  type: string;
  correctAnswers: number;
  totalAttempts: number;
  averageTime: number;
  discriminationIndex: number;
  difficultyIndex: number;
  commonWrongAnswers: string[];
}

interface StudentPerformance {
  studentId: string;
  name: string;
  score: number;
  timeSpent: number;
  attempts: number;
  completedAt: Date;
  struggles: string[];
  strengths: string[];
}

export function QuizAnalytics({ quizId, courseId }: QuizAnalyticsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedQuiz, setSelectedQuiz] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real implementation, this would come from API
  const quizPerformance: QuizPerformanceData[] = [
    {
      quizId: '1',
      title: 'Matematikai alapok',
      attempts: 125,
      averageScore: 78.5,
      passRate: 82.4,
      averageTime: 18.5,
      difficultyRating: 'medium',
      completionRate: 94.2
    },
    {
      quizId: '2',
      title: 'Algebra bevezető',
      attempts: 98,
      averageScore: 71.2,
      passRate: 74.5,
      averageTime: 22.3,
      difficultyRating: 'hard',
      completionRate: 89.8
    }
  ];

  const questionAnalytics: QuestionAnalytics[] = [
    {
      questionId: '1',
      text: 'Mi az x értéke a 2x + 5 = 13 egyenletben?',
      type: 'numerical',
      correctAnswers: 98,
      totalAttempts: 125,
      averageTime: 45,
      discriminationIndex: 0.65,
      difficultyIndex: 0.78,
      commonWrongAnswers: ['6', '9', '3']
    },
    {
      questionId: '2',
      text: 'Melyik a helyes megoldás?',
      type: 'multiple_choice',
      correctAnswers: 87,
      totalAttempts: 125,
      averageTime: 32,
      discriminationIndex: 0.45,
      difficultyIndex: 0.70,
      commonWrongAnswers: ['B', 'D']
    }
  ];

  const studentPerformances: StudentPerformance[] = [
    {
      studentId: '1',
      name: 'Nagy Péter',
      score: 92,
      timeSpent: 16,
      attempts: 1,
      completedAt: new Date('2024-06-01T10:30:00'),
      struggles: [],
      strengths: ['algebra', 'számítás']
    },
    {
      studentId: '2',
      name: 'Kovács Anna',
      score: 65,
      timeSpent: 28,
      attempts: 2,
      completedAt: new Date('2024-06-01T14:20:00'),
      struggles: ['szöveges feladatok', 'geometria'],
      strengths: ['alapműveletek']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const generateReport = () => {
    // Generate comprehensive analytics report
    const reportData = {
      quizPerformance,
      questionAnalytics,
      studentPerformances,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Kvíz analitika</h2>
          <p className="text-gray-600">Részletes teljesítmény elemzések és jelentések</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 nap</SelectItem>
              <SelectItem value="30d">30 nap</SelectItem>
              <SelectItem value="90d">90 nap</SelectItem>
              <SelectItem value="1y">1 év</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Jelentés letöltése
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Áttekintés</TabsTrigger>
          <TabsTrigger value="questions">Kérdéselemzés</TabsTrigger>
          <TabsTrigger value="students">Hallgatói teljesítmény</TabsTrigger>
          <TabsTrigger value="trends">Trendek</TabsTrigger>
          <TabsTrigger value="recommendations">Javaslatok</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Összes próbálkozás</p>
                    <p className="text-2xl font-bold">223</p>
                    <p className="text-xs text-green-600">+12% ez a hét</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Átlagos pontszám</p>
                    <p className="text-2xl font-bold">74.8%</p>
                    <p className="text-xs text-green-600">+2.3% múlt héthez képest</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Átlagos idő</p>
                    <p className="text-2xl font-bold">20.4 perc</p>
                    <p className="text-xs text-red-600">+1.2 perc múlt héthez képest</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sikerességi arány</p>
                    <p className="text-2xl font-bold">78.5%</p>
                    <p className="text-xs text-green-600">+3.1% múlt héthez képest</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Kvízek teljesítménye
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizPerformance.map((quiz) => (
                  <div key={quiz.quizId} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{quiz.title}</h4>
                        <p className="text-sm text-gray-600">{quiz.attempts} próbálkozás</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(quiz.difficultyRating)}>
                          {quiz.difficultyRating === 'easy' ? 'Könnyű' :
                           quiz.difficultyRating === 'medium' ? 'Közepes' : 'Nehéz'}
                        </Badge>
                        <Badge variant="outline">{quiz.averageScore.toFixed(1)}% átlag</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Sikerességi arány</p>
                        <div className="flex items-center gap-2">
                          <Progress value={quiz.passRate} className="flex-1" />
                          <span className="font-medium">{quiz.passRate.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Befejezési arány</p>
                        <div className="flex items-center gap-2">
                          <Progress value={quiz.completionRate} className="flex-1" />
                          <span className="font-medium">{quiz.completionRate.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Átlagos idő</p>
                        <p className="font-medium">{quiz.averageTime.toFixed(1)} perc</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Átlagos pontszám</p>
                        <p className={`font-medium ${getPerformanceColor(quiz.averageScore)}`}>
                          {quiz.averageScore.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Pontszám megoszlás
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Kiváló (90-100%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={25} className="w-20" />
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Jó (80-89%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={35} className="w-20" />
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Közepes (60-79%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={28} className="w-20" />
                      <span className="text-sm font-medium">28%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Gyenge (0-59%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={12} className="w-20" />
                      <span className="text-sm font-medium">12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Aktivitási trendek
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Csúcsidő</span>
                    <Badge variant="outline">14:00-16:00</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Legnépszerűbb nap</span>
                    <Badge variant="outline">Szerda</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Átlagos próbálkozások</span>
                    <Badge variant="outline">1.4 / hallgató</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lemorzsolódási pont</span>
                    <Badge variant="destructive">5. kérdés után</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Kérdéselemzés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questionAnalytics.map((question) => {
                  const correctRate = (question.correctAnswers / question.totalAttempts) * 100;
                  const difficultyLevel = correctRate > 80 ? 'easy' : correctRate > 60 ? 'medium' : 'hard';
                  
                  return (
                    <div key={question.questionId} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium mb-1">{question.text}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{question.type}</Badge>
                            <Badge className={getDifficultyColor(difficultyLevel)}>
                              {difficultyLevel === 'easy' ? 'Könnyű' :
                               difficultyLevel === 'medium' ? 'Közepes' : 'Nehéz'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getPerformanceColor(correctRate)}`}>
                            {correctRate.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-600">helyes válasz</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Próbálkozások</p>
                          <p className="font-medium">{question.totalAttempts}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Átlagos idő</p>
                          <p className="font-medium">{question.averageTime}s</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Diszkrimináció</p>
                          <p className="font-medium">
                            {question.discriminationIndex.toFixed(2)}
                            {question.discriminationIndex < 0.3 && 
                              <AlertTriangle className="inline h-3 w-3 ml-1 text-red-500" />
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Nehézségi index</p>
                          <p className="font-medium">{question.difficultyIndex.toFixed(2)}</p>
                        </div>
                      </div>

                      {question.commonWrongAnswers.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600 mb-2">Gyakori hibás válaszok:</p>
                          <div className="flex flex-wrap gap-1">
                            {question.commonWrongAnswers.map((answer, index) => (
                              <Badge key={index} variant="secondary">{answer}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {question.discriminationIndex < 0.3 && (
                        <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <p className="text-sm text-yellow-800">
                              Alacsony diszkrimináció - a kérdés felülvizsgálatra szorul
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Hallgatói teljesítmények
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentPerformances.map((student) => (
                  <div key={student.studentId} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-600">
                          {student.attempts} próbálkozás • {student.timeSpent} perc
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getPerformanceColor(student.score)}`}>
                          {student.score}%
                        </p>
                        <p className="text-xs text-gray-600">pontszám</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {student.strengths.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-green-700 mb-2">Erősségek</p>
                          <div className="flex flex-wrap gap-1">
                            {student.strengths.map((strength, index) => (
                              <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {student.struggles.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-red-700 mb-2">Fejleszthető területek</p>
                          <div className="flex flex-wrap gap-1">
                            {student.struggles.map((struggle, index) => (
                              <Badge key={index} variant="destructive" className="bg-red-100 text-red-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                {struggle}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Teljesítmény trendek
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Átlagos pontszám trend</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">+5.2%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Befejezési arány trend</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">+2.1%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Időfelhasználás trend</span>
                    <div className="flex items-center gap-1 text-red-600">
                      <TrendingDown className="h-4 w-4" />
                      <span className="text-sm font-medium">+8.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Időbeli eloszlás
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hétfő</span>
                    <Progress value={15} className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kedd</span>
                    <Progress value={25} className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Szerda</span>
                    <Progress value={30} className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Csütörtök</span>
                    <Progress value={20} className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Péntek</span>
                    <Progress value={10} className="w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Automatikus javaslatok
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Kérdés optimalizálás</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      A 2. kérdés alacsony diszkriminációs értéke alapján javasoljuk a válaszlehetőségek felülvizsgálatát.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Időkorlát beállítás</h4>
                    <p className="text-sm text-yellow-800 mt-1">
                      Az átlagos megoldási idő alapján javasoljuk az időkorlát 25 percre emelését.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 border-l-4 border-green-400">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Nehézség egyensúly</h4>
                    <p className="text-sm text-green-800 mt-1">
                      A kvíz jól kiegyensúlyozott nehézségű. A jelenlegi beállítások megtartása javasolt.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border-l-4 border-purple-400">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900">Tanulási támogatás</h4>
                    <p className="text-sm text-purple-800 mt-1">
                      A "szöveges feladatok" területen több hallgató küzd nehézségekkel. 
                      További gyakorló anyagok hozzáadása javasolt.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}