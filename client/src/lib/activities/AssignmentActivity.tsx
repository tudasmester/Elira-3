import React from 'react';
import { BaseActivityClass } from '../activity-factory';
import { AssignmentActivity as AssignmentActivityType, AssignmentSettings } from '@shared/activity-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload, Clock } from 'lucide-react';

export class AssignmentActivity extends BaseActivityClass {
  data: AssignmentActivityType;

  constructor(data: AssignmentActivityType) {
    super(data);
    this.data = data;
  }

  render(): React.ReactElement {
    return <AssignmentRenderer activity={this} />;
  }

  protected validateSpecific(): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const settings = this.data.settings as AssignmentSettings;

    if (!settings.submissionTypes || settings.submissionTypes.length === 0) {
      errors.push("Assignment must have at least one submission type");
    }

    if (settings.maxFileSize && settings.maxFileSize <= 0) {
      warnings.push("Maximum file size should be positive");
    }

    return { errors, warnings };
  }

  calculateGrade(submission: any): number {
    // Assignment grading typically requires manual review
    return 0;
  }
}

interface AssignmentRendererProps {
  activity: AssignmentActivity;
}

const AssignmentRenderer: React.FC<AssignmentRendererProps> = ({ activity }) => {
  const [textSubmission, setTextSubmission] = React.useState('');
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const settings = activity.data.settings as AssignmentSettings;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleSubmit = () => {
    const submission = {
      textContent: textSubmission,
      files: selectedFiles,
      submittedAt: new Date()
    };
    console.log('Assignment submitted:', submission);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {activity.data.title}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {activity.data.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {settings.submissionTypes.includes('text') && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Text Submission
              </label>
              <Textarea
                value={textSubmission}
                onChange={(e) => setTextSubmission(e.target.value)}
                placeholder="Enter your assignment text..."
                className="min-h-32"
              />
              {settings.wordLimit && (
                <p className="text-xs text-gray-500 mt-1">
                  Word limit: {settings.wordLimit} words
                </p>
              )}
            </div>
          )}

          {settings.submissionTypes.includes('file') && (
            <div>
              <label className="block text-sm font-medium mb-2">
                File Upload
              </label>
              <Input
                type="file"
                multiple={settings.maxFiles > 1}
                accept={settings.allowedFileTypes.join(',')}
                onChange={handleFileSelect}
              />
              <p className="text-xs text-gray-500 mt-1">
                Max {settings.maxFiles} files, {settings.maxFileSize}MB each
              </p>
            </div>
          )}

          <Button onClick={handleSubmit} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Submit Assignment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};