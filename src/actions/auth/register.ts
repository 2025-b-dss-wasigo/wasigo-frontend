'use server'

import { ApiResponse, RegisterResponse } from "@/interfaces";
import { createErrorResponse } from "@/lib/action-helpers";

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  password: string;
  confirmPassword: string;
}

export async function authRegister(data: RegisterData): Promise<ApiResponse<RegisterResponse>> {

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

    const response = await fetch("localhost:3000/api/auth/register", requestOptions)
    return await response.json();

  } catch (error) {

    return createErrorResponse<RegisterResponse>("Registration failed");

  }

}