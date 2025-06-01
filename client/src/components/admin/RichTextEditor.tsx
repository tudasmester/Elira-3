import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link2, 
  Image, 
  Video,
  Code,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Írja be a tartalmat...",
  height = "300px"
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + 
                   before + selectedText + after + 
                   value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length, 
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatButtons = [
    {
      icon: Heading1,
      action: () => insertText('# '),
      title: 'Főcím'
    },
    {
      icon: Heading2,
      action: () => insertText('## '),
      title: 'Alcím'
    },
    {
      icon: Heading3,
      action: () => insertText('### '),
      title: 'Kis cím'
    },
    {
      icon: Bold,
      action: () => insertText('**', '**'),
      title: 'Félkövér'
    },
    {
      icon: Italic,
      action: () => insertText('_', '_'),
      title: 'Dőlt'
    },
    {
      icon: Underline,
      action: () => insertText('<u>', '</u>'),
      title: 'Aláhúzott'
    },
    {
      icon: List,
      action: () => insertText('- '),
      title: 'Lista'
    },
    {
      icon: ListOrdered,
      action: () => insertText('1. '),
      title: 'Számozott lista'
    },
    {
      icon: Quote,
      action: () => insertText('> '),
      title: 'Idézet'
    },
    {
      icon: Code,
      action: () => insertText('`', '`'),
      title: 'Kód'
    },
    {
      icon: Link2,
      action: () => insertText('[', '](url)'),
      title: 'Link'
    },
    {
      icon: Image,
      action: () => insertText('![alt text](', ')'),
      title: 'Kép'
    },
    {
      icon: Video,
      action: () => insertText('[video](', ')'),
      title: 'Videó'
    }
  ];

  const renderPreview = (text: string) => {
    // Simple markdown-like rendering
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^1\. (.*$)/gm, '<li class="ml-4">1. $1</li>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto my-2" />')
      .replace(/\[video\]\((.*?)\)/g, '<video controls class="max-w-full h-auto my-2"><source src="$1" /></video>')
      .replace(/\n/g, '<br />');
  };

  return (
    <Card>
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-3">
          <div className="flex flex-wrap items-center gap-1">
            {formatButtons.map((button, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={button.action}
                title={button.title}
                className="h-8 w-8 p-0"
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
            
            <div className="ml-auto flex gap-2">
              <Button
                variant={!isPreview ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPreview(false)}
              >
                Szerkesztés
              </Button>
              <Button
                variant={isPreview ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPreview(true)}
              >
                Előnézet
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3">
          {isPreview ? (
            <div 
              className="prose max-w-none min-h-[200px] p-4 border border-gray-200 rounded"
              style={{ minHeight: height }}
              dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
            />
          ) : (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="resize-none border-0 focus:ring-0 focus:border-0"
              style={{ minHeight: height }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}