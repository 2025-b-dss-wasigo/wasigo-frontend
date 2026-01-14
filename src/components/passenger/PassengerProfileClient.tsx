'use client';

import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileHeader } from './ProfileHeader';
import { ProfileAlertCard } from './ProfileAlertCard';
import { PersonalDataTab } from './PersonalDataTab';
import { SecurityTab } from './SecurityTab';
import { ProfilePhotoModal } from '@/components/common/ProfilePhotoModal';
import { DriverApplicationModal } from '@/components/common/DriverApplicationModal';
import { DriverApplicationStatusModal } from '@/components/common/DriverApplicationStatusModal';
import { useAuthStore } from '../../store/authStore';

interface DriverData {
  hasDriverApplication: boolean;
  driverStatus: string | null;
  driverVehicle: any;
}

interface PassengerProfileClientProps {
  initialDriverData: DriverData;
}

export const PassengerProfileClient: React.FC<PassengerProfileClientProps> = ({
  initialDriverData,
}) => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [driverApplicationOpen, setDriverApplicationOpen] = useState(false);
  const [driverData, setDriverData] = useState<DriverData>(initialDriverData);

  const handleSubmitSuccess = useCallback(() => {
    // En un caso real, aquí harías una llamada para actualizar driverData
    // Por ahora, simplemente cierra el modal
    setDriverApplicationOpen(false);
  }, []);

  if (!user) return null;

  const isDriver = user.role === 'CONDUCTOR';
  const isPassenger = user.role === 'PASAJERO';

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

        {/* Alert Card - Verification or Driver Application */}
        {driverData.driverStatus === 'PENDIENTE' ? (
          <DriverApplicationStatusModal vehicle={driverData.driverVehicle} />
        ) : (
          <ProfileAlertCard
            role={user.role}
            verificado={user.verificado}
            hasDriverApplication={driverData.hasDriverApplication}
            onDriverApplicationClick={() => setDriverApplicationOpen(true)}
          />
        )}

        {/* Tabs Content */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            {isDriver && <TabsTrigger value="vehiculo">Vehículo</TabsTrigger>}
            {isDriver && <TabsTrigger value="pagos">Pagos</TabsTrigger>}
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
      <DriverApplicationModal
        open={driverApplicationOpen}
        onOpenChange={setDriverApplicationOpen}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </>
  );
};
