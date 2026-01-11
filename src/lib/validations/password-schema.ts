export const validateNombre = (nombre: string): string | null => {
  if (nombre.length < 3) return 'Mínimo 3 caracteres';
  if (nombre.length > 15) return 'Máximo 15 caracteres';
  if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/.test(nombre)) return 'Solo letras y espacios';
  return null;
};

export const validateApellido = (apellido: string): string | null => {
  if (apellido.length < 3) return 'Mínimo 3 caracteres';
  if (apellido.length > 15) return 'Máximo 15 caracteres';
  if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/.test(apellido)) return 'Solo letras y espacios';
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email.includes('@')) return 'Debe contener @';
  if (!email.endsWith('@epn.edu.ec')) return 'Solo correos @epn.edu.ec';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 7) return 'Mínimo 7 caracteres';
  if (password.length > 20) return 'Máximo 20 caracteres';
  if (!/[a-z]/.test(password)) return 'Debe incluir una letra minúscula';
  if (!/[A-Z]/.test(password)) return 'Debe incluir una letra mayúscula';
  if (!/\d/.test(password)) return 'Debe incluir un número';
  if (!/[!@#$%^&*.]/.test(password)) return 'Debe incluir un carácter especial (!@#$%^&*)';
  return null;
};

export const validateCelular = (celular: string): string | null => {
  if (!celular) return 'Requerido';
  if (!/^09\d{8}$/.test(celular)) return 'Formato: 09XXXXXXXX';
  return null;
};

export const isCelularValid = (celular: string): boolean => {
  return /^09\d{8}$/.test(celular);
};