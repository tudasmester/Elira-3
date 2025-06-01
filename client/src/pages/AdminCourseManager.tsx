import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdminGuard } from '@/components/AdminGuard';
import {
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  MoreHorizontal,
  Users,
  DollarSign,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  Copy,
  Settings,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { Link } from 'wouter';

interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  duration: number;
  difficulty: string;
  category: string;
  tags: string[];
  language: string;
  isHighlighted: boolean;
  imageUrl: string;
  status: 'draft' | 'published' | 'archived';
  accessType: 'free' | 'paid' | 'private';
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
}

const CourseCard: React.FC<{ 
  course: Course; 
  viewMode: 'grid' | 'list';
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onDuplicate: (course: Course) => void;
}> = ({ course, viewMode, onEdit, onDelete, onDuplicate }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getAccessTypeColor = (type: string) => {
    switch (type) {
      case 'free': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'private': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                {course.imageUrl ? (
                  <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <BookOpen className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <Badge className={getStatusColor(course.status)}>
                    {course.status}
                  </Badge>
                  <Badge className={getAccessTypeColor(course.accessType)}>
                    {course.accessType}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-2">{course.shortDescription}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrollmentCount} tanulók</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration} óra</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{course.price > 0 ? `${course.price} Ft` : 'Ingyenes'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Módosítva: {new Date(course.updatedAt).toLocaleDateString('hu-HU')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(course)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDuplicate(course)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(course)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center relative">
          {course.imageUrl ? (
            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover rounded-t-lg" />
          ) : (
            <BookOpen className="h-12 w-12 text-gray-400" />
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute top-2 left-2">
            <Badge className={getStatusColor(course.status)}>
              {course.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{course.shortDescription}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.enrollmentCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}h</span>
            </div>
            <Badge className={getAccessTypeColor(course.accessType)}>
              {course.accessType}
            </Badge>
          </div>

          {course.price > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Ár</span>
              <div className="flex items-center gap-2">
                {course.originalPrice > course.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {course.originalPrice} Ft
                  </span>
                )}
                <span className="font-semibold text-green-600">
                  {course.price} Ft
                </span>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
              <Edit className="h-4 w-4 mr-2" />
              Szerkesztés
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => onDuplicate(course)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(course)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminCourseManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAccessType, setSelectedAccessType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/admin/courses'],
  });

  const handleEditCourse = (course: Course) => {
    // TODO: Navigate to course editor
    console.log('Edit course:', course.id);
  };

  const handleDeleteCourse = (course: Course) => {
    // TODO: Implement delete confirmation
    console.log('Delete course:', course.id);
  };

  const handleDuplicateCourse = (course: Course) => {
    // TODO: Implement course duplication
    console.log('Duplicate course:', course.id);
  };

  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
    const matchesAccessType = selectedAccessType === 'all' || course.accessType === selectedAccessType;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesAccessType;
  });

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Kurzuskezelő</h1>
            <p className="text-gray-600 mt-1">
              Tekintse át és kezelje az iskolai kurzusokat.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/admin/courses/import">
                Kurzus importálás
              </Link>
            </Button>
            <Button variant="outline">
              Kategóriák kezelése
            </Button>
            <Button asChild>
              <Link href="/admin/courses/create">
                <Plus className="h-4 w-4 mr-2" />
                Kurzus létrehozása
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Összes kurzus</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 az elmúlt hónapban
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publikált</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.filter((c: Course) => c.status === 'published').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Aktív kurzusok
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Összes tanuló</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.reduce((sum: number, c: Course) => sum + c.enrollmentCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Beiratkozott tanulók
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bevétel</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4M Ft</div>
              <p className="text-xs text-muted-foreground">
                +20.1% az előző hónaphoz képest
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Kurzusok keresése..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Kategória" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden kategória</SelectItem>
                <SelectItem value="technology">Technológia</SelectItem>
                <SelectItem value="business">Üzlet</SelectItem>
                <SelectItem value="design">Dizájn</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Státusz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden státusz</SelectItem>
                <SelectItem value="published">Publikált</SelectItem>
                <SelectItem value="draft">Tervezet</SelectItem>
                <SelectItem value="archived">Archivált</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAccessType} onValueChange={setSelectedAccessType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Hozzáférés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden típus</SelectItem>
                <SelectItem value="free">Ingyenes</SelectItem>
                <SelectItem value="paid">Fizetős</SelectItem>
                <SelectItem value="private">Privát</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Course Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {filteredCourses.length} kurzus megjelenítve
          </p>
        </div>

        {/* Courses Grid/List */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nincsenek kurzusok</h3>
            <p className="text-gray-600 mb-6">
              {courses.length === 0
                ? 'Kezdje el az első kurzus létrehozásával.'
                : 'Nincs a szűrési feltételeknek megfelelő kurzus.'
              }
            </p>
            {courses.length === 0 && (
              <Button asChild>
                <Link href="/admin/courses/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Első kurzus létrehozása
                </Link>
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course: Course) => (
              <CourseCard
                key={course.id}
                course={course}
                viewMode={viewMode}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onDuplicate={handleDuplicateCourse}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course: Course) => (
              <CourseCard
                key={course.id}
                course={course}
                viewMode={viewMode}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onDuplicate={handleDuplicateCourse}
              />
            ))}
          </div>
        )}
      </div>
    </AdminGuard>
  );
}