import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Crown, Mail, Phone } from 'lucide-react';

export default function AdminUsersPage() {
  // Mock data for now - this would come from an API endpoint
  const users = [
    {
      id: '1',
      firstName: 'Márk',
      lastName: 'Görgei',
      email: 'gorgeimarko@gmail.com',
      phone: '+36304508660',
      isAdmin: true,
      subscriptionType: 'free',
      isEmailVerified: true,
      isPhoneVerified: false,
      createdAt: new Date('2025-05-27')
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Users
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage platform users and their permissions
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {user.firstName} {user.lastName}
                        {user.isAdmin && (
                          <Crown className="h-4 w-4 text-yellow-500 ml-2 inline" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        Member since {user.createdAt.toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                    {user.isEmailVerified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{user.phone}</span>
                      {user.isPhoneVerified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Role:</span>
                    <Badge variant={user.isAdmin ? "default" : "outline"}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subscription:</span>
                    <Badge variant={user.subscriptionType === 'free' ? "secondary" : "default"}>
                      {user.subscriptionType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                Users will appear here once they register
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}