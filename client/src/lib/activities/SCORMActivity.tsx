import React from 'react';
import { BaseActivityClass } from '../activity-factory';
import { SCORMActivity as SCORMActivityType, SCORMSettings } from '@shared/activity-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Play, RotateCcw } from 'lucide-react';

export class SCORMActivity extends BaseActivityClass {
  data: SCORMActivityType;

  constructor(data: SCORMActivityType) {
    super(data);
    this.data = data;
  }

  render(): React.ReactElement {
    return <SCORMRenderer activity={this} />;
  }

  protected validateSpecific(): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const settings = this.data.settings as SCORMSettings;

    if (!settings.packageId) {
      errors.push("SCORM package ID is required");
    }

    if (!settings.launchUrl) {
      errors.push("Launch URL is required");
    }

    if (settings.width <= 0 || settings.height <= 0) {
      warnings.push("Width and height should be positive values");
    }

    return { errors, warnings };
  }

  calculateGrade(submission: any): number {
    // SCORM packages typically report their own scores
    return submission?.score || 0;
  }
}

interface SCORMRendererProps {
  activity: SCORMActivity;
}

const SCORMRenderer: React.FC<SCORMRendererProps> = ({ activity }) => {
  const [isLaunched, setIsLaunched] = React.useState(false);
  const settings = activity.data.settings as SCORMSettings;

  const launchSCORM = () => {
    setIsLaunched(true);
    
    const windowFeatures = [
      `width=${settings.width}`,
      `height=${settings.height}`,
      ...settings.windowOptions
    ].join(',');

    window.open(settings.launchUrl, '_blank', windowFeatures);
  };

  const resetAttempt = () => {
    setIsLaunched(false);
    console.log('SCORM attempt reset');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {activity.data.title}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {activity.data.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">SCORM Package</h3>
              <p className="text-sm text-gray-600">
                Version: {settings.packageVersion}
              </p>
              <p className="text-sm text-gray-600">
                Max attempts: {settings.maxAttempts}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={launchSCORM}>
                <Play className="h-4 w-4 mr-2" />
                {isLaunched ? 'Launch Again' : 'Launch Content'}
              </Button>
              {isLaunched && (
                <Button variant="outline" onClick={resetAttempt}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {settings.displayCourseStructure && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Course Structure</h4>
              <p className="text-sm text-gray-600">
                Course structure would be displayed here based on the SCORM manifest
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};