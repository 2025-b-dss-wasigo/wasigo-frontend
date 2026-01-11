import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePhotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhoto?: string;
  userName: string;
}

export function ProfilePhotoModal({ open, onOpenChange, currentPhoto, userName }: ProfilePhotoModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen es muy grande', {
          description: 'El tamaño máximo es 5MB'
        });
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      toast.success('Foto actualizada', {
        description: 'Tu foto de perfil se ha actualizado correctamente.'
      });
    }
    handleClose();
  };

  const handleDelete = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    toast.success('Foto eliminada', {
      description: 'Tu foto de perfil ha sido eliminada.'
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    onOpenChange(false);
  };

  const displayPhoto = previewUrl || currentPhoto;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Foto de Perfil</DialogTitle>
          <DialogDescription>
            Actualiza tu foto de perfil
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Photo Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-(--muted) flex items-center justify-center overflow-hidden border-4 border-(--background) shadow-lg">
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-(--primary)/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-(--primary)">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-(--primary) text-(--primary-foreground) rounded-full flex items-center justify-center shadow-lg hover:bg-(--primary)/90 transition-colors"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div className="text-center">
              <p className="font-medium text-(--foreground)">{userName}</p>
              <p className="text-sm text-(--muted-foreground)">Formatos: JPG, PNG, GIF (máx 5MB)</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-6">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-3" />
              Subir nueva foto
            </Button>
            {(displayPhoto || currentPhoto) && (
              <Button
                variant="ghost"
                className="w-full justify-start text-(--destructive) hover:text-(--destructive) hover:bg-(--destructive)/10"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-3" />
                Eliminar foto actual
              </Button>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1" disabled={!selectedFile}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
