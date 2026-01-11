'use server';

import { ApiResponse } from "../../interfaces";
import { approveDriverDocument, rejectDriverDocument } from "./manageDriverDocument";
import { approveDriverRequest, rejectDriverRequest } from "./manageDriverRequest";
import { createErrorResponse } from "../../lib/action-helpers";

export const approveDriverWithDocuments = async (driverId: string, documentIds: string[]): Promise<ApiResponse<null>> => {
  try {
    const documentResults = await Promise.all(
      documentIds.map(docId => approveDriverDocument(docId))
    );

    const anyDocumentFailed = documentResults.some(result => !result.success);
    if (anyDocumentFailed) {
      return createErrorResponse<null>("Error al aprobar algunos documentos");
    }

    const requestResult = await approveDriverRequest(driverId);

    if (!requestResult.success) {
      return createErrorResponse<null>("Error al aprobar la solicitud del conductor");
    }

    return {
      success: true,
      data: null,
      error: null,
      message: "Solicitud y documentos aprobados exitosamente",
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    return createErrorResponse<null>("Error al procesar la aprobación");
  }
};

export const rejectDriverWithDocuments = async (driverId: string, documentIds: string[], reason: string): Promise<ApiResponse<null>> => {
  try {
    // Primero rechazar todos los documentos
    const documentResults = await Promise.all(
      documentIds.map(docId => rejectDriverDocument(docId, reason))
    );

    // Verificar que todos los documentos se rechazaron
    const anyDocumentFailed = documentResults.some(result => !result.success);
    if (anyDocumentFailed) {
      return createErrorResponse<null>("Error al rechazar algunos documentos");
    }

    // Si todos los documentos se rechazaron, rechazar la solicitud
    const requestResult = await rejectDriverRequest(driverId, reason);

    if (!requestResult.success) {
      return createErrorResponse<null>("Error al rechazar la solicitud del conductor");
    }

    return {
      success: true,
      data: null,
      error: null,
      message: "Solicitud y documentos rechazados exitosamente",
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    return createErrorResponse<null>("Error al procesar el rechazo");
  }
};
