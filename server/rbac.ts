import { Request, Response, NextFunction } from 'express';
import { User } from '@shared/schema';

// Role definitions
export enum Role {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// Permission definitions
export enum Permission {
  // Course permissions
  CREATE_COURSE = 'create_course',
  EDIT_COURSE = 'edit_course',
  DELETE_COURSE = 'delete_course',
  PUBLISH_COURSE = 'publish_course',
  VIEW_COURSE_ANALYTICS = 'view_course_analytics',
  
  // User management
  MANAGE_USERS = 'manage_users',
  VIEW_USER_DATA = 'view_user_data',
  EDIT_USER_ROLES = 'edit_user_roles',
  
  // System administration
  MANAGE_SYSTEM = 'manage_system',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_UNIVERSITIES = 'manage_universities',
  
  // Learning paths
  CREATE_LEARNING_PATH = 'create_learning_path',
  EDIT_LEARNING_PATH = 'edit_learning_path',
  
  // Content management
  MODERATE_CONTENT = 'moderate_content',
  FEATURE_CONTENT = 'feature_content'
}

// Role-Permission mapping
const rolePermissions: Record<Role, Permission[]> = {
  [Role.STUDENT]: [
    Permission.CREATE_LEARNING_PATH,
    Permission.EDIT_LEARNING_PATH
  ],
  
  [Role.INSTRUCTOR]: [
    Permission.CREATE_COURSE,
    Permission.EDIT_COURSE,
    Permission.VIEW_COURSE_ANALYTICS,
    Permission.CREATE_LEARNING_PATH,
    Permission.EDIT_LEARNING_PATH
  ],
  
  [Role.ADMIN]: [
    Permission.CREATE_COURSE,
    Permission.EDIT_COURSE,
    Permission.DELETE_COURSE,
    Permission.PUBLISH_COURSE,
    Permission.VIEW_COURSE_ANALYTICS,
    Permission.MANAGE_USERS,
    Permission.VIEW_USER_DATA,
    Permission.MANAGE_UNIVERSITIES,
    Permission.CREATE_LEARNING_PATH,
    Permission.EDIT_LEARNING_PATH,
    Permission.MODERATE_CONTENT,
    Permission.FEATURE_CONTENT
  ],
  
  [Role.SUPER_ADMIN]: Object.values(Permission)
};

interface AuthenticatedRequest extends Request {
  user?: User;
}

// Check if user has specific role
export function hasRole(user: User, role: Role): boolean {
  return user.role === role || 
         (role === Role.STUDENT && !user.role) || // Default to student if no role
         user.role === Role.SUPER_ADMIN; // Super admin has all roles
}

// Check if user has specific permission
export function hasPermission(user: User, permission: Permission): boolean {
  const userRole = (user.role as Role) || Role.STUDENT;
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
}

// Middleware factory for role-based access control
export function requireRole(role: Role) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Bejelentkezés szükséges' });
    }

    if (!hasRole(req.user, role)) {
      return res.status(403).json({ 
        message: 'Nincs megfelelő jogosultság ehhez a művelethez' 
      });
    }

    next();
  };
}

// Middleware factory for permission-based access control
export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Bejelentkezés szükséges' });
    }

    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({ 
        message: 'Nincs megfelelő jogosultság ehhez a művelethez' 
      });
    }

    next();
  };
}

// Multiple role check
export function requireAnyRole(roles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Bejelentkezés szükséges' });
    }

    const hasAnyRole = roles.some(role => hasRole(req.user!, role));
    if (!hasAnyRole) {
      return res.status(403).json({ 
        message: 'Nincs megfelelő jogosultság ehhez a művelethez' 
      });
    }

    next();
  };
}

// Check if user can access specific resource (ownership or permission)
export function canAccessResource(user: User, resourceOwnerId: string, permission?: Permission): boolean {
  // User owns the resource
  if (user.id === resourceOwnerId) {
    return true;
  }

  // User has specific permission
  if (permission && hasPermission(user, permission)) {
    return true;
  }

  return false;
}

// Middleware for resource ownership or permission
export function requireResourceAccess(
  getResourceOwnerId: (req: AuthenticatedRequest) => string | Promise<string>,
  permission?: Permission
) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Bejelentkezés szükséges' });
    }

    try {
      const resourceOwnerId = await getResourceOwnerId(req);
      
      if (!canAccessResource(req.user, resourceOwnerId, permission)) {
        return res.status(403).json({ 
          message: 'Nincs jogosultság ehhez a tartalomhoz' 
        });
      }

      next();
    } catch (error) {
      console.error('Resource access check error:', error);
      res.status(500).json({ message: 'Szerver hiba' });
    }
  };
}