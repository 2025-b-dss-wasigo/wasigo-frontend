'use server';

import { ApiResponse } from "@/interfaces";
import { createErrorResponse } from "../../lib/action-helpers";

export interface ForgotPasswordRequest {
  email: string;
}

export async function authForgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {

  try {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(data);

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch("localhost:3000/api/auth/forgot-password", requestOptions)
    return await response.json();

  } catch (error) {

    return createErrorResponse<{ message: string }>("Error del servidor");

  }

}