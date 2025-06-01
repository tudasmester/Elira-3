import React, { useState } from 'react';
import { ActivityFactory, ActivityRegistry } from '@/lib/activity-factory';
import { ActivityType, BaseActivity } from '@shared/activity-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Settings, 
  Eye, 
  Trash2, 
  HelpCircle, 
  FileText, 
  MessageSquare, 
  Users, 
  FolderOpen, 
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ActivityManagerProps {
  courseId: number;
  moduleId?: number;
}

export const ActivityManager: React.FC<ActivityManagerProps> = ({ courseId, moduleId }) => {
  const [activities, setActivities] = useState<BaseActivity[]>([]);
  const [selectedType, setSelectedType] = useState<ActivityType>('quiz');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [previewActivity, setPreviewActivity] = useState<BaseActivity | null>(null);

  // Create sample activities for demonstration
  React.useEffect(() => {
    const sampleActivities: BaseActivity[] = [
      {
        id: '1',
        type: 'quiz',
        title: 'JavaScript Basics Quiz',
        description: 'Test your knowledge of JavaScript fundamentals',
        courseId,
        moduleId,
        weight: 20,
        maxGrade: 100,
        visibility: 'visible',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        completionTracking: {
          enabled: true,
          requireView: true,
          requireGrade: true,
          requireSubmission: true
        },
        settings: {
          timeLimit: 60,
          attempts: 3,
          shuffleQuestions: true,
          shuffleAnswers: true,
          showCorrectAnswers: 'after_submission',
          gradeMethod: 'highest',
          questions: [
            {
              id: 'q1',
              type: 'multiple_choice',
              text: 'What is the correct way to declare a variable in JavaScript?',
              points: 10,
              options: [
                { id: 'a', text: 'var x = 5;', isCorrect: true },
                { id: 'b', text: 'variable x = 5;', isCorrect: false },
                { id: 'c', text: 'v x = 5;', isCorrect: false }
              ],
              correctAnswer: 'a'
            }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        type: 'assignment',
        title: 'React Component Project',
        description: 'Build a React component with state management',
        courseId,
        moduleId,
        weight: 30,
        maxGrade: 100,
        visibility: 'visible',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        completionTracking: {
          enabled: true,
          requireView: false,
          requireGrade: true,
          requireSubmission: true
        },
        settings: {
          submissionTypes: ['file', 'text'],
          allowedFileTypes: ['.js', '.jsx', '.zip'],
          maxFileSize: 10,
          maxFiles: 3,
          wordLimit: 500,
          requireSubmissionStatement: true,
          teamSubmission: false,
          blindMarking: false,
          gradingWorkflow: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    setActivities(sampleActivities);
  }, [courseId, moduleId]);

  const getActivityIcon = (type: ActivityType) => {
    const iconMap = {
      quiz: HelpCircle,
      assignment: FileText,
      forum: MessageSquare,
      workshop: Users,
      resource: FolderOpen,
      scorm: Package
    };
    const Icon = iconMap[type];
    return <Icon className="h-4 w-4" />;
  };

  const getActivityBadgeColor = (type: ActivityType) => {
    const colorMap = {
      quiz: 'default',
      assignment: 'secondary',
      forum: 'destructive',
      workshop: 'outline',
      resource: 'secondary',
      scorm: 'default'
    } as const;
    return colorMap[type];
  };

  const handleCreateActivity = (formData: any) => {
    const newActivity: BaseActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedType,
      title: formData.title,
      description: formData.description,
      courseId,
      moduleId,
      weight: Number(formData.weight),
      maxGrade: Number(formData.maxGrade),
      visibility: formData.visibility,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      completionTracking: {
        enabled: formData.completionEnabled,
        requireView: formData.requireView,
        requireGrade: formData.requireGrade,
        requireSubmission: formData.requireSubmission
      },
      settings: getDefaultSettings(selectedType),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setActivities(prev => [...prev, newActivity]);
    setIsCreateDialogOpen(false);
  };

  const getDefaultSettings = (type: ActivityType) => {
    switch (type) {
      case 'quiz':
        return {
          timeLimit: 60,
          attempts: 1,
          shuffleQuestions: false,
          shuffleAnswers: false,
          showCorrectAnswers: 'after_submission',
          gradeMethod: 'highest',
          questions: []
        };
      case 'assignment':
        return {
          submissionTypes: ['file'],
          allowedFileTypes: ['.pdf', '.doc', '.docx'],
          maxFileSize: 5,
          maxFiles: 1,
          requireSubmissionStatement: false,
          teamSubmission: false,
          blindMarking: false,
          gradingWorkflow: false
        };
      case 'forum':
        return {
          forumType: 'general',
          allowDiscussions: true,
          maxAttachments: 1,
          maxAttachmentSize: 5,
          subscriptionMode: 'optional',
          trackingType: 'optional'
        };
      case 'workshop':
        return {
          phases: ['setup', 'submission', 'assessment', 'grading', 'closed'],
          currentPhase: 'setup',
          submissionTypes: ['file'],
          maxSubmissionSize: 10,
          assessmentInstructions: '',
          examplesMode: 'none',
          gradeStrategy: 'accumulative'
        };
      case 'resource':
        return {
          resourceType: 'file',
          displayOptions: {
            showName: true,
            showDescription: true,
            showSize: true,
            showType: true,
            showDate: true
          }
        };
      case 'scorm':
        return {
          packageId: '',
          packageVersion: '1.2',
          launchUrl: '',
          width: 800,
          height: 600,
          windowOptions: ['resizable=yes', 'scrollbars=yes'],
          skipViewPage: false,
          hideBrowse: false,
          displayCourseStructure: true,
          gradeMethod: 'highest',
          maxAttempts: 1
        };
      default:
        return {};
    }
  };

  const handlePreview = (activity: BaseActivity) => {
    setPreviewActivity(activity);
  };

  const handleValidation = (activity: BaseActivity) => {
    const activityInstance = ActivityFactory.create(activity);
    const validation = activityInstance.validate();
    
    alert(`Validation Result:\n${validation.isValid ? 'Valid' : 'Invalid'}\n\nErrors:\n${validation.errors.join('\n')}\n\nWarnings:\n${validation.warnings.join('\n')}`);
  };

  const availableTypes = ActivityRegistry.getRegisteredTypes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Aktivitáskezelő</h2>
          <p className="text-gray-600">Moduláris tevékenységek kezelése Moodle-inspirált architektúrával</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Új aktivitás
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Új aktivitás létrehozása</DialogTitle>
            </DialogHeader>
            <CreateActivityForm
              availableTypes={availableTypes}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              onSubmit={handleCreateActivity}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Activity Registry Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Regisztrált aktivitástípusok</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableTypes.map(type => {
              const metadata = ActivityFactory.getActivityMetadata(type);
              return (
                <div key={type} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getActivityIcon(type)}
                  <div>
                    <div className="font-medium">{metadata.name}</div>
                    <div className="text-xs text-gray-500">{metadata.category}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitások ({activities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getActivityIcon(activity.type)}
                  <div>
                    <div className="font-medium">{activity.title}</div>
                    <div className="text-sm text-gray-600">{activity.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getActivityBadgeColor(activity.type)}>
                        {activity.type}
                      </Badge>
                      <Badge variant="outline">
                        {activity.weight}% súly
                      </Badge>
                      {activity.completionTracking.enabled && (
                        <Badge variant="secondary">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Követett
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleValidation(activity)}
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(activity)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      {previewActivity && (
        <Dialog open={!!previewActivity} onOpenChange={() => setPreviewActivity(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Aktivitás előnézet: {previewActivity.title}</DialogTitle>
            </DialogHeader>
            <ActivityPreview activity={previewActivity} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface CreateActivityFormProps {
  availableTypes: ActivityType[];
  selectedType: ActivityType;
  onTypeChange: (type: ActivityType) => void;
  onSubmit: (formData: any) => void;
}

const CreateActivityForm: React.FC<CreateActivityFormProps> = ({
  availableTypes,
  selectedType,
  onTypeChange,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    weight: 10,
    maxGrade: 100,
    visibility: 'visible',
    dueDate: '',
    completionEnabled: true,
    requireView: false,
    requireGrade: true,
    requireSubmission: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Alapbeállítások</TabsTrigger>
          <TabsTrigger value="completion">Teljesítés követése</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="type">Aktivitás típusa</Label>
            <Select value={selectedType} onValueChange={(value: ActivityType) => onTypeChange(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map(type => {
                  const metadata = ActivityFactory.getActivityMetadata(type);
                  return (
                    <SelectItem key={type} value={type}>
                      {metadata.name} - {metadata.description}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Cím</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Leírás</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Súly (%)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                max="100"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="maxGrade">Maximális pontszám</Label>
              <Input
                id="maxGrade"
                type="number"
                min="0"
                value={formData.maxGrade}
                onChange={(e) => setFormData(prev => ({ ...prev, maxGrade: Number(e.target.value) }))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completion" className="space-y-4">
          <div className="space-y-3">
            <Label>Teljesítés követése</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.completionEnabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, completionEnabled: e.target.checked }))}
                />
                <span className="text-sm">Teljesítés követése engedélyezve</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.requireView}
                  onChange={(e) => setFormData(prev => ({ ...prev, requireView: e.target.checked }))}
                />
                <span className="text-sm">Megtekintés szükséges</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.requireGrade}
                  onChange={(e) => setFormData(prev => ({ ...prev, requireGrade: e.target.checked }))}
                />
                <span className="text-sm">Értékelés szükséges</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.requireSubmission}
                  onChange={(e) => setFormData(prev => ({ ...prev, requireSubmission: e.target.checked }))}
                />
                <span className="text-sm">Beadás szükséges</span>
              </label>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">Mégse</Button>
        <Button type="submit">Aktivitás létrehozása</Button>
      </div>
    </form>
  );
};

interface ActivityPreviewProps {
  activity: BaseActivity;
}

const ActivityPreview: React.FC<ActivityPreviewProps> = ({ activity }) => {
  const activityInstance = ActivityFactory.create(activity);
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Előnézeti mód:</strong> Ez az aktivitás megjelenítésének előnézete. 
          A valós környezetben a teljes funkcionalitás elérhető lesz.
        </p>
      </div>
      
      {activityInstance.render()}
    </div>
  );
};