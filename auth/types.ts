import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  userId: string;
  email?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email?: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  tokens?: AuthTokens;
  userId?: string;
}

export interface TokenVerificationResult {
  valid: boolean;
  expired: boolean;
  payload?: TokenPayload;
  error?: string;
}

export interface RefreshResult {
  success: boolean;
  accessToken?: string;
  error?: string;
}
