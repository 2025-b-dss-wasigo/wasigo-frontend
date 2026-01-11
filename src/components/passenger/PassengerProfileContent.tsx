'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileHeader } from './ProfileHeader';
import { ProfileAlertCard } from './ProfileAlertCard';
import { PersonalDataTab } from './PersonalDataTab';
import { SecurityTab } from './SecurityTab';
import { ProfilePhotoModal } from '@/components/common/ProfilePhotoModal';
import { DriverApplicationModal } from '@/components/common/DriverApplicationModal';
import { DriverApplicationStatusModal } from '@/components/common/DriverApplicationStatusModal';
import { useAuthStore } from '../../store/authStore';
import { getRequestStatus } from '@/actions';

export const PassengerProfileContent: React.FC = () => {

  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [driverApplicationOpen, setDriverApplicationOpen] = useState(false);
  const [hasDriverApplication, setHasDriverApplication] = useState(true);
  const [driverStatus, setDriverStatus] = useState<string | null>(null);
  const [driverVehicle, setDriverVehicle] = useState<any>(null);


  const fetchDriverStatus = async () => {
    const response = await getRequestStatus();
    if (response.success && response.data) {
      setHasDriverApplication(response.data.hasApplication);
      if (response.data.driver) {
        setDriverStatus(response.data.driver.estado);
        if (response.data.driver.vehicles && response.data.driver.vehicles.length > 0) {
          setDriverVehicle(response.data.driver.vehicles[0]);
        }
      }
    }
  };

  useEffect(() => {
    const checkDriverApplicationStatus = async () => {
      if (user?.role === 'PASAJERO') {
        await fetchDriverStatus();
      }
    };

    if (user) {
      checkDriverApplicationStatus();
    }
  }, [user]);

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
        {driverStatus === 'PENDIENTE' ? (
          <DriverApplicationStatusModal vehicle={driverVehicle} />
        ) : (
          <ProfileAlertCard
            role={user.role}
            verificado={user.verificado}
            hasDriverApplication={hasDriverApplication}
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
        onSubmitSuccess={fetchDriverStatus}
      />
    </>
  );
};
