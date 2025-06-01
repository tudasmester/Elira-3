import React from 'react';
import { BaseActivityClass } from '../activity-factory';
import { WorkshopActivity as WorkshopActivityType, WorkshopSettings } from '@shared/activity-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Clock } from 'lucide-react';

export class WorkshopActivity extends BaseActivityClass {
  data: WorkshopActivityType;

  constructor(data: WorkshopActivityType) {
    super(data);
    this.data = data;
  }

  render(): React.ReactElement {
    return <WorkshopRenderer activity={this} />;
  }

  protected validateSpecific(): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const settings = this.data.settings as WorkshopSettings;

    if (!settings.phases || settings.phases.length === 0) {
      errors.push("Workshop must have defined phases");
    }

    if (settings.maxSubmissionSize && settings.maxSubmissionSize <= 0) {
      warnings.push("Maximum submission size should be positive");
    }

    return { errors, warnings };
  }

  calculateGrade(submission: any): number {
    // Workshop grading combines submission and peer assessment scores
    return 0;
  }
}

interface WorkshopRendererProps {
  activity: WorkshopActivity;
}

const WorkshopRenderer: React.FC<WorkshopRendererProps> = ({ activity }) => {
  const settings = activity.data.settings as WorkshopSettings;

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'setup': return 'secondary';
      case 'submission': return 'default';
      case 'assessment': return 'destructive';
      case 'grading': return 'outline';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {activity.data.title}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {activity.data.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={getPhaseColor(settings.currentPhase)}>
              Current Phase: {settings.currentPhase}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {settings.phases.map((phase, index) => (
                <div key={index} className="text-center">
                  <Badge 
                    variant={phase === settings.currentPhase ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {phase}
                  </Badge>
                </div>
              ))}
            </div>
            
            {settings.currentPhase === 'submission' && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Submit Your Work</h3>
                <Button>Upload Submission</Button>
              </div>
            )}

            {settings.currentPhase === 'assessment' && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Peer Assessment</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Review and assess your peers' submissions
                </p>
                <Button>Start Assessment</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};