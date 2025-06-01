import { db } from './db';
import { sql } from 'drizzle-orm';

// Migration tracking table
export async function createMigrationsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT NOW(),
      checksum VARCHAR(64)
    )
  `);
}

// Migration interface
interface Migration {
  name: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
  checksum?: string;
}

// Database migrations
const migrations: Migration[] = [
  {
    name: '001_add_indexes_for_performance',
    up: async () => {
      // User table indexes
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status)`);

      // Course table indexes
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_courses_university_id ON courses(university_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_courses_is_free ON courses(is_free)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_courses_price ON courses(price)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at)`);

      // Enrollment table indexes
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_enrollments_enrolled_at ON enrollments(enrolled_at)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_enrollments_progress ON enrollments(progress)`);

      // Composite indexes for common queries
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_enrollments_user_status ON enrollments(user_id, status)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_courses_published_category ON courses(is_published, category) WHERE is_published = 1`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_courses_published_free ON courses(is_published, is_free) WHERE is_published = 1`);

      console.log('[MIGRATION] Performance indexes created successfully');
    },
    down: async () => {
      // Drop indexes in reverse order
      await db.execute(sql`DROP INDEX IF EXISTS idx_courses_published_free`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_courses_published_category`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_enrollments_user_status`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_enrollments_progress`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_enrollments_enrolled_at`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_enrollments_status`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_enrollments_course_id`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_enrollments_user_id`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_courses_created_at`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_courses_price`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_courses_rating`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_courses_is_free`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_courses_is_published`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_courses_level`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_courses_category`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_courses_university_id`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_users_subscription_status`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_users_created_at`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_users_role`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_users_phone`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_users_email`);
    }
  },
  {
    name: '002_add_database_constraints',
    up: async () => {
      // User constraints
      await db.execute(sql`
        ALTER TABLE users 
        ADD CONSTRAINT chk_users_email_format 
        CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
      `);

      await db.execute(sql`
        ALTER TABLE users 
        ADD CONSTRAINT chk_users_phone_format 
        CHECK (phone IS NULL OR phone ~* '^(\+36|06)?[1-9][0-9]{7,8}$')
      `);

      await db.execute(sql`
        ALTER TABLE users 
        ADD CONSTRAINT chk_users_role_valid 
        CHECK (role IN ('student', 'instructor', 'admin', 'super_admin'))
      `);

      // Course constraints
      await db.execute(sql`
        ALTER TABLE courses 
        ADD CONSTRAINT chk_courses_price_positive 
        CHECK (price >= 0)
      `);

      await db.execute(sql`
        ALTER TABLE courses 
        ADD CONSTRAINT chk_courses_rating_valid 
        CHECK (rating >= 0 AND rating <= 500)
      `);

      await db.execute(sql`
        ALTER TABLE courses 
        ADD CONSTRAINT chk_courses_level_valid 
        CHECK (level IN ('beginner', 'intermediate', 'advanced'))
      `);

      // Enrollment constraints
      await db.execute(sql`
        ALTER TABLE enrollments 
        ADD CONSTRAINT chk_enrollments_progress_valid 
        CHECK (progress >= 0 AND progress <= 100)
      `);

      await db.execute(sql`
        ALTER TABLE enrollments 
        ADD CONSTRAINT chk_enrollments_status_valid 
        CHECK (status IN ('active', 'completed', 'dropped', 'suspended'))
      `);

      console.log('[MIGRATION] Database constraints added successfully');
    },
    down: async () => {
      await db.execute(sql`ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS chk_enrollments_status_valid`);
      await db.execute(sql`ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS chk_enrollments_progress_valid`);
      await db.execute(sql`ALTER TABLE courses DROP CONSTRAINT IF EXISTS chk_courses_level_valid`);
      await db.execute(sql`ALTER TABLE courses DROP CONSTRAINT IF EXISTS chk_courses_rating_valid`);
      await db.execute(sql`ALTER TABLE courses DROP CONSTRAINT IF EXISTS chk_courses_price_positive`);
      await db.execute(sql`ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_users_role_valid`);
      await db.execute(sql`ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_users_phone_format`);
      await db.execute(sql`ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_users_email_format`);
    }
  },
  {
    name: '003_add_full_text_search',
    up: async () => {
      // Add full-text search indexes for courses
      await db.execute(sql`
        ALTER TABLE courses 
        ADD COLUMN IF NOT EXISTS search_vector tsvector
      `);

      await db.execute(sql`
        UPDATE courses 
        SET search_vector = to_tsvector('hungarian', 
          coalesce(title, '') || ' ' || 
          coalesce(description, '') || ' ' || 
          coalesce(short_description, '') || ' ' ||
          coalesce(instructor_name, '')
        )
      `);

      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS idx_courses_search_vector 
        ON courses USING gin(search_vector)
      `);

      // Create trigger to automatically update search vector
      await db.execute(sql`
        CREATE OR REPLACE FUNCTION update_course_search_vector()
        RETURNS trigger AS $$
        BEGIN
          NEW.search_vector := to_tsvector('hungarian', 
            coalesce(NEW.title, '') || ' ' || 
            coalesce(NEW.description, '') || ' ' || 
            coalesce(NEW.short_description, '') || ' ' ||
            coalesce(NEW.instructor_name, '')
          );
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);

      await db.execute(sql`
        CREATE TRIGGER trigger_update_course_search_vector
        BEFORE INSERT OR UPDATE ON courses
        FOR EACH ROW EXECUTE FUNCTION update_course_search_vector();
      `);

      console.log('[MIGRATION] Full-text search capabilities added');
    },
    down: async () => {
      await db.execute(sql`DROP TRIGGER IF EXISTS trigger_update_course_search_vector ON courses`);
      await db.execute(sql`DROP FUNCTION IF EXISTS update_course_search_vector()`);
      await db.execute(sql`DROP INDEX IF EXISTS idx_courses_search_vector`);
      await db.execute(sql`ALTER TABLE courses DROP COLUMN IF EXISTS search_vector`);
    }
  }
];

// Migration runner
export class MigrationRunner {
  async runMigrations(): Promise<{ success: boolean; message: string }> {
    try {
      await createMigrationsTable();

      // Get executed migrations
      const executedMigrations = await db.execute(sql`
        SELECT name FROM migrations ORDER BY executed_at
      `);
      
      const executedNames = new Set(executedMigrations.rows.map((row: any) => row.name));

      // Run pending migrations
      const pendingMigrations = migrations.filter(m => !executedNames.has(m.name));
      
      if (pendingMigrations.length === 0) {
        return { success: true, message: 'No pending migrations' };
      }

      console.log(`[MIGRATION] Running ${pendingMigrations.length} pending migrations...`);

      for (const migration of pendingMigrations) {
        console.log(`[MIGRATION] Executing: ${migration.name}`);
        
        try {
          await migration.up();
          
          // Record successful migration
          await db.execute(sql`
            INSERT INTO migrations (name, executed_at) 
            VALUES (${migration.name}, NOW())
          `);
          
          console.log(`[MIGRATION] ✓ ${migration.name} completed`);
        } catch (error) {
          console.error(`[MIGRATION] ✗ ${migration.name} failed:`, error);
          throw error;
        }
      }

      return { 
        success: true, 
        message: `Successfully executed ${pendingMigrations.length} migrations` 
      };
    } catch (error) {
      console.error('[MIGRATION] Migration process failed:', error);
      return { 
        success: false, 
        message: `Migration failed: ${error.message}` 
      };
    }
  }

  async rollbackMigration(migrationName: string): Promise<{ success: boolean; message: string }> {
    try {
      const migration = migrations.find(m => m.name === migrationName);
      if (!migration) {
        return { success: false, message: 'Migration not found' };
      }

      console.log(`[MIGRATION] Rolling back: ${migration.name}`);
      await migration.down();

      // Remove from migrations table
      await db.execute(sql`
        DELETE FROM migrations WHERE name = ${migration.name}
      `);

      console.log(`[MIGRATION] ✓ Rollback completed: ${migration.name}`);
      return { success: true, message: `Successfully rolled back ${migration.name}` };
    } catch (error) {
      console.error('[MIGRATION] Rollback failed:', error);
      return { success: false, message: `Rollback failed: ${error.message}` };
    }
  }

  async getMigrationStatus() {
    try {
      await createMigrationsTable();
      
      const executedMigrations = await db.execute(sql`
        SELECT name, executed_at FROM migrations ORDER BY executed_at
      `);
      
      const executedNames = new Set(executedMigrations.rows.map((row: any) => row.name));
      
      const status = migrations.map(migration => ({
        name: migration.name,
        executed: executedNames.has(migration.name),
        executedAt: executedMigrations.rows.find((row: any) => row.name === migration.name)?.executed_at
      }));

      return { success: true, migrations: status };
    } catch (error) {
      console.error('[MIGRATION] Failed to get migration status:', error);
      return { success: false, message: error.message };
    }
  }
}

export const migrationRunner = new MigrationRunner();