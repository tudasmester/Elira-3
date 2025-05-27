import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import TutorialGuide from "@/components/TutorialGuide";
import { 
  BookOpen, 
  Award, 
  Target, 
  TrendingUp, 
  Clock, 
  Users, 
  Settings,
  Bell,
  Calendar,
  PlayCircle,
  CheckCircle,
  Star,
  BarChart3,
  Download,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface Enrollment {
  id: string;
  courseId: number;
  progress: number;
  isCompleted: number;
  enrolledAt: string;
  course: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    level: string;
    category: string;
    instructor: string;
    totalLessons: number;
    estimatedDuration: string;
  };
}

interface UserStats {
  totalEnrollments: number;
  completedCourses: number;
  totalStudyTime: number;
  certificatesEarned: number;
  currentStreak: number;
  averageProgress: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [location] = useLocation();
  const [showTutorial, setShowTutorial] = useState(false);

  // Check if user came from registration (tutorial flag)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const shouldShowTutorial = urlParams.get('tutorial') === 'true';
    
    if (shouldShowTutorial && user) {
      setShowTutorial(true);
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [location, user]);

  // Fetch user enrollments
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
    enabled: !!user,
  });

  // Fetch user statistics
  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
  });

  // Calculate real user statistics from enrollments
  const calculateStats = () => {
    if (!enrollments.length) {
      return {
        totalEnrollments: 0,
        completedCourses: 0,
        totalStudyTime: 0,
        certificatesEarned: 0,
        currentStreak: 0,
        averageProgress: 0
      };
    }

    const totalEnrollments = enrollments.length;
    const completedCourses = enrollments.filter(e => e.isCompleted === 1).length;
    const averageProgress = enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments;
    const certificatesEarned = completedCourses;
    
    return {
      totalEnrollments,
      completedCourses,
      totalStudyTime: completedCourses * 8, // Estimate 8 hours per completed course
      certificatesEarned,
      currentStreak: 3, // This would come from activity tracking
      averageProgress: Math.round(averageProgress)
    };
  };

  const stats = userStats || calculateStats();

  if (!user) return null;

  const getUserInitials = () => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getActiveCourses = () => {
    return enrollments.filter(e => e.isCompleted === 0 && e.progress > 0);
  };

  const getRecentActivity = () => {
    return enrollments
      .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Tutorial Guide for first-time users */}
      <TutorialGuide 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profileImageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Üdvözöljük, {user.firstName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Folytatjuk a tanulást? 📚
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Értesítések
            </Button>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Beállítások
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Beiratkozott kurzusok</p>
                  <p className="text-3xl font-bold">{stats.totalEnrollments}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Befejezett kurzusok</p>
                  <p className="text-3xl font-bold">{stats.completedCourses}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Tanulási órák</p>
                  <p className="text-3xl font-bold">{stats.totalStudyTime}h</p>
                </div>
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Megszerzett bizonyítványok</p>
                  <p className="text-3xl font-bold">{stats.certificatesEarned}</p>
                </div>
                <Award className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Áttekintés</TabsTrigger>
            <TabsTrigger value="courses">Kurzusaim</TabsTrigger>
            <TabsTrigger value="progress">Haladás</TabsTrigger>
            <TabsTrigger value="certificates">Bizonyítványok</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PlayCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Folyamatban lévő kurzusok
                  </CardTitle>
                  <CardDescription>Folytassa ott, ahol abbahagyta</CardDescription>
                </CardHeader>
                <CardContent>
                  {getActiveCourses().length > 0 ? (
                    <div className="space-y-4">
                      {getActiveCourses().slice(0, 3).map((enrollment) => (
                        <div key={enrollment.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <img
                            src={enrollment.course.imageUrl}
                            alt={enrollment.course.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{enrollment.course.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{enrollment.course.level}</p>
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600 dark:text-gray-400">Haladás</span>
                                <span className="text-xs font-medium">{enrollment.progress}%</span>
                              </div>
                              <Progress value={enrollment.progress} className="h-2" />
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Folytatás
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Még nincsenek folyamatban lévő kurzusai</p>
                      <Link href="/courses">
                        <Button className="mt-4">
                          Kurzusok böngészése
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-600" />
                    Legutóbbi tevékenység
                  </CardTitle>
                  <CardDescription>Az elmúlt hét tevékenysége</CardDescription>
                </CardHeader>
                <CardContent>
                  {getRecentActivity().length > 0 ? (
                    <div className="space-y-3">
                      {getRecentActivity().map((enrollment) => (
                        <div key={enrollment.id} className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{enrollment.course.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Beiratkozott: {new Date(enrollment.enrolledAt).toLocaleDateString('hu-HU')}
                            </p>
                          </div>
                          <Badge variant={enrollment.isCompleted ? "default" : "secondary"}>
                            {enrollment.isCompleted ? "Befejezve" : `${enrollment.progress}%`}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Még nincs tevékenység</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Learning Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  Tanulási célok
                </CardTitle>
                <CardDescription>Állítsa be heti tanulási céljait</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Heti órák</h4>
                    <p className="text-2xl font-bold text-blue-600">8h</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">cél: 10h</p>
                  </div>
                  <div className="text-center">
                    <div className="h-20 w-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Leckék</h4>
                    <p className="text-2xl font-bold text-green-600">12</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">cél: 15</p>
                  </div>
                  <div className="text-center">
                    <div className="h-20 w-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Sorozat</h4>
                    <p className="text-2xl font-bold text-purple-600">{stats.currentStreak}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">nap</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Beiratkozott kurzusaim</CardTitle>
                <CardDescription>Minden kurzus, amelyre beiratkozott</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                      <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img
                            src={enrollment.course.imageUrl}
                            alt={enrollment.course.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-4 right-4">
                            {enrollment.course.level}
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-2">{enrollment.course.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {enrollment.course.description.substring(0, 100)}...
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Haladás</span>
                              <span className="text-sm font-medium">{enrollment.progress}%</span>
                            </div>
                            <Progress value={enrollment.progress} className="h-2" />
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <Badge variant={enrollment.isCompleted ? "default" : "secondary"}>
                              {enrollment.isCompleted ? "Befejezve" : "Folyamatban"}
                            </Badge>
                            <Button size="sm">
                              {enrollment.isCompleted ? "Áttekintés" : "Folytatás"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Még nincsenek kurzusai</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Kezdje el felfedezni a széleskörű kurzuskínálatunkat
                    </p>
                    <Link href="/courses">
                      <Button>
                        Kurzusok böngészése
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Tanulási statisztikák
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Átlagos haladás</span>
                        <span className="text-sm text-gray-600">{stats.averageProgress}%</span>
                      </div>
                      <Progress value={stats.averageProgress} className="h-3" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Befejezési arány</span>
                        <span className="text-sm text-gray-600">
                          {stats.totalEnrollments > 0 ? Math.round((stats.completedCourses / stats.totalEnrollments) * 100) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={stats.totalEnrollments > 0 ? (stats.completedCourses / stats.totalEnrollments) * 100 : 0} 
                        className="h-3" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Teljesítmény elemzés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Jó ritmus!</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tartsa fenn a tempót</p>
                        </div>
                      </div>
                    </div>
                    
                    {stats.currentStreak >= 3 && (
                      <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <Star className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">Sorozat bajnok!</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.currentStreak} napos sorozat</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Megszerzett bizonyítványok
                </CardTitle>
                <CardDescription>Az összes elismert bizonyítvány egy helyen</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.certificatesEarned > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrollments
                      .filter(e => e.isCompleted === 1)
                      .map((enrollment) => (
                        <Card key={enrollment.id} className="border-2 border-green-200 dark:border-green-800">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                <Award className="h-8 w-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{enrollment.course.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Befejezve: {new Date(enrollment.enrolledAt).toLocaleDateString('hu-HU')}
                                </p>
                                <div className="flex space-x-2 mt-3">
                                  <Button size="sm" variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Letöltés
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Megosztás
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Még nincsenek bizonyítványai</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Fejezzen be kurzusokat, hogy bizonyítványokat szerezzen
                    </p>
                    <Link href="/courses">
                      <Button>
                        Kurzusok böngészése
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}