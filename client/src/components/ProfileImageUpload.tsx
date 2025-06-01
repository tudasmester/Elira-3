import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, X, Check } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  userName: string;
  onImageUpdate: (imageUrl: string) => void;
}

export default function ProfileImageUpload({ 
  currentImageUrl, 
  userName, 
  onImageUpdate 
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getUserInitials = () => {
    const names = userName.split(' ');
    return names.map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Csak képfájlok engedélyezettek';
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return 'A fájl mérete nem lehet nagyobb 5MB-nál';
    }

    // Check image dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          resolve('A kép legalább 100x100 pixel méretű kell legyen');
        } else {
          resolve(null);
        }
      };
      img.src = URL.createObjectURL(file);
    }) as any;
  };

  const handleFileSelect = async (file: File) => {
    const error = await validateFile(file);
    if (error) {
      toast({
        title: "Érvénytelen fájl",
        description: error,
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUpdate(data.imageUrl);
      setPreviewUrl(null);
      
      toast({
        title: "Profilkép frissítve",
        description: "Az új profilkép sikeresen feltöltve",
      });
    } catch (error) {
      toast({
        title: "Feltöltési hiba",
        description: "Nem sikerült feltölteni a képet. Próbálja újra.",
        variant: "destructive",
      });
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = async () => {
    try {
      await apiRequest('DELETE', '/api/upload/profile-image');
      onImageUpdate('');
      toast({
        title: "Profilkép eltávolítva",
        description: "A profilkép sikeresen eltávolítva",
      });
    } catch (error) {
      toast({
        title: "Hiba",
        description: "Nem sikerült eltávolítani a profilképet",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || currentImageUrl} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          </div>
        )}
        
        {previewUrl && !isUploading && (
          <div className="absolute -top-2 -right-2">
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 rounded-full p-0 bg-green-500 border-green-500 text-white hover:bg-green-600"
            >
              <Check className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Camera className="h-4 w-4 mr-2" />
            {currentImageUrl ? 'Kép cseréje' : 'Kép feltöltése'}
          </Button>
          
          {currentImageUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Eltávolítás
            </Button>
          )}
        </div>
        
        <p className="text-sm text-gray-500">
          JPG, PNG. Maximum 5MB. Legalább 100x100 pixel.
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}