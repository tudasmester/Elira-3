import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  FileText, 
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<string[]>;
  onComplete?: (urls: string[]) => void;
  className?: string;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

export default function FileUpload({
  accept = "*/*",
  maxSize = 10,
  multiple = false,
  onUpload,
  onComplete,
  className = ""
}: FileUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `A fájl túl nagy. Maximum ${maxSize}MB engedélyezett.`;
    }
    return null;
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "Fájl hiba",
          description: `${file.name}: ${error}`,
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const newUploadFiles: UploadFile[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));

    setUploadFiles(prev => [...prev, ...newUploadFiles]);

    try {
      // Start upload process
      const uploadPromises = validFiles.map(async (file, index) => {
        const uploadFile = newUploadFiles[index];
        
        setUploadFiles(prev => 
          prev.map(uf => 
            uf.file === file 
              ? { ...uf, status: 'uploading' }
              : uf
          )
        );

        try {
          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploadFiles(prev => 
              prev.map(uf => 
                uf.file === file && uf.status === 'uploading'
                  ? { ...uf, progress: Math.min(uf.progress + 10, 90) }
                  : uf
              )
            );
          }, 200);

          const urls = await onUpload([file]);
          clearInterval(progressInterval);

          setUploadFiles(prev => 
            prev.map(uf => 
              uf.file === file 
                ? { ...uf, progress: 100, status: 'completed', url: urls[0] }
                : uf
            )
          );

          return urls[0];
        } catch (error) {
          setUploadFiles(prev => 
            prev.map(uf => 
              uf.file === file 
                ? { ...uf, status: 'error', error: 'Feltöltés sikertelen' }
                : uf
            )
          );
          throw error;
        }
      });

      const uploadedUrls = await Promise.allSettled(uploadPromises);
      const successfulUrls = uploadedUrls
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<string>).value);

      if (successfulUrls.length > 0 && onComplete) {
        onComplete(successfulUrls);
      }

      toast({
        title: "Feltöltés kész",
        description: `${successfulUrls.length} fájl sikeresen feltöltve.`,
      });

    } catch (error) {
      toast({
        title: "Feltöltési hiba",
        description: "Egy vagy több fájl feltöltése sikertelen.",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setUploadFiles(prev => prev.filter(uf => uf.file !== fileToRemove));
  };

  const clearCompleted = () => {
    setUploadFiles(prev => prev.filter(uf => uf.status !== 'completed'));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <CardContent className="p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Húzza ide a fájlokat vagy kattintson a böngészéshez
            </p>
            <p className="text-sm text-gray-500">
              Maximum {maxSize}MB • {accept === "*/*" ? "Bármilyen fájltípus" : accept}
            </p>
          </div>
          <Button 
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Fájlok kiválasztása
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Feltöltés állapota</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearCompleted}
                disabled={!uploadFiles.some(uf => uf.status === 'completed')}
              >
                Kész fájlok eltávolítása
              </Button>
            </div>
            
            <div className="space-y-3">
              {uploadFiles.map((uploadFile, index) => {
                const Icon = getFileIcon(uploadFile.file.type);
                
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Icon className="h-8 w-8 text-gray-500 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{uploadFile.file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      
                      {uploadFile.status === 'uploading' && (
                        <Progress value={uploadFile.progress} className="mt-2" />
                      )}
                      
                      {uploadFile.status === 'error' && (
                        <p className="text-sm text-red-500 mt-1">{uploadFile.error}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {uploadFile.status === 'completed' && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                      {uploadFile.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.file)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}