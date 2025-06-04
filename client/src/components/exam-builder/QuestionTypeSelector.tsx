import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle,
  Type,
  FileText,
  Upload,
  Image,
  Video,
  List,
  Target
} from 'lucide-react';
import { QuestionTemplate } from '@/services/examBuilderService';

interface QuestionTypeSelectorProps {
  onSelectType: (questionType: string) => void;
  supportedTypes: string[];
  templates: { [key: string]: QuestionTemplate };
}

const questionTypeConfig = {
  multiple_choice: {
    icon: CheckCircle,
    title: 'Multiple Choice',
    description: 'Students select one or more correct answers from multiple options',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconColor: 'text-blue-500',
    difficulty: 'Easy',
    timeEstimate: '2-3 min'
  },
  true_false: {
    icon: Circle,
    title: 'True/False',
    description: 'Simple binary choice questions with true or false answers',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    iconColor: 'text-green-500',
    difficulty: 'Easy',
    timeEstimate: '1-2 min'
  },
  short_text: {
    icon: Type,
    title: 'Short Text',
    description: 'Students provide brief written answers in a few words or sentences',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    iconColor: 'text-purple-500',
    difficulty: 'Medium',
    timeEstimate: '3-5 min'
  },
  text_assignment: {
    icon: FileText,
    title: 'Text Assignment',
    description: 'Long-form written responses and essay questions',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    iconColor: 'text-orange-500',
    difficulty: 'Hard',
    timeEstimate: '10-30 min'
  },
  file_assignment: {
    icon: Upload,
    title: 'File Assignment',
    description: 'Students upload files, documents, or other media as answers',
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    iconColor: 'text-red-500',
    difficulty: 'Medium',
    timeEstimate: '5-15 min'
  },
  match_ordering: {
    icon: List,
    title: 'Match & Order',
    description: 'Drag and drop matching or ordering exercises',
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
    iconColor: 'text-teal-500',
    difficulty: 'Medium',
    timeEstimate: '3-7 min'
  },
  video_recording: {
    icon: Video,
    title: 'Video Recording',
    description: 'Students record video responses using their camera',
    color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
    iconColor: 'text-pink-500',
    difficulty: 'Medium',
    timeEstimate: '5-10 min'
  },
  audio_recording: {
    icon: Video,
    title: 'Audio Recording',
    description: 'Students record audio responses using their microphone',
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    iconColor: 'text-indigo-500',
    difficulty: 'Medium',
    timeEstimate: '3-8 min'
  }
};

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-red-100 text-red-800'
};

export function QuestionTypeSelector({ onSelectType, supportedTypes, templates }: QuestionTypeSelectorProps) {
  const availableTypes = supportedTypes.filter(type => questionTypeConfig[type as keyof typeof questionTypeConfig]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Question Type</h3>
        <p className="text-sm text-gray-600">Select the type of question you want to add to your exam</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTypes.map((type) => {
          const config = questionTypeConfig[type as keyof typeof questionTypeConfig];
          const Icon = config.icon;
          
          return (
            <Card 
              key={type} 
              className={`cursor-pointer transition-all duration-200 ${config.color} border-2`}
              onClick={() => onSelectType(type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                    <CardTitle className="text-base">{config.title}</CardTitle>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${difficultyColors[config.difficulty as keyof typeof difficultyColors]}`}
                    >
                      {config.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {config.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    Est. time: {config.timeEstimate}
                  </span>
                </div>
                
                {/* Template Preview */}
                {templates[type] && (
                  <div className="mt-3 p-2 bg-white/50 rounded border">
                    <p className="text-xs font-medium text-gray-700 mb-1">Template Preview:</p>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {templates[type].questionText}
                    </p>
                    {templates[type].options && templates[type].options!.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {templates[type].options!.length} options included
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {availableTypes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No question types available</p>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            Need help choosing? Here are some guidelines:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium text-gray-700 mb-1">Quick Assessment</p>
              <p className="text-gray-600">Use Multiple Choice or True/False for fast knowledge checks</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium text-gray-700 mb-1">Understanding</p>
              <p className="text-gray-600">Use Short Text for explanations and reasoning</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium text-gray-700 mb-1">Deep Learning</p>
              <p className="text-gray-600">Use Text Assignment for critical thinking and analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}