import { db } from './db';
import { sql } from 'drizzle-orm';
import { DatabaseLogger } from './database-manager';

// Backup configuration
interface BackupConfig {
  type: 'full' | 'incremental' | 'schema-only';
  compression: boolean;
  includeData: boolean;
  excludeTables?: string[];
}

export class BackupManager {
  private backupHistory: Array<{
    id: string;
    timestamp: Date;
    type: string;
    size?: number;
    status: 'success' | 'failed' | 'in-progress';
    message?: string;
  }> = [];

  // Create backup metadata tracking table
  async initializeBackupTracking() {
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS backup_history (
          id SERIAL PRIMARY KEY,
          backup_name VARCHAR(255) NOT NULL,
          backup_type VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          size_bytes BIGINT,
          status VARCHAR(20) DEFAULT 'completed',
          file_path TEXT,
          checksum VARCHAR(64),
          metadata JSONB
        )
      `);
      
      console.log('[BACKUP] Backup tracking table initialized');
    } catch (error) {
      DatabaseLogger.logError(error as Error, 'initializeBackupTracking');
      throw error;
    }
  }

  // Create database backup (schema and data export)
  async createFullBackup(config: BackupConfig = { 
    type: 'full', 
    compression: true, 
    includeData: true 
  }): Promise<{ success: boolean; backupId?: string; message: string }> {
    const backupId = `backup_${Date.now()}`;
    const timestamp = new Date();

    try {
      DatabaseLogger.logTransaction('BACKUP_START', ['all'], true);
      
      // Record backup start
      this.backupHistory.push({
        id: backupId,
        timestamp,
        type: config.type,
        status: 'in-progress'
      });

      // Export schema structure
      const schemaInfo = await this.exportSchema();
      
      // Export table data if requested
      let tableData = {};
      if (config.includeData) {
        tableData = await this.exportTableData(config.excludeTables);
      }

      // Create backup metadata
      const backupMetadata = {
        id: backupId,
        timestamp,
        config,
        schema: schemaInfo,
        data: tableData,
        database_version: await this.getDatabaseVersion()
      };

      // In production, this would write to file system or cloud storage
      // For now, we'll store metadata in database
      await db.execute(sql`
        INSERT INTO backup_history (backup_name, backup_type, size_bytes, metadata)
        VALUES (${backupId}, ${config.type}, ${JSON.stringify(backupMetadata).length}, ${JSON.stringify(backupMetadata)})
      `);

      // Update backup history
      const backupRecord = this.backupHistory.find(b => b.id === backupId);
      if (backupRecord) {
        backupRecord.status = 'success';
        backupRecord.size = JSON.stringify(backupMetadata).length;
      }

      DatabaseLogger.logTransaction('BACKUP_COMPLETE', ['all'], true);
      
      return {
        success: true,
        backupId,
        message: `Backup ${backupId} created successfully`
      };

    } catch (error) {
      // Update backup history with failure
      const backupRecord = this.backupHistory.find(b => b.id === backupId);
      if (backupRecord) {
        backupRecord.status = 'failed';
        backupRecord.message = (error as Error).message;
      }

      DatabaseLogger.logError(error as Error, 'createFullBackup');
      
      return {
        success: false,
        message: `Backup failed: ${(error as Error).message}`
      };
    }
  }

  // Export database schema
  private async exportSchema() {
    try {
      const tables = await db.execute(sql`
        SELECT table_name, column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position
      `);

      const indexes = await db.execute(sql`
        SELECT schemaname, tablename, indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public'
      `);

      const constraints = await db.execute(sql`
        SELECT conname, contype, confrelid, conrelid, confkey, conkey
        FROM pg_constraint
        WHERE connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      `);

      return {
        tables: tables.rows,
        indexes: indexes.rows,
        constraints: constraints.rows
      };
    } catch (error) {
      DatabaseLogger.logError(error as Error, 'exportSchema');
      throw error;
    }
  }

  // Export table data
  private async exportTableData(excludeTables: string[] = []) {
    try {
      const tableNames = await db.execute(sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      `);

      const data: Record<string, any[]> = {};

      for (const table of tableNames.rows) {
        const tableName = (table as any).table_name;
        
        if (excludeTables.includes(tableName)) {
          continue;
        }

        // Export table data (limit for safety)
        const tableData = await db.execute(sql.raw(`SELECT * FROM ${tableName} LIMIT 10000`));
        data[tableName] = tableData.rows;
      }

      return data;
    } catch (error) {
      DatabaseLogger.logError(error as Error, 'exportTableData');
      throw error;
    }
  }

  // Get database version info
  private async getDatabaseVersion() {
    try {
      const version = await db.execute(sql`SELECT version()`);
      return version.rows[0];
    } catch (error) {
      return 'Unknown';
    }
  }

  // List available backups
  async listBackups(): Promise<{ success: boolean; backups?: any[]; message?: string }> {
    try {
      const backups = await db.execute(sql`
        SELECT backup_name, backup_type, created_at, size_bytes, status
        FROM backup_history
        ORDER BY created_at DESC
        LIMIT 50
      `);

      return {
        success: true,
        backups: backups.rows
      };
    } catch (error) {
      DatabaseLogger.logError(error as Error, 'listBackups');
      return {
        success: false,
        message: `Failed to list backups: ${(error as Error).message}`
      };
    }
  }

  // Recovery operations
  async initiateRecovery(backupId: string): Promise<{ success: boolean; message: string }> {
    try {
      const backup = await db.execute(sql`
        SELECT metadata FROM backup_history WHERE backup_name = ${backupId}
      `);

      if (backup.rows.length === 0) {
        return {
          success: false,
          message: 'Backup not found'
        };
      }

      // In production, this would restore from backup files
      // For now, we'll just validate the backup structure
      const metadata = (backup.rows[0] as any).metadata;
      
      if (!metadata.schema || !metadata.data) {
        return {
          success: false,
          message: 'Invalid backup structure'
        };
      }

      DatabaseLogger.logTransaction('RECOVERY_INITIATED', ['all'], true);

      return {
        success: true,
        message: `Recovery from backup ${backupId} would be initiated in production environment`
      };
    } catch (error) {
      DatabaseLogger.logError(error as Error, 'initiateRecovery');
      return {
        success: false,
        message: `Recovery failed: ${(error as Error).message}`
      };
    }
  }

  // Database health check with detailed metrics
  async performDetailedHealthCheck() {
    try {
      // Connection test
      const connectionTest = await db.execute(sql`SELECT 1 as connected`);
      
      // Database size
      const dbSize = await db.execute(sql`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `);

      // Table sizes
      const tableSizes = await db.execute(sql`
        SELECT 
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
          pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      `);

      // Active connections
      const connections = await db.execute(sql`
        SELECT count(*) as active_connections
        FROM pg_stat_activity
        WHERE state = 'active'
      `);

      // Slow queries (if pg_stat_statements is available)
      let slowQueries = [];
      try {
        slowQueries = await db.execute(sql`
          SELECT query, calls, total_time, mean_time
          FROM pg_stat_statements
          ORDER BY mean_time DESC
          LIMIT 10
        `);
      } catch {
        // pg_stat_statements not available
      }

      return {
        success: true,
        metrics: {
          connection: connectionTest.rows[0],
          database_size: dbSize.rows[0],
          table_sizes: tableSizes.rows,
          active_connections: connections.rows[0],
          slow_queries: slowQueries
        }
      };
    } catch (error) {
      DatabaseLogger.logError(error as Error, 'performDetailedHealthCheck');
      return {
        success: false,
        message: `Health check failed: ${(error as Error).message}`
      };
    }
  }

  // Cleanup old backups
  async cleanupOldBackups(retentionDays: number = 30): Promise<{ success: boolean; message: string }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const deleted = await db.execute(sql`
        DELETE FROM backup_history
        WHERE created_at < ${cutoffDate.toISOString()}
        RETURNING backup_name
      `);

      return {
        success: true,
        message: `Cleaned up ${deleted.rows.length} old backups`
      };
    } catch (error) {
      DatabaseLogger.logError(error as Error, 'cleanupOldBackups');
      return {
        success: false,
        message: `Cleanup failed: ${(error as Error).message}`
      };
    }
  }
}

export const backupManager = new BackupManager();