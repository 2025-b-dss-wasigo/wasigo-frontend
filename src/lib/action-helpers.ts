/**
 * Helpers para trabajar con Server Actions
 * Facilita el manejo de errores y respuestas
 */

import { ApiResponse } from "../interfaces";


/**
 * Tipo para el callback de éxito
 */
export type SuccessCallback<T> = (data: T) => void | Promise<void>;

/**
 * Tipo para el callback de error
 */
export type ErrorCallback = (error: string) => void | Promise<void>;

/**
 * Ejecuta una Server Action con manejo automático de errores
 * @param action - La Server Action a ejecutar
 * @param onSuccess - Callback ejecutado si la acción es exitosa
 * @param onError - Callback ejecutado si hay error
 */
export async function executeAction<T>(
  action: () => Promise<ApiResponse<T>>,
  onSuccess?: SuccessCallback<T>,
  onError?: ErrorCallback,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await action();

    if (response.error) {
      const errorMessage = response.error;
      if (onError) await onError(errorMessage);
      return { success: false, error: errorMessage };
    }

    if (response.data && onSuccess) {
      await onSuccess(response.data);
    }

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    if (onError) await onError(errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Hook-like function para usar Server Actions con loading y error states
 * Uso:
 * const { execute, loading, error } = useServerAction(bookingCreate);
 * await execute(bookingData);
 */
export function createActionHandler<T, P extends any[]>(
  action: (...args: P) => Promise<ApiResponse<T>>,
) {
  return {
    async execute(...args: P): Promise<{ success: boolean; data?: T; error?: string }> {
      try {
        const response = await action(...args);

        if (response.error) {
          return { success: false, error: response.error };
        }

        return { success: true, data: response.data };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        return { success: false, error: errorMessage };
      }
    },
  };
}

/**
 * Valida que una acción fue exitosa
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
  return !response.error && response.data !== undefined;
}

/**
 * Obtiene el mensaje de error de una respuesta
 */
export function getErrorMessage(response: ApiResponse<any>): string {
  if (response.error) {
    return response.error;
  }
  if (response.message) {
    return response.message;
  }
  return 'Error desconocido';
}

/**
 * Crea una respuesta de error genérica
 * @param message - Mensaje de error personalizado
 * @returns Respuesta de error con el tipo genérico especificado
 */
export function createErrorResponse<T>(message: string): ApiResponse<T> {
  return {
    success: false,
    message,
    data: null,
  } as unknown as ApiResponse<T>;
}
