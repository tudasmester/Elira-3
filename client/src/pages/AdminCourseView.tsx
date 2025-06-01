import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  BookOpen, 
  CheckCircle,
  Eye,
  PlayCircle
} from "lucide-react";
import { AdminGuard } from "@/components/AdminGuard";

interface CourseDetails {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  duration: string;
  instructor: string;
  university: string;
  status: string;
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
  modules: Array<{
    id: number;
    title: string;
    description: string;
    orderIndex: number;
    lessons: Array<{
      id: number;
      title: string;
      description: string;
      type: string;
      order: number;
      duration: number;
      quizzes: Array<{
        id: number;
        title: string;
        questionsCount: number;
      }>;
    }>;
  }>;
}

export default function AdminCourseView() {
  const { id } = useParams();
  const courseId = parseInt(id || "0");

  const { data: course, isLoading, error } = useQuery<CourseDetails>({
    queryKey: [`/api/admin/courses/${courseId}/detailed`],
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminGuard>
    );
  }

  if (error || !course) {
    return (
      <AdminGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Hiba történt</h1>
            <p className="text-muted-foreground mb-4">A kurzus adatait nem sikerült betölteni.</p>
            <Link href="/admin/courses">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vissza a kurzusokhoz
              </Button>
            </Link>
          </div>
        </div>
      </AdminGuard>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publikált';
      case 'draft': return 'Vázlat';
      case 'archived': return 'Archivált';
      default: return status;
    }
  };

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const totalQuizzes = course.modules.reduce((acc, module) => 
    acc + module.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.quizzes.length, 0), 0
  );

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/courses">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vissza
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">Kurzus részletek - Csak megtekintés</p>
            </div>
          </div>
          <Badge className={getStatusColor(course.status)}>
            {getStatusText(course.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Kurzus áttekintés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Leírás</h3>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">{course.enrollmentCount}</p>
                    <p className="text-xs text-muted-foreground">Hallgató</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium">{course.modules.length}</p>
                    <p className="text-xs text-muted-foreground">Modul</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                      <PlayCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium">{totalLessons}</p>
                    <p className="text-xs text-muted-foreground">Lecke</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                      <CheckCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium">{totalQuizzes}</p>
                    <p className="text-xs text-muted-foreground">Kvíz</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Kurzus szerkezete</CardTitle>
                <CardDescription>
                  Modulok és leckék áttekintése
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {moduleIndex + 1}. modul
                          </Badge>
                          <h3 className="font-semibold">{module.title}</h3>
                        </div>
                        
                        {module.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {module.description}
                          </p>
                        )}
                        
                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="text-xs">
                                  {lessonIndex + 1}.
                                </Badge>
                                <div>
                                  <p className="text-sm font-medium">{lesson.title}</p>
                                  <p className="text-xs text-muted-foreground">{lesson.type}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {lesson.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {lesson.duration} perc
                                  </span>
                                )}
                                {lesson.quizzes.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {lesson.quizzes.length} kvíz
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Kurzus információk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kategória</label>
                  <p className="text-sm">{course.category}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Szint</label>
                  <p className="text-sm">{course.level}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ár</label>
                  <p className="text-sm">{course.price} Ft</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Időtartam</label>
                  <p className="text-sm">{course.duration}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Oktató</label>
                  <p className="text-sm">{course.instructor}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Egyetem</label>
                  <p className="text-sm">{course.university}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle>Időpontok</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Létrehozva</label>
                  <p className="text-sm">{new Date(course.createdAt).toLocaleDateString('hu-HU')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Utolsó módosítás</label>
                  <p className="text-sm">{new Date(course.updatedAt).toLocaleDateString('hu-HU')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Műveletek</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/courses/${course.id}/content`}>
                  <Button className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Tartalom szerkesztése
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}