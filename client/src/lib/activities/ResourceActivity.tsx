import React from 'react';
import { BaseActivityClass } from '../activity-factory';
import { ResourceActivity as ResourceActivityType, ResourceSettings } from '@shared/activity-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, FileText, Link, Download, ExternalLink } from 'lucide-react';

export class ResourceActivity extends BaseActivityClass {
  data: ResourceActivityType;

  constructor(data: ResourceActivityType) {
    super(data);
    this.data = data;
  }

  render(): React.ReactElement {
    return <ResourceRenderer activity={this} />;
  }

  protected validateSpecific(): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const settings = this.data.settings as ResourceSettings;

    if (!settings.resourceType) {
      errors.push("Resource type must be specified");
    }

    if (settings.resourceType === 'url' && !settings.url) {
      errors.push("URL is required for URL resource type");
    }

    if (settings.resourceType === 'file' && !settings.fileId) {
      errors.push("File is required for file resource type");
    }

    return { errors, warnings };
  }

  calculateGrade(submission: any): number {
    // Resources are typically non-graded activities
    return this.data.maxGrade;
  }
}

interface ResourceRendererProps {
  activity: ResourceActivity;
}

const ResourceRenderer: React.FC<ResourceRendererProps> = ({ activity }) => {
  const settings = activity.data.settings as ResourceSettings;

  const getResourceIcon = () => {
    switch (settings.resourceType) {
      case 'file': return <FileText className="h-5 w-5" />;
      case 'url': return <Link className="h-5 w-5" />;
      case 'text': return <FileText className="h-5 w-5" />;
      case 'book': return <FolderOpen className="h-5 w-5" />;
      default: return <FolderOpen className="h-5 w-5" />;
    }
  };

  const renderResourceContent = () => {
    switch (settings.resourceType) {
      case 'url':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">External link resource</p>
            <Button asChild>
              <a href={settings.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Link
              </a>
            </Button>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">File resource</p>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
          </div>
        );

      case 'text':
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: settings.content || '' }} />
          </div>
        );

      case 'book':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Book chapter or collection</p>
            <div className="border rounded-lg p-4">
              <p>Book content would be displayed here</p>
            </div>
          </div>
        );

      default:
        return <p className="text-gray-500">Resource type not supported</p>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getResourceIcon()}
            {activity.data.title}
          </CardTitle>
          {settings.displayOptions.showDescription && (
            <p className="text-sm text-gray-600">
              {activity.data.description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {renderResourceContent()}
        </CardContent>
      </Card>
    </div>
  );
};