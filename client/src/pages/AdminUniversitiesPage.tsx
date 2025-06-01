import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

export default function AdminUniversitiesPage() {
  const { data: universities, isLoading } = useQuery({
    queryKey: ['/api/admin/universities'],
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Universities
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage partner universities and educational institutions
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add University
          </Button>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities?.map((university: any) => (
            <Card key={university.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {university.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {university.description || 'Partner educational institution'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {university.location && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="font-medium">{university.location}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  {university.website && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Website:</span>
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Courses:</span>
                    <Badge variant="secondary">
                      {university.courseCount || 0} courses
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!universities || universities.length === 0) && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No universities found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                Start building partnerships by adding universities
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add University
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}