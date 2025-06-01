import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

interface SyncMessage {
  type: 'course_update' | 'enrollment_update' | 'lesson_update' | 'connection_established';
  action?: 'create' | 'update' | 'delete';
  data?: any;
  userId?: string;
  role?: 'admin' | 'user';
}

export function useRealtimeSync() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStats, setConnectionStats] = useState({
    connectedAdmins: 0,
    connectedUsers: 0,
    totalConnections: 0
  });

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Determine WebSocket URL based on environment
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/sync?userId=${user.id}&isAdmin=${user.isAdmin}`;

    // Create WebSocket connection
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('Real-time sync connected');
    };

    ws.onmessage = (event) => {
      try {
        const message: SyncMessage = JSON.parse(event.data);
        handleSyncMessage(message);
      } catch (error) {
        console.error('Failed to parse sync message:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('Real-time sync disconnected');
      
      // Attempt reconnection after delay
      setTimeout(() => {
        if (isAuthenticated && user) {
          // Trigger re-connection by updating the effect dependency
        }
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [isAuthenticated, user?.id, user?.isAdmin]);

  const handleSyncMessage = (message: SyncMessage) => {
    switch (message.type) {
      case 'connection_established':
        console.log(`Connected as ${message.role} user`);
        break;

      case 'course_update':
        handleCourseUpdate(message);
        break;

      case 'enrollment_update':
        handleEnrollmentUpdate(message);
        break;

      case 'lesson_update':
        handleLessonUpdate(message);
        break;

      default:
        console.log('Unknown sync message type:', message.type);
    }
  };

  const handleCourseUpdate = (message: SyncMessage) => {
    const { action, data } = message;
    
    // Invalidate course-related queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
    queryClient.invalidateQueries({ queryKey: ['/api/courses/trending'] });
    queryClient.invalidateQueries({ queryKey: ['/api/courses/careers'] });
    
    // If it's a specific course update, invalidate that course's data
    if (data?.id) {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', data.id.toString()] });
    }

    // Show user-friendly notifications
    if (action === 'create' && data?.isPublished) {
      toast({
        title: "Új kurzus elérhető!",
        description: `${data.title} - Most már beiratkozhatsz!`,
      });
    } else if (action === 'update' && data?.isPublished) {
      toast({
        title: "Kurzus frissítve",
        description: `${data.title} tartalma frissült.`,
      });
    }
  };

  const handleEnrollmentUpdate = (message: SyncMessage) => {
    const { action, data, userId } = message;
    
    // Only handle if it's for the current user or if current user is admin
    if (userId === user?.id || user?.isAdmin) {
      queryClient.invalidateQueries({ queryKey: ['/api/enrollments'] });
      
      if (data?.courseId) {
        queryClient.invalidateQueries({ queryKey: ['/api/courses', data.courseId.toString()] });
      }

      // Show notification for user's own enrollments
      if (userId === user?.id) {
        if (action === 'create') {
          toast({
            title: "Sikeres beiratkozás!",
            description: "Elkezdheted a tanulást.",
          });
        } else if (action === 'update' && data?.status === 'completed') {
          toast({
            title: "Gratulálunk!",
            description: "Sikeresen befejezted a kurzust!",
          });
        }
      }
    }
  };

  const handleLessonUpdate = (message: SyncMessage) => {
    const { action, data } = message;
    
    // Invalidate lesson-related queries
    queryClient.invalidateQueries({ queryKey: ['/api/lessons'] });
    
    if (data?.moduleId) {
      queryClient.invalidateQueries({ queryKey: ['/api/modules', data.moduleId.toString()] });
    }

    // Admin-specific notifications
    if (user?.isAdmin && action === 'create') {
      toast({
        title: "Új lecke hozzáadva",
        description: `${data?.title || 'Ismeretlen lecke'} létrehozva.`,
      });
    }
  };

  // Manual sync trigger for critical operations
  const triggerSync = (type: 'courses' | 'enrollments' | 'all') => {
    switch (type) {
      case 'courses':
        queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
        break;
      case 'enrollments':
        queryClient.invalidateQueries({ queryKey: ['/api/enrollments'] });
        break;
      case 'all':
        queryClient.invalidateQueries();
        break;
    }
  };

  return {
    isConnected,
    connectionStats,
    triggerSync
  };
}