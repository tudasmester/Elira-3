// Activity Factory - Plugin-like architecture for activity management
import { BaseActivity, ActivityType, IActivity, ValidationResult, ActivityExportData } from "@shared/activity-types";
import { QuizActivity } from "./activities/QuizActivity";
import { AssignmentActivity } from "./activities/AssignmentActivity";
import { ForumActivity } from "./activities/ForumActivity";
import { WorkshopActivity } from "./activities/WorkshopActivity";
import { ResourceActivity } from "./activities/ResourceActivity";
import { SCORMActivity } from "./activities/SCORMActivity";

// Activity registry for dynamic activity management
export class ActivityRegistry {
  private static activities = new Map<ActivityType, new (data: BaseActivity) => IActivity>();

  static register(type: ActivityType, activityClass: new (data: BaseActivity) => IActivity) {
    this.activities.set(type, activityClass);
  }

  static create(data: BaseActivity): IActivity {
    const ActivityClass = this.activities.get(data.type);
    if (!ActivityClass) {
      throw new Error(`Activity type "${data.type}" is not registered`);
    }
    return new ActivityClass(data);
  }

  static getRegisteredTypes(): ActivityType[] {
    return Array.from(this.activities.keys());
  }

  static isRegistered(type: ActivityType): boolean {
    return this.activities.has(type);
  }
}

// Base Activity class with common functionality
export abstract class BaseActivityClass implements IActivity {
  constructor(public data: BaseActivity) {}

  abstract render(): React.ReactElement;

  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Common validation rules
    if (!this.data.title || this.data.title.trim().length === 0) {
      errors.push("Activity title is required");
    }

    if (this.data.title && this.data.title.length > 255) {
      errors.push("Activity title must be less than 255 characters");
    }

    if (this.data.weight < 0 || this.data.weight > 100) {
      errors.push("Activity weight must be between 0 and 100");
    }

    if (this.data.maxGrade < 0) {
      errors.push("Maximum grade must be a positive number");
    }

    if (this.data.dueDate && this.data.dueDate <= new Date()) {
      warnings.push("Due date is in the past");
    }

    // Call activity-specific validation
    const specificValidation = this.validateSpecific();
    errors.push(...specificValidation.errors);
    warnings.push(...specificValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Abstract method for activity-specific validation
  protected abstract validateSpecific(): { errors: string[]; warnings: string[] };

  abstract calculateGrade(submission: any): number;

  exportData(): ActivityExportData {
    return {
      activityData: this.data,
      submissions: [], // To be populated by specific implementations
      grades: [], // To be populated by specific implementations
      analytics: {} // To be populated by specific implementations
    };
  }

  async checkCompletion(userId: string): Promise<boolean> {
    const tracking = this.data.completionTracking;
    if (!tracking.enabled) return true;

    // Implement completion checking logic based on tracking requirements
    // This would typically involve API calls to check user progress
    return false; // Default to incomplete
  }

  async trackProgress(userId: string, progressData: any): Promise<void> {
    // Implement progress tracking
    // This would typically involve API calls to save progress data
  }
}

// Activity Factory
export class ActivityFactory {
  static create(data: BaseActivity): IActivity {
    return ActivityRegistry.create(data);
  }

  static createFromType(type: ActivityType, baseData: Partial<BaseActivity>): IActivity {
    const defaultData: BaseActivity = {
      id: crypto.randomUUID(),
      type,
      title: '',
      description: '',
      courseId: 0,
      weight: 0,
      maxGrade: 100,
      visibility: 'visible',
      completionTracking: {
        enabled: false,
        requireView: false,
        requireGrade: false,
        requireSubmission: false
      },
      settings: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      ...baseData
    };

    return this.create(defaultData);
  }

  static getAvailableTypes(): ActivityType[] {
    return ActivityRegistry.getRegisteredTypes();
  }

  static getActivityMetadata(type: ActivityType) {
    const metadata = {
      quiz: {
        name: 'Quiz',
        description: 'Create interactive quizzes with multiple question types',
        icon: 'HelpCircle',
        category: 'Assessment'
      },
      assignment: {
        name: 'Assignment',
        description: 'File upload and text submission assignments',
        icon: 'FileText',
        category: 'Assessment'
      },
      forum: {
        name: 'Forum',
        description: 'Discussion forums for peer interaction',
        icon: 'MessageSquare',
        category: 'Communication'
      },
      workshop: {
        name: 'Workshop',
        description: 'Peer assessment and collaborative activities',
        icon: 'Users',
        category: 'Collaboration'
      },
      resource: {
        name: 'Resource',
        description: 'Files, links, and learning materials',
        icon: 'FolderOpen',
        category: 'Content'
      },
      scorm: {
        name: 'SCORM Package',
        description: 'External learning content packages',
        icon: 'Package',
        category: 'Content'
      }
    };

    return metadata[type];
  }
}

// Initialize the registry with default activities
ActivityRegistry.register('quiz', QuizActivity);
ActivityRegistry.register('assignment', AssignmentActivity);
ActivityRegistry.register('forum', ForumActivity);
ActivityRegistry.register('workshop', WorkshopActivity);
ActivityRegistry.register('resource', ResourceActivity);
ActivityRegistry.register('scorm', SCORMActivity);

export { ActivityRegistry, ActivityFactory };