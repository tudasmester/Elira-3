import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Edit, 
  Copy, 
  Trash2, 
  CheckCircle, 
  Circle,
  Type,
  Image,
  Video,
  FileText,
  Upload
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { QuizQuestion, QuizQuestionOption } from '@shared/schema';

interface QuestionCardProps {
  question: QuizQuestion & { options?: QuizQuestionOption[] };
  index: number;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const questionTypeIcons = {
  multiple_choice: CheckCircle,
  true_false: Circle,
  short_text: Type,
  text_assignment: FileText,
  file_assignment: Upload,
  match_ordering: Image,
  video_recording: Video,
  audio_recording: Video,
};

const questionTypeLabels = {
  multiple_choice: 'Multiple Choice',
  true_false: 'True/False',
  short_text: 'Short Text',
  text_assignment: 'Text Assignment',
  file_assignment: 'File Assignment',
  match_ordering: 'Match & Order',
  video_recording: 'Video Recording',
  audio_recording: 'Audio Recording',
};

export function QuestionCard({ question, index, onEdit, onDuplicate, onDelete }: QuestionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const QuestionIcon = questionTypeIcons[question.questionType as keyof typeof questionTypeIcons] || Type;
  const questionTypeLabel = questionTypeLabels[question.questionType as keyof typeof questionTypeLabels] || question.questionType;

  return (
    <Card ref={setNodeRef} style={style} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm text-gray-500">#{index + 1}</span>
              <QuestionIcon className="w-4 h-4 text-blue-500" />
              <Badge variant="outline" className="text-xs">
                {questionTypeLabel}
              </Badge>
              {question.points && (
                <Badge variant="secondary" className="text-xs">
                  {question.points} pts
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDuplicate}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Question Text */}
          <div>
            <p className="text-sm font-medium text-gray-900 line-clamp-2">
              {question.questionText}
            </p>
          </div>

          {/* Question Media */}
          {question.imageUrl && (
            <div className="flex items-center text-xs text-gray-500">
              <Image className="w-3 h-3 mr-1" />
              Image attached
            </div>
          )}
          {question.videoUrl && (
            <div className="flex items-center text-xs text-gray-500">
              <Video className="w-3 h-3 mr-1" />
              Video attached
            </div>
          )}

          {/* Question Options Preview */}
          {question.options && question.options.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Options:</p>
              <div className="space-y-1">
                {question.options.slice(0, 3).map((option, optionIndex) => (
                  <div key={option.id} className="flex items-center text-xs">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      option.isCorrect ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className="line-clamp-1 text-gray-600">
                      {option.optionText}
                    </span>
                  </div>
                ))}
                {question.options.length > 3 && (
                  <p className="text-xs text-gray-400">
                    +{question.options.length - 3} more options
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Question Type Specific Info */}
          {question.questionType === 'true_false' && (
            <div className="text-xs text-gray-500">
              True/False question
            </div>
          )}

          {question.questionType === 'short_text' && (
            <div className="text-xs text-gray-500">
              Short text answer required
            </div>
          )}

          {question.questionType === 'text_assignment' && (
            <div className="text-xs text-gray-500">
              Long text assignment
            </div>
          )}

          {question.questionType === 'file_assignment' && (
            <div className="text-xs text-gray-500">
              File upload required
            </div>
          )}

          {/* Question Settings */}
          {question.isRequired && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}