'use server';

import { fetchWithToken } from "..";
import { ApiResponse, UploadDriverDocumentResponse } from "../../interfaces";
import { createErrorResponse } from "../../lib/action-helpers";

type tipoDocumento = 'LICENCIA' | 'MATRICULA';

export const uploadDriverDocument = async (file: File, tipo: tipoDocumento): Promise<ApiResponse<UploadDriverDocumentResponse>> => {

  try {

    const formdata = new FormData();
    formdata.append("file", file);

    const requestOptions: RequestInit = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    const result = await fetchWithToken<UploadDriverDocumentResponse>(`/drivers/documents/${tipo}`, requestOptions);
    return result;

  } catch (error) {

    return createErrorResponse<UploadDriverDocumentResponse>('Error al subir el documento');

  }

}