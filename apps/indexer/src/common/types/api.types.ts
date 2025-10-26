export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  requestId?: string;
}

export interface JwtPayload {
  sub: string;
  solanaAddress?: string;
  tronAddress?: string;
  iat?: number;
  exp?: number;
}

export interface UserProfile {
  id: string;
  solanaAddress?: string;
  tronAddress?: string;
  email?: string;
  isKycVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
