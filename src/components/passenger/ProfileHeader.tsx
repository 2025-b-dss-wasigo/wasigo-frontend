'use client';

import React from 'react';
import { User as UserIcon, Star, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FaPen, FaSave } from 'react-icons/fa';

interface ProfileHeaderProps {
  user: {
    nombre: string;
    apellido: string;
    alias: string;
    rating: string;
    avatarUrl?: string;
    verificado: boolean;
  };
  isEditing: boolean;
  onPhotoClick: () => void;
  onEditToggle: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isEditing,
  onPhotoClick,
  onEditToggle,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-(--primary) to-(--primary)/70" />
      <CardContent className="relative pt-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-(--card) border-4 border-(--card) flex items-center justify-center overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.nombre} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-12 h-12 text-(--muted-foreground)" />
              )}
            </div>
            <button
              onClick={onPhotoClick}
              className="absolute bottom-0 right-0 p-1.5 bg-(--primary) rounded-full text-(--primary-foreground) hover:bg-(--primary)/90 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left pb-4">
            <h2 className="text-xl font-semibold text-white">{user.nombre} {user.apellido}</h2>
            <p className="text-white/80">@{user.alias}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{user.rating}</span>
              </div>
              {user.verificado && (
                <StatusBadge status="confirmado" />
              )}
            </div>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={onEditToggle}
            className="mt-7"
          >
            {isEditing ? (
              <>
                <FaSave size={20} className='text-white' />
                Guardar
              </>
            ) : (
              <>
                <FaPen size={20} className='text-(--sidebar-background)' />
                Editar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
