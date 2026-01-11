'use server';

import { ApiResponse } from "../../interfaces";
import { AuthResponse } from "../../interfaces/responses/auth/AuthResponse.interface";
import { createErrorResponse } from "../../lib/action-helpers";
import { setAccessToken, setRefreshToken } from "../cookies/manage-cookies";

export interface LoginCredentials {
  email: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function authLogin(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {

  try {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(credentials);

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, requestOptions)
    const result: ApiResponse<AuthResponse> = await response.json()

    if (result.success) {
      if (result.data) {
        const { accessToken, expiresIn, refreshToken, refreshExpiresIn } = result.data;
        await setAccessToken(accessToken, expiresIn);
        await setRefreshToken(refreshToken, refreshExpiresIn);
      }
    }

    return result;

  } catch (error) {
    console.log(error)
    return createErrorResponse<AuthResponse>("Login failed");
  }

}