import React from 'react';
import { getRequestStatus } from '@/actions';
import { PassengerProfileClient } from './PassengerProfileClient';

export const PassengerProfileServer = async () => {
  let driverData = {
    hasDriverApplication: true,
    driverStatus: null as string | null,
    driverVehicle: null as any,
  };

  try {
    const response = await getRequestStatus();
    if (response.success && response.data) {
      driverData.hasDriverApplication = response.data.hasApplication;
      if (response.data.driver) {
        driverData.driverStatus = response.data.driver.estado;
        if (response.data.driver.vehicles && response.data.driver.vehicles.length > 0) {
          driverData.driverVehicle = response.data.driver.vehicles[0];
        }
      }
    }
  } catch (error) {
    console.error('Error fetching driver status:', error);
  }

  return <PassengerProfileClient initialDriverData={driverData} />;
};
