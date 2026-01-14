'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileHeader } from '@/components/passenger/ProfileHeader';
import { PersonalDataTab } from '@/components/passenger/PersonalDataTab';
import { SecurityTab } from '@/components/passenger/SecurityTab';
import { ProfilePhotoModal } from '@/components/common/ProfilePhotoModal';
import { useAuthStore } from '../../store/authStore';

export const DriverProfileClient: React.FC = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-(--foreground)">Mi Perfil</h1>

        {/* Profile Header */}
        <ProfileHeader
          user={user}
          isEditing={isEditing}
          onPhotoClick={() => setPhotoModalOpen(true)}
          onEditToggle={() => setIsEditing(!isEditing)}
        />

        {/* Tabs Content */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <PersonalDataTab user={user} isEditing={isEditing} />
          </TabsContent>

          <TabsContent value="seguridad" className="mt-6">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <ProfilePhotoModal
        open={photoModalOpen}
        onOpenChange={setPhotoModalOpen}
        userName={`${user.nombre} ${user.apellido}`}
        currentPhoto={user.avatarUrl}
      />
    </>
  );
};
