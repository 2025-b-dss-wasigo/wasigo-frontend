export interface ApiResponse<T> {
  error: any;
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  code?: string;
  timestamp: string;
}