import React from 'react';
import { BaseActivityClass } from '../activity-factory';
import { ForumActivity as ForumActivityType, ForumSettings } from '@shared/activity-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Reply, Users } from 'lucide-react';

export class ForumActivity extends BaseActivityClass {
  data: ForumActivityType;

  constructor(data: ForumActivityType) {
    super(data);
    this.data = data;
  }

  render(): React.ReactElement {
    return <ForumRenderer activity={this} />;
  }

  protected validateSpecific(): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const settings = this.data.settings as ForumSettings;

    if (settings.maxAttachmentSize && settings.maxAttachmentSize <= 0) {
      warnings.push("Maximum attachment size should be positive");
    }

    return { errors, warnings };
  }

  calculateGrade(submission: any): number {
    // Forum participation grading based on posts and quality
    return 0;
  }
}

interface ForumRendererProps {
  activity: ForumActivity;
}

const ForumRenderer: React.FC<ForumRendererProps> = ({ activity }) => {
  const [newPost, setNewPost] = React.useState('');
  const settings = activity.data.settings as ForumSettings;

  const handlePostSubmit = () => {
    console.log('Forum post submitted:', newPost);
    setNewPost('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {activity.data.title}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {activity.data.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Start a new discussion..."
              className="min-h-24"
            />
            <Button onClick={handlePostSubmit}>
              <Reply className="h-4 w-4 mr-2" />
              Post Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};