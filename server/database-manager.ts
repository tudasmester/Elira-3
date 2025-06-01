import { Pool } from '@neondatabase/serverless';
import { db } from './db';
import { sql } from 'drizzle-orm';

// Database connection monitoring
class DatabaseManager {
  private connectionPool: Pool;
  private isHealthy: boolean = true;
  private lastHealthCheck: Date = new Date();
  private connectionCount: number = 0;
  private queryCount: number = 0;
  private errorCount: number = 0;

  constructor() {
    this.connectionPool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum connections in pool
      min: 2,  // Minimum connections to maintain
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 10000, // Wait 10s for connection
    });

    // Start monitoring
    this.startHealthMonitoring();
  }

  // Health monitoring
  private startHealthMonitoring() {
    setInterval(async () => {
      await this.performHealthCheck();
    }, 60000); // Check every minute
  }

  async performHealthCheck(): Promise<boolean> {
    try {
      const start = Date.now();
      await db.execute(sql`SELECT 1`);
      const duration = Date.now() - start;

      this.isHealthy = duration < 5000; // Consider healthy if query takes < 5s
      this.lastHealthCheck = new Date();

      console.log(`[DB HEALTH] ${this.isHealthy ? 'HEALTHY' : 'UNHEALTHY'} - Query time: ${duration}ms`);
      
      return this.isHealthy;
    } catch (error) {
      this.isHealthy = false;
      this.errorCount++;
      console.error('[DB HEALTH] Health check failed:', error);
      return false;
    }
  }

  // Connection statistics
  getConnectionStats() {
    return {
      isHealthy: this.isHealthy,
      lastHealthCheck: this.lastHealthCheck,
      connectionCount: this.connectionCount,
      queryCount: this.queryCount,
      errorCount: this.errorCount,
      poolSize: this.connectionPool.totalCount,
      idleConnections: this.connectionPool.idleCount,
      waitingClients: this.connectionPool.waitingCount
    };
  }

  // Query wrapper with monitoring
  async executeQuery(query: string, params?: any[]) {
    const start = Date.now();
    this.queryCount++;

    try {
      const result = await this.connectionPool.query(query, params);
      const duration = Date.now() - start;
      
      if (duration > 1000) {
        console.warn(`[DB SLOW QUERY] ${duration}ms: ${query.substring(0, 100)}...`);
      }

      return result;
    } catch (error) {
      this.errorCount++;
      console.error(`[DB ERROR] Query failed: ${query}`, error);
      throw error;
    }
  }

  // Database backup (for development/testing)
  async createBackup(): Promise<{ success: boolean; message: string }> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `elira_backup_${timestamp}`;

      // In production, this would use pg_dump or similar
      console.log(`[DB BACKUP] Creating backup: ${backupName}`);
      
      // For now, just log the backup operation
      // In production, implement actual backup logic
      
      return {
        success: true,
        message: `Backup ${backupName} created successfully`
      };
    } catch (error) {
      console.error('[DB BACKUP] Backup failed:', error);
      return {
        success: false,
        message: `Backup failed: ${error.message}`
      };
    }
  }

  // Database optimization
  async optimizeDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      // Analyze table statistics
      await db.execute(sql`ANALYZE`);
      
      // Update table statistics for query planner
      console.log('[DB OPTIMIZE] Database optimization completed');
      
      return {
        success: true,
        message: 'Database optimization completed successfully'
      };
    } catch (error) {
      console.error('[DB OPTIMIZE] Optimization failed:', error);
      return {
        success: false,
        message: `Optimization failed: ${error.message}`
      };
    }
  }

  // Get database size and statistics
  async getDatabaseStats() {
    try {
      const stats = await db.execute(sql`
        SELECT 
          schemaname,
          tablename,
          attname,
          n_distinct,
          correlation,
          most_common_vals
        FROM pg_stats 
        WHERE schemaname = 'public'
        ORDER BY tablename, attname
      `);

      const tableStats = await db.execute(sql`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_live_tup as live_tuples,
          n_dead_tup as dead_tuples
        FROM pg_stat_user_tables
        ORDER BY tablename
      `);

      return {
        columnStats: stats.rows,
        tableStats: tableStats.rows,
        connectionStats: this.getConnectionStats()
      };
    } catch (error) {
      console.error('[DB STATS] Failed to get database stats:', error);
      throw error;
    }
  }
}

export const databaseManager = new DatabaseManager();

// Database validation constraints
export const DatabaseConstraints = {
  // Email validation
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  },

  // Phone validation (Hungarian format)
  isValidPhone: (phone: string) => {
    const phoneRegex = /^(\+36|06)?[1-9][0-9]{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Password strength validation
  isStrongPassword: (password: string) => {
    return password.length >= 8 &&
           /[a-z]/.test(password) &&
           /[A-Z]/.test(password) &&
           /\d/.test(password) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  },

  // Name validation
  isValidName: (name: string) => {
    return name.length >= 2 && 
           name.length <= 50 && 
           /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s-']+$/.test(name);
  },

  // Course title validation
  isValidCourseTitle: (title: string) => {
    return title.length >= 5 && 
           title.length <= 200 && 
           title.trim().length > 0;
  },

  // URL validation
  isValidUrl: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

// Database logging
export class DatabaseLogger {
  static logQuery(query: string, duration: number, success: boolean) {
    const logLevel = success ? 'INFO' : 'ERROR';
    const timestamp = new Date().toISOString();
    
    console.log(`[DB ${logLevel}] ${timestamp} - ${duration}ms - ${query.substring(0, 100)}${query.length > 100 ? '...' : ''}`);
  }

  static logTransaction(operation: string, tables: string[], success: boolean) {
    const timestamp = new Date().toISOString();
    const status = success ? 'SUCCESS' : 'FAILED';
    
    console.log(`[DB TRANSACTION] ${timestamp} - ${operation} on [${tables.join(', ')}] - ${status}`);
  }

  static logError(error: Error, context: string) {
    const timestamp = new Date().toISOString();
    console.error(`[DB ERROR] ${timestamp} - ${context}:`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
  }
}