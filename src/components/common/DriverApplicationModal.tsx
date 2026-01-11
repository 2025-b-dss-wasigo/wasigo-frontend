import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Car, FileText, CreditCard, Upload, CheckCircle2,
  ArrowRight, ArrowLeft, AlertCircle, XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { submitDriverApplication, getRequestStatus } from '@/actions';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';

const COLORS = [
  'Blanco',
  'Negro',
  'Gris',
  'Plata',
  'Rojo',
  'Azul',
  'Verde',
  'Amarillo',
  'Naranja',
  'Marrón',
  'Dorado',
  'Púrpura'
];

interface DriverApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess?: () => void;
}

export function DriverApplicationModal({ open, onOpenChange, onSubmitSuccess }: DriverApplicationModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    color: '',
    placa: '',
    asientos: '4',
    paypalEmail: '',
    licencia: null as File | null,
    matricula: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  // Constantes de validación de archivo
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB en bytes
  const ALLOWED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg'];
  const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

  // Validación de marca: letras y números, pero no solo números
  const validateMarca = (value: string): string | null => {
    if (!value.trim()) return 'La marca no puede estar vacía';
    if (!/^[a-zA-Z0-9\s]+$/.test(value)) return 'La marca solo puede contener letras y números';
    if (/^\d+$/.test(value)) return 'La marca no puede contener solo números';
    return null;
  };

  // Validación de modelo
  const validateModelo = (value: string): string | null => {
    if (!value.trim()) return 'El modelo no puede estar vacío';
    return null;
  };

  // Validación de color
  const validateColor = (value: string): string | null => {
    if (!value.trim()) return 'Debes seleccionar un color';
    return null;
  };

  // Validación de placa: 3 letras + 4 números
  const validatePlaca = (value: string): string | null => {
    if (!value.trim()) return 'La placa no puede estar vacía';
    if (!/^[A-Z]{3}\d{4}$/.test(value)) return 'La placa debe tener el formato ABC1234 (3 letras + 4 números)';
    return null;
  };

  // Validación de archivo (licencia o matrícula)
  const validateFile = (file: File | null): string | null => {
    if (!file) return null;

    // Validar formato
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return 'Solo se admiten formatos PNG, JPG o JPEG';
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return `El archivo es muy grande (${sizeMB}MB). Máximo 2MB permitidos`;
    }

    return null;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePlacaChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setFormData(prev => ({ ...prev, placa: upperValue }));
    if (errors.placa) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.placa;
        return newErrors;
      });
    }
  };

  const handleFileChange = (field: 'licencia' | 'matricula', file: File | null) => {
    const error = validateFile(file);

    if (error) {
      setFileErrors(prev => ({ ...prev, [field]: error }));
      // No asignar el archivo si hay error
      setFormData(prev => ({ ...prev, [field]: null }));
    } else {
      // Limpiar error si el archivo es válido
      setFileErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  // Validación del Step 1
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    const marcaError = validateMarca(formData.marca);
    if (marcaError) newErrors.marca = marcaError;

    const modeloError = validateModelo(formData.modelo);
    if (modeloError) newErrors.modelo = modeloError;

    const colorError = validateColor(formData.color);
    if (colorError) newErrors.color = colorError;

    const placaError = validatePlaca(formData.placa);
    if (placaError) newErrors.placa = placaError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validación del Step 2
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.paypalEmail.trim()) {
      newErrors.paypalEmail = 'El email no puede estar vacío';
    } else if (!formData.paypalEmail.includes('@')) {
      newErrors.paypalEmail = 'Ingresa un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStep1Valid = validateMarca(formData.marca) === null &&
    validateModelo(formData.modelo) === null &&
    validateColor(formData.color) === null &&
    validatePlaca(formData.placa) === null;

  const isStep2Valid = formData.paypalEmail.trim() && formData.paypalEmail.includes('@');
  const isStep3Valid = formData.licencia && formData.matricula;

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await submitDriverApplication({
        paypalEmail: formData.paypalEmail,
        licencia: formData.licencia!,
        matricula: formData.matricula!,
        marca: formData.marca,
        modelo: formData.modelo,
        color: formData.color,
        placa: formData.placa,
        asientos: parseInt(formData.asientos),
      });

      if (response.success) {
        toast.success('¡Solicitud enviada!', {
          description: 'Tu solicitud para ser conductor está siendo revisada. Te notificaremos pronto.'
        });

        // Refrescar datos después de envío exitoso
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }

        setStep(1);
        setFormData({
          marca: '',
          modelo: '',
          color: '',
          placa: '',
          asientos: '4',
          paypalEmail: '',
          licencia: null,
          matricula: null,
        });
        setErrors({});
        setFileErrors({});
        onOpenChange(false);
      } else {
        toast.error('Error al enviar solicitud', {
          description: response.message || 'Error al crear la solicitud'
        });
      }
    } catch (error) {
      toast.error('Error al enviar solicitud', {
        description: 'Ocurrió un error inesperado. Intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setErrors({});
    onOpenChange(false);
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  return (
    <>
      <FullScreenLoader isOpen={isLoading} message="Enviando solicitud..." />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-(--primary)" />
              Solicitud de Conductor
            </DialogTitle>
            <DialogDescription>
              Paso {step} de 3 - {step === 1 ? 'Datos del Vehículo' : step === 2 ? 'Método de Pago' : 'Documentos'}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="flex gap-2 pt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-(--primary)' : 'bg-(--muted)'
                  }`}
              />
            ))}
          </div>

          <div className="py-4">
            {/* Step 1: Vehicle Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="px-4 bg-(--muted)/50 rounded-lg">
                  <p className="text-sm text-(--muted-foreground)">
                    Ingresa los datos de tu vehículo. Estos serán visibles para los pasajeros.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca *</Label>
                    <Input
                      id="marca"
                      placeholder="Ej: Toyota"
                      value={formData.marca}
                      onChange={(e) => handleInputChange('marca', e.target.value)}
                      className={errors.marca ? 'border-(--destructive)' : ''}
                    />
                    {errors.marca && (
                      <p className="text-xs text-(--destructive) flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.marca}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo *</Label>
                    <Input
                      id="modelo"
                      placeholder="Ej: Corolla"
                      value={formData.modelo}
                      onChange={(e) => handleInputChange('modelo', e.target.value)}
                      className={errors.modelo ? 'border-(--destructive)' : ''}
                    />
                    {errors.modelo && (
                      <p className="text-xs text-(--destructive) flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.modelo}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color *</Label>
                    <select
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border border-(--input) bg-(--background) text-sm ring-offset-background placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring) focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.color ? 'border-(--destructive)' : ''}`}
                    >
                      <option value="">Selecciona un color</option>
                      {COLORS.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                    {errors.color && (
                      <p className="text-xs text-(--destructive) flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.color}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placa">Placa *</Label>
                    <Input
                      id="placa"
                      placeholder="Ej: ABC1234"
                      value={formData.placa}
                      onChange={(e) => handlePlacaChange(e.target.value)}
                      maxLength={7}
                      className={errors.placa ? 'border-(--destructive)' : ''}
                    />
                    {errors.placa && (
                      <p className="text-xs text-(--destructive) flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.placa}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asientos">Asientos Disponibles *</Label>
                  <select
                    id="asientos"
                    value={formData.asientos}
                    onChange={(e) => handleInputChange('asientos', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-(--input) bg-(--background) text-sm ring-offset-background placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring) focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {Array.from({ length: 7 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num.toString()}>
                        {num} asiento{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-(--muted-foreground)">Sin contar el asiento del conductor</p>
                </div>
              </div>
            )}

            {/* Step 2: Payment Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="p-4 bg-(--muted)/50 rounded-lg">
                  <p className="text-sm text-(--muted-foreground)">
                    Configura tu método de pago para recibir el dinero de tus viajes.
                  </p>
                </div>

                <div className="p-4 border border-(--border) rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">PP</span>
                    </div>
                    <div>
                      <p className="font-medium text-(--foreground)">PayPal</p>
                      <p className="text-sm text-(--muted-foreground)">Recibe pagos de forma segura</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail">Email de PayPal *</Label>
                    <Input
                      id="paypalEmail"
                      type="email"
                      placeholder="tu-email@paypal.com"
                      value={formData.paypalEmail}
                      onChange={(e) => {
                        handleInputChange('paypalEmail', e.target.value);
                      }}
                      className={errors.paypalEmail ? 'border-(--destructive)' : ''}
                    />
                    {errors.paypalEmail && (
                      <p className="text-xs text-(--destructive) flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.paypalEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-(--info)/10 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-(--info) shrink-0 mt-0.5" />
                  <p className="text-sm text-(--muted-foreground)">
                    Asegúrate de usar el email correcto. Los pagos se enviarán a esta cuenta.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-(--muted)/50 rounded-lg">
                  <p className="text-sm text-(--muted-foreground)">
                    Sube los documentos requeridos para verificar tu identidad y vehículo.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Licencia de Conducir (Frontal)</Label>
                    <div className="border-2 border-dashed border-(--border) rounded-lg p-6 text-center hover:border-(--primary)/50 transition-colors">
                      <input
                        type="file"
                        id="licencia"
                        className="hidden"
                        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                        onChange={(e) => handleFileChange('licencia', e.target.files?.[0] || null)}
                      />
                      <label htmlFor="licencia" className="cursor-pointer">
                        {formData.licencia ? (
                          <div className="flex items-center justify-center gap-2 text-(--success)">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>{formData.licencia.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-(--muted-foreground) mx-auto mb-2" />
                            <p className="text-sm text-(--muted-foreground)">
                              Haz clic para subir o arrastra el archivo
                            </p>
                            <p className="text-xs text-(--muted-foreground) mt-1">
                              PNG, JPG o JPEG (máximo 2MB)
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                    {fileErrors.licencia && (
                      <p className="text-xs text-(--destructive) flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {fileErrors.licencia}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Matrícula del Vehículo (Frontal)</Label>
                    <div className="border-2 border-dashed border-(--border) rounded-lg p-6 text-center hover:border-(--primary)/50 transition-colors">
                      <input
                        type="file"
                        id="matricula"
                        className="hidden"
                        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                        onChange={(e) => handleFileChange('matricula', e.target.files?.[0] || null)}
                      />
                      <label htmlFor="matricula" className="cursor-pointer">
                        {formData.matricula ? (
                          <div className="flex items-center justify-center gap-2 text-(--success)">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>{formData.matricula.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-(--muted-foreground) mx-auto mb-2" />
                            <p className="text-sm text-(--muted-foreground)">
                              Haz clic para subir o arrastra el archivo
                            </p>
                            <p className="text-xs text-(--muted-foreground) mt-1">
                              PNG, JPG o JPEG (máximo 2MB)
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                    {fileErrors.matricula && (
                      <p className="text-xs text-(--destructive) flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {fileErrors.matricula}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            ) : (
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
            )}

            {step < 3 ? (
              <Button
                onClick={handleNextStep}
                className="flex-1"
                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={!isStep3Valid || isLoading}
              >
                Enviar Solicitud
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
