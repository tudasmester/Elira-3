import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Type,
  Video,
  Code,
  FileText,
  Image,
  Mic,
  Download,
  Play,
  Pause,
  RotateCcw,
  Save,
  Eye,
  Smartphone,
  Monitor,
  Upload,
  Link,
  AlignLeft,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Palette,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  Lightbulb,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Clock,
  BarChart,
  Users,
  Target,
  CheckCircle,
  X
} from 'lucide-react';

interface ContentBlock {
  id: string;
  type: 'text' | 'video' | 'quiz' | 'code' | 'file' | 'interactive';
  content: any;
  order: number;
  settings?: any;
}

interface LessonData {
  id?: number;
  title: string;
  description: string;
  duration: number;
  contentBlocks: ContentBlock[];
  resources: any[];
  analytics?: {
    readingTime: number;
    engagementScore: number;
  };
}

interface AdvancedLessonEditorProps {
  lesson?: LessonData;
  onSave: (lessonData: LessonData) => void;
  onCancel: () => void;
}

// Rich Text Editor Component
const RichTextEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [showFormatting, setShowFormatting] = useState(false);

  const formatText = (command: string, value?: string) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const selectedText = editorRef.current.value.substring(start, end);
      
      let replacement = '';
      switch (command) {
        case 'bold':
          replacement = `**${selectedText}**`;
          break;
        case 'italic':
          replacement = `*${selectedText}*`;
          break;
        case 'heading1':
          replacement = `# ${selectedText}`;
          break;
        case 'heading2':
          replacement = `## ${selectedText}`;
          break;
        case 'heading3':
          replacement = `### ${selectedText}`;
          break;
        case 'quote':
          replacement = `> ${selectedText}`;
          break;
        case 'code':
          replacement = `\`${selectedText}\``;
          break;
        case 'codeblock':
          replacement = `\`\`\`\n${selectedText}\n\`\`\``;
          break;
        case 'list':
          replacement = `- ${selectedText}`;
          break;
        case 'orderedlist':
          replacement = `1. ${selectedText}`;
          break;
        default:
          replacement = selectedText;
      }

      const newValue = editorRef.current.value.substring(0, start) + replacement + editorRef.current.value.substring(end);
      onChange(newValue);
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFormatting(!showFormatting)}
        >
          <Palette className="h-4 w-4" />
        </Button>
        {showFormatting && (
          <>
            <Button variant="ghost" size="sm" onClick={() => formatText('bold')}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('italic')}>
              <Italic className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={() => formatText('heading1')}>
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('heading2')}>
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('heading3')}>
              <Heading3 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={() => formatText('list')}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('orderedlist')}>
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('quote')}>
              <Quote className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('codeblock')}>
              <Code className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <Textarea
        ref={editorRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 min-h-[200px] resize-none"
      />
    </div>
  );
};

// Video Content Editor
const VideoContentEditor: React.FC<{
  content: any;
  onChange: (content: any) => void;
}> = ({ content, onChange }) => {
  const [videoType, setVideoType] = useState(content?.type || 'upload');
  const [uploadProgress, setUploadProgress] = useState(0);

  return (
    <div className="space-y-4">
      <div>
        <Label>Videó típusa</Label>
        <Select value={videoType} onValueChange={(value) => {
          setVideoType(value);
          onChange({ ...content, type: value });
        }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upload">Feltöltés</SelectItem>
            <SelectItem value="youtube">YouTube beágyazás</SelectItem>
            <SelectItem value="vimeo">Vimeo beágyazás</SelectItem>
            <SelectItem value="external">Külső link</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {videoType === 'upload' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">Húzza ide a videófájlt vagy kattintson a feltöltéshez</p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Videó kiválasztása
          </Button>
          {uploadProgress > 0 && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">{uploadProgress}% feltöltve</p>
            </div>
          )}
        </div>
      )}

      {(videoType === 'youtube' || videoType === 'vimeo' || videoType === 'external') && (
        <div>
          <Label htmlFor="videoUrl">Videó URL</Label>
          <Input
            id="videoUrl"
            value={content?.url || ''}
            onChange={(e) => onChange({ ...content, url: e.target.value })}
            placeholder={`Adja meg a ${videoType} URL-t`}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="videoTitle">Videó címe</Label>
          <Input
            id="videoTitle"
            value={content?.title || ''}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
            placeholder="Videó címe"
          />
        </div>
        <div>
          <Label htmlFor="videoDuration">Időtartam (perc)</Label>
          <Input
            id="videoDuration"
            type="number"
            value={content?.duration || ''}
            onChange={(e) => onChange({ ...content, duration: parseInt(e.target.value) || 0 })}
            placeholder="15"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="autoplay"
          checked={content?.autoplay || false}
          onCheckedChange={(checked) => onChange({ ...content, autoplay: checked })}
        />
        <Label htmlFor="autoplay">Automatikus lejátszás</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="showControls"
          checked={content?.showControls !== false}
          onCheckedChange={(checked) => onChange({ ...content, showControls: checked })}
        />
        <Label htmlFor="showControls">Vezérlők megjelenítése</Label>
      </div>
    </div>
  );
};

// Interactive Quiz Editor
const QuizEditor: React.FC<{
  content: any;
  onChange: (content: any) => void;
}> = ({ content, onChange }) => {
  const [questions, setQuestions] = useState(content?.questions || []);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: ''
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    onChange({ ...content, questions: updatedQuestions });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
    onChange({ ...content, questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_: any, i: number) => i !== index);
    setQuestions(updatedQuestions);
    onChange({ ...content, questions: updatedQuestions });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Interaktív kvíz</h3>
        <Button onClick={addQuestion} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Kérdés hozzáadása
        </Button>
      </div>

      {questions.map((question: any, index: number) => (
        <Card key={question.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-sm font-medium">Kérdés #{index + 1}</Label>
            <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <Textarea
              value={question.question}
              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
              placeholder="Adja meg a kérdést..."
              rows={2}
            />

            <div className="grid grid-cols-2 gap-2">
              {question.options.map((option: string, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options];
                      newOptions[optionIndex] = e.target.value;
                      updateQuestion(index, 'options', newOptions);
                    }}
                    placeholder={`${optionIndex + 1}. válasz`}
                    className={question.correct === optionIndex ? 'border-green-500' : ''}
                  />
                  <Button
                    variant={question.correct === optionIndex ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => updateQuestion(index, 'correct', optionIndex)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Textarea
              value={question.explanation}
              onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
              placeholder="Magyarázat (opcionális)..."
              rows={2}
            />
          </div>
        </Card>
      ))}

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Target className="h-12 w-12 mx-auto mb-4" />
          <p>Még nincsenek kérdések hozzáadva</p>
          <p className="text-sm">Kattintson a "Kérdés hozzáadása" gombra az első kérdés létrehozásához</p>
        </div>
      )}
    </div>
  );
};

// Code Playground Editor
const CodePlaygroundEditor: React.FC<{
  content: any;
  onChange: (content: any) => void;
}> = ({ content, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="language">Programozási nyelv</Label>
          <Select
            value={content?.language || 'javascript'}
            onValueChange={(value) => onChange({ ...content, language: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="theme">Téma</Label>
          <Select
            value={content?.theme || 'vs-dark'}
            onValueChange={(value) => onChange({ ...content, theme: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vs-dark">Sötét</SelectItem>
              <SelectItem value="vs-light">Világos</SelectItem>
              <SelectItem value="hc-black">Magas kontraszt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="starter-code">Kezdő kód</Label>
        <Textarea
          id="starter-code"
          value={content?.starterCode || ''}
          onChange={(e) => onChange({ ...content, starterCode: e.target.value })}
          placeholder="// Kezdő kód itt..."
          className="font-mono"
          rows={10}
        />
      </div>

      <div>
        <Label htmlFor="solution">Megoldás (opcionális)</Label>
        <Textarea
          id="solution"
          value={content?.solution || ''}
          onChange={(e) => onChange({ ...content, solution: e.target.value })}
          placeholder="// Megoldás kód..."
          className="font-mono"
          rows={6}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="showLineNumbers"
          checked={content?.showLineNumbers !== false}
          onCheckedChange={(checked) => onChange({ ...content, showLineNumbers: checked })}
        />
        <Label htmlFor="showLineNumbers">Sorszámok megjelenítése</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="enableAutoComplete"
          checked={content?.enableAutoComplete !== false}
          onCheckedChange={(checked) => onChange({ ...content, enableAutoComplete: checked })}
        />
        <Label htmlFor="enableAutoComplete">Automatikus kiegészítés</Label>
      </div>
    </div>
  );
};

export default function AdvancedLessonEditor({ lesson, onSave, onCancel }: AdvancedLessonEditorProps) {
  const [lessonData, setLessonData] = useState<LessonData>({
    title: lesson?.title || '',
    description: lesson?.description || '',
    duration: lesson?.duration || 0,
    contentBlocks: lesson?.contentBlocks || [],
    resources: lesson?.resources || []
  });

  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState(false);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedBlockType, setSelectedBlockType] = useState<string>('text');

  const addContentBlock = useCallback((type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? '' : {},
      order: lessonData.contentBlocks.length
    };

    setLessonData(prev => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, newBlock]
    }));
  }, [lessonData.contentBlocks.length]);

  const updateContentBlock = useCallback((blockId: string, content: any) => {
    setLessonData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map(block =>
        block.id === blockId ? { ...block, content } : block
      )
    }));
  }, []);

  const removeContentBlock = useCallback((blockId: string) => {
    setLessonData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter(block => block.id !== blockId)
    }));
  }, []);

  const calculateReadingTime = useCallback(() => {
    const textBlocks = lessonData.contentBlocks.filter(block => block.type === 'text');
    const totalWords = textBlocks.reduce((acc, block) => {
      const wordCount = block.content.split(' ').length;
      return acc + wordCount;
    }, 0);
    return Math.ceil(totalWords / 200); // 200 szó/perc átlagos olvasási sebesség
  }, [lessonData.contentBlocks]);

  const handleSave = () => {
    const updatedLessonData = {
      ...lessonData,
      analytics: {
        readingTime: calculateReadingTime(),
        engagementScore: 0 // Ez egy valós alkalmazásban számítva lenne
      }
    };
    onSave(updatedLessonData);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {lesson ? 'Lecke szerkesztése' : 'Új lecke létrehozása'}
          </h1>
          <p className="text-gray-600">
            Fejlett tartalom szerkesztő többféle tartalomtípussal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Szerkesztés' : 'Előnézet'}
          </Button>
          {previewMode && (
            <Select value={devicePreview} onValueChange={(value: 'desktop' | 'mobile') => setDevicePreview(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desktop">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Asztal
                  </div>
                </SelectItem>
                <SelectItem value="mobile">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Mobil
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Mégse
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Mentés
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Tartalom</TabsTrigger>
          <TabsTrigger value="settings">Beállítások</TabsTrigger>
          <TabsTrigger value="resources">Erőforrások</TabsTrigger>
          <TabsTrigger value="analytics">Analitika</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Content Blocks Panel */}
            <div className="col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Lecke tartalom
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Tartalom hozzáadása
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Tartalomtípus kiválasztása</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <Button
                            variant="outline"
                            className="h-20 flex-col"
                            onClick={() => {
                              addContentBlock('text');
                            }}
                          >
                            <Type className="h-6 w-6 mb-2" />
                            Szöveg
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex-col"
                            onClick={() => {
                              addContentBlock('video');
                            }}
                          >
                            <Video className="h-6 w-6 mb-2" />
                            Videó
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex-col"
                            onClick={() => {
                              addContentBlock('quiz');
                            }}
                          >
                            <Target className="h-6 w-6 mb-2" />
                            Kvíz
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex-col"
                            onClick={() => {
                              addContentBlock('code');
                            }}
                          >
                            <Code className="h-6 w-6 mb-2" />
                            Kód
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lessonData.contentBlocks.map((block, index) => (
                    <Card key={block.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {block.type === 'text' && <Type className="h-4 w-4" />}
                          {block.type === 'video' && <Video className="h-4 w-4" />}
                          {block.type === 'quiz' && <Target className="h-4 w-4" />}
                          {block.type === 'code' && <Code className="h-4 w-4" />}
                          <span className="font-medium">
                            {block.type === 'text' && 'Szöveg blokk'}
                            {block.type === 'video' && 'Videó blokk'}
                            {block.type === 'quiz' && 'Kvíz blokk'}
                            {block.type === 'code' && 'Kód blokk'}
                          </span>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContentBlock(block.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {block.type === 'text' && (
                        <RichTextEditor
                          value={block.content}
                          onChange={(content) => updateContentBlock(block.id, content)}
                          placeholder="Írja be a szöveges tartalmat..."
                        />
                      )}

                      {block.type === 'video' && (
                        <VideoContentEditor
                          content={block.content}
                          onChange={(content) => updateContentBlock(block.id, content)}
                        />
                      )}

                      {block.type === 'quiz' && (
                        <QuizEditor
                          content={block.content}
                          onChange={(content) => updateContentBlock(block.id, content)}
                        />
                      )}

                      {block.type === 'code' && (
                        <CodePlaygroundEditor
                          content={block.content}
                          onChange={(content) => updateContentBlock(block.id, content)}
                        />
                      )}
                    </Card>
                  ))}

                  {lessonData.contentBlocks.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Még nincs tartalom</h3>
                      <p className="mb-4">Kezdje el a lecke létrehozását tartalom hozzáadásával</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Első tartalom hozzáadása
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Tartalomtípus kiválasztása</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <Button
                              variant="outline"
                              className="h-20 flex-col"
                              onClick={() => {
                                addContentBlock('text');
                              }}
                            >
                              <Type className="h-6 w-6 mb-2" />
                              Szöveg
                            </Button>
                            <Button
                              variant="outline"
                              className="h-20 flex-col"
                              onClick={() => {
                                addContentBlock('video');
                              }}
                            >
                              <Video className="h-6 w-6 mb-2" />
                              Videó
                            </Button>
                            <Button
                              variant="outline"
                              className="h-20 flex-col"
                              onClick={() => {
                                addContentBlock('quiz');
                              }}
                            >
                              <Target className="h-6 w-6 mb-2" />
                              Kvíz
                            </Button>
                            <Button
                              variant="outline"
                              className="h-20 flex-col"
                              onClick={() => {
                                addContentBlock('code');
                              }}
                            >
                              <Code className="h-6 w-6 mb-2" />
                              Kód
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar with lesson info */}
            <div className="col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lecke információk</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="lesson-title">Lecke címe</Label>
                    <Input
                      id="lesson-title"
                      value={lessonData.title}
                      onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Lecke címe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lesson-description">Leírás</Label>
                    <Textarea
                      id="lesson-description"
                      value={lessonData.description}
                      onChange={(e) => setLessonData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Lecke rövid leírása"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lesson-duration">Becsült időtartam (perc)</Label>
                    <Input
                      id="lesson-duration"
                      type="number"
                      value={lessonData.duration}
                      onChange={(e) => setLessonData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      placeholder="30"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tartalom blokkok:</span>
                      <Badge variant="secondary">{lessonData.contentBlocks.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Olvasási idő:</span>
                      <span className="text-gray-600">{calculateReadingTime()} perc</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Lecke beállítások</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">További beállítások hamarosan...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Letölthető erőforrások</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Erőforrás-kezelő hamarosan...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Tartalom analitika</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{calculateReadingTime()}</div>
                  <div className="text-sm text-gray-600">Perc olvasás</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{lessonData.contentBlocks.length}</div>
                  <div className="text-sm text-gray-600">Tartalom blokk</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <BarChart className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-sm text-gray-600">Elérhetőség</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}