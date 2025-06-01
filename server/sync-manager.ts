import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { db } from './db';
import { courses, enrollments, lessons } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface SyncMessage {
  type: 'course_update' | 'enrollment_update' | 'lesson_update';
  action: 'create' | 'update' | 'delete';
  data: any;
  userId?: string;
  isAdmin?: boolean;
}

export class DatabaseSyncManager {
  private wss: WebSocketServer;
  private adminClients = new Set<WebSocket>();
  private userClients = new Map<string, Set<WebSocket>>(); // userId -> WebSocket set

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/sync' 
    });
    
    this.setupWebSocketHandlers();
    this.setupDatabaseListeners();
  }

  private setupWebSocketHandlers() {
    this.wss.on('connection', (ws, request) => {
      const url = new URL(request.url!, `http://${request.headers.host}`);
      const userId = url.searchParams.get('userId');
      const isAdmin = url.searchParams.get('isAdmin') === 'true';

      // Register client based on role
      if (isAdmin) {
        this.adminClients.add(ws);
      } else if (userId) {
        if (!this.userClients.has(userId)) {
          this.userClients.set(userId, new Set());
        }
        this.userClients.get(userId)!.add(ws);
      }

      // Handle client disconnect
      ws.on('close', () => {
        if (isAdmin) {
          this.adminClients.delete(ws);
        } else if (userId && this.userClients.has(userId)) {
          this.userClients.get(userId)!.delete(ws);
          if (this.userClients.get(userId)!.size === 0) {
            this.userClients.delete(userId);
          }
        }
      });

      // Send initial connection confirmation
      ws.send(JSON.stringify({
        type: 'connection_established',
        role: isAdmin ? 'admin' : 'user',
        userId
      }));
    });
  }

  private setupDatabaseListeners() {
    // PostgreSQL LISTEN/NOTIFY integration would go here
    // For now, we'll use application-level triggers
  }

  /**
   * Broadcast course changes to relevant clients
   */
  async broadcastCourseUpdate(courseId: number, action: 'create' | 'update' | 'delete') {
    const courseData = action !== 'delete' 
      ? await db.select().from(courses).where(eq(courses.id, courseId)).limit(1)
      : null;

    const message: SyncMessage = {
      type: 'course_update',
      action,
      data: courseData?.[0] || { id: courseId }
    };

    // Always notify admin clients
    this.notifyAdminClients(message);

    // Only notify user clients if course is published
    if (!courseData?.[0] || courseData[0].isPublished) {
      this.notifyAllUserClients(message);
    }
  }

  /**
   * Broadcast enrollment changes to specific user
   */
  async broadcastEnrollmentUpdate(userId: string, courseId: number, action: 'create' | 'update' | 'delete') {
    const enrollmentData = action !== 'delete'
      ? await db.select().from(enrollments)
          .where(eq(enrollments.userId, userId))
          .where(eq(enrollments.courseId, courseId))
          .limit(1)
      : null;

    const message: SyncMessage = {
      type: 'enrollment_update',
      action,
      data: enrollmentData?.[0] || { userId, courseId },
      userId
    };

    // Notify specific user
    this.notifyUserClients(userId, message);
    
    // Notify admin clients for analytics
    this.notifyAdminClients(message);
  }

  /**
   * Broadcast lesson content updates
   */
  async broadcastLessonUpdate(lessonId: number, action: 'create' | 'update' | 'delete') {
    const lessonData = action !== 'delete'
      ? await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1)
      : null;

    const message: SyncMessage = {
      type: 'lesson_update',
      action,
      data: lessonData?.[0] || { id: lessonId }
    };

    // Notify all clients (admin can see all, users see published content)
    this.notifyAdminClients(message);
    this.notifyAllUserClients(message);
  }

  private notifyAdminClients(message: SyncMessage) {
    const messageStr = JSON.stringify(message);
    this.adminClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  private notifyUserClients(userId: string, message: SyncMessage) {
    const userSockets = this.userClients.get(userId);
    if (userSockets) {
      const messageStr = JSON.stringify(message);
      userSockets.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
  }

  private notifyAllUserClients(message: SyncMessage) {
    const messageStr = JSON.stringify(message);
    this.userClients.forEach(userSockets => {
      userSockets.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    });
  }

  /**
   * Get current statistics for admin dashboard
   */
  async getRealtimeStats() {
    return {
      connectedAdmins: this.adminClients.size,
      connectedUsers: this.userClients.size,
      totalConnections: this.adminClients.size + Array.from(this.userClients.values())
        .reduce((sum, sockets) => sum + sockets.size, 0)
    };
  }
}

// Export singleton instance
export let syncManager: DatabaseSyncManager;