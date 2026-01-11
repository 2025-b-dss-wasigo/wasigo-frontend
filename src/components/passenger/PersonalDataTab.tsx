'use client';

import React from 'react';
import { User as UserIcon, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalDataTabProps {
  user: {
    nombre: string;
    apellido: string;
    celular: string;
    email: string;
  };
  isEditing: boolean;
}

export const PersonalDataTab: React.FC<PersonalDataTabProps> = ({ user, isEditing }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-(--primary)" />
          Datos Personales
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            defaultValue={user.nombre}
            disabled={!isEditing}
            icon={<UserIcon className="w-4 h-4" />}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            defaultValue={user.apellido}
            disabled={!isEditing}
            icon={<UserIcon className="w-4 h-4" />}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            defaultValue={user.email}
            type="email"
            disabled
            icon={<Mail className="w-4 h-4" />}
          />
          <p className="text-xs text-(--muted-foreground)">El correo no puede ser modificado</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="celular">Celular</Label>
          <Input
            id="celular"
            defaultValue={user.celular}
            disabled={!isEditing}
            icon={<Phone className="w-4 h-4" />}
          />
        </div>
      </CardContent>
    </Card>
  );
};
