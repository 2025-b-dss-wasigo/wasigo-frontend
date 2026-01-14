"use server";

import { redirect } from "next/navigation";
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken
} from "@/actions";
import { ApiResponse, RefreshTokenResponse } from "@/interfaces";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const attemptTokenRefresh = async (): Promise<boolean> => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await deleteRefreshToken();
    redirect("/login");
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cache-Control", "no-cache, no-store, must-revalidate");
  myHeaders.append("Pragma", "no-cache");
  myHeaders.append("Expires", "0");

  const raw = JSON.stringify({
    "refreshToken": refreshToken
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
    cache: "no-store"
  };

  const response = await fetch(`${BACKEND_URL}/auth/refresh`, requestOptions)
  const result: ApiResponse<RefreshTokenResponse> = await response.json();
  if (result.success && result.data) {
    const { accessToken, expiresIn, refreshToken, refreshExpiresIn } = result.data;
    await setAccessToken(accessToken, expiresIn);
    await setRefreshToken(refreshToken, refreshExpiresIn);
    return true;
  }

  await deleteAccessToken();
  await deleteRefreshToken();
  redirect("/login");
}

export const fetchWithToken = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {

  const fullUrl = url.startsWith("http") ? url : `${BACKEND_URL}${url}`;
  const setAuthHeaders = async (): Promise<Headers> => {

    const token = await getAccessToken();
    const headers = new Headers(options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const method = (options.method || "GET").toString().toUpperCase();
    const body = options.body as any;

    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    const isURLSearchParams = typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams;

    if (!headers.get("Content-Type") && method !== "GET" && !isFormData && !isURLSearchParams) {
      headers.set("Content-Type", "application/json");
    }

    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    return headers;
  };

  // Obtener token actual
  let token = await getAccessToken();

  // Si no hay token, intentar refresh
  if (!token) {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      const refreshed = await attemptTokenRefresh();
      if (!refreshed) {
        redirect("/login");
      }
    } else {
      redirect("/login");
    }
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers: await setAuthHeaders(),
    credentials: 'include',
    cache: 'no-store'
  };

  const response: Response = await fetch(fullUrl, fetchOptions);
  let result: ApiResponse<T> = await response.json();

  if (result.statusCode === 401) {

    const refreshed = await attemptTokenRefresh();

    if (refreshed) {
      const response = await fetch(fullUrl, fetchOptions);
      result = await response.json();
    }

  }

  return result;
};
