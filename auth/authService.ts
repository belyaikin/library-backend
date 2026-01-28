import bcrypt from "bcrypt";
import {
  AuthResult,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  TokenVerificationResult,
  RefreshResult,
} from "./types.js";
import {
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken,
  revokeToken,
  revokeTokens,
  extractTokenFromHeader,
  decodeToken,
} from "./jwt.js";

// Конфигурация bcrypt
const SALT_ROUNDS = 10;


const userRefreshTokens = new Map<string, Set<string>>();


export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 
 * @param userId 
 * @param password 
 * @param storedPasswordHash 
 * @param email 
 */

export async function login(
  userId: string,
  password: string,
  storedPasswordHash: string,
  email?: string
): Promise<AuthResult> {

  const isPasswordValid = await comparePassword(password, storedPasswordHash);

  if (!isPasswordValid) {
    return {
      success: false,
      message: "Invalid credentials",
    };
  }

  const tokens = generateTokenPair(userId, email);

  storeRefreshToken(userId, tokens.refreshToken);

  return {
    success: true,
    message: "Login successful",
    tokens,
    userId,
  };
}

/**
 * @param accessToken 
 * @param refreshToken 
 */
export function logout(accessToken?: string, refreshToken?: string): AuthResult {
  const tokensToRevoke: string[] = [];

  if (accessToken) {
    tokensToRevoke.push(accessToken);
  }

  if (refreshToken) {
    tokensToRevoke.push(refreshToken);

    const decoded = decodeToken(refreshToken);
    if (decoded?.userId) {
      removeRefreshToken(decoded.userId, refreshToken);
    }
  }

  if (tokensToRevoke.length > 0) {
    revokeTokens(tokensToRevoke);
  }

  return {
    success: true,
    message: "Logout successful",
  };
}

/**
 * @param userId 
 * @param currentAccessToken 
 */
export function logoutAllDevices(userId: string, currentAccessToken?: string): AuthResult {
  const userTokens = userRefreshTokens.get(userId);
  if (userTokens) {
    revokeTokens(Array.from(userTokens));
    userRefreshTokens.delete(userId);
  }

  if (currentAccessToken) {
    revokeToken(currentAccessToken);
  }

  return {
    success: true,
    message: "Logged out from all devices",
  };
}

export function validateAccessToken(token: string): TokenVerificationResult {
  return verifyAccessToken(token);
}

export function validateRefreshToken(token: string): TokenVerificationResult {
  const result = verifyRefreshToken(token);

  if (result.valid && result.payload?.userId) {
    const userTokens = userRefreshTokens.get(result.payload.userId);
    if (!userTokens || !userTokens.has(token)) {
      return {
        valid: false,
        expired: false,
        error: "Refresh token not found in active sessions",
      };
    }
  }

  return result;
}

export function refreshToken(refreshTokenValue: string): RefreshResult {
  const validation = validateRefreshToken(refreshTokenValue);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  return refreshAccessToken(refreshTokenValue);
}

export function refreshTokenPair(oldRefreshToken: string): {
  success: boolean;
  tokens?: AuthTokens;
  error?: string;
} {
  const validation = validateRefreshToken(oldRefreshToken);

  if (!validation.valid || !validation.payload) {
    return {
      success: false,
      error: validation.error || "Invalid refresh token",
    };
  }

  const { userId, email } = validation.payload;

  revokeToken(oldRefreshToken);
  removeRefreshToken(userId, oldRefreshToken);

  const tokens = generateTokenPair(userId, email);
  storeRefreshToken(userId, tokens.refreshToken);

  return {
    success: true,
    tokens,
  };
}

export function validateAuthHeader(authHeader: string | undefined): TokenVerificationResult {
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return {
      valid: false,
      expired: false,
      error: "No token provided or invalid format",
    };
  }

  return validateAccessToken(token);
}

export function isAuthenticated(authHeader: string | undefined): boolean {
  const result = validateAuthHeader(authHeader);
  return result.valid;
}

export function getUserIdFromHeader(authHeader: string | undefined): string | null {
  const result = validateAuthHeader(authHeader);
  if (result.valid && result.payload?.userId) {
    return result.payload.userId;
  }
  return null;
}

export async function preparePasswordForRegistration(password: string): Promise<string> {
  return hashPassword(password);
}

export function createTokensForNewUser(userId: string, email?: string): AuthTokens {
  const tokens = generateTokenPair(userId, email);
  storeRefreshToken(userId, tokens.refreshToken);
  return tokens;
}

export function getActiveSessionsCount(userId: string): number {
  const userTokens = userRefreshTokens.get(userId);
  return userTokens ? userTokens.size : 0;
}

function storeRefreshToken(userId: string, token: string): void {
  if (!userRefreshTokens.has(userId)) {
    userRefreshTokens.set(userId, new Set());
  }
  userRefreshTokens.get(userId)!.add(token);
}

function removeRefreshToken(userId: string, token: string): void {
  const userTokens = userRefreshTokens.get(userId);
  if (userTokens) {
    userTokens.delete(token);
    if (userTokens.size === 0) {
      userRefreshTokens.delete(userId);
    }
  }
}

export const _testHelpers = {
  clearAllSessions: () => userRefreshTokens.clear(),
  getUserRefreshTokens: (userId: string) => userRefreshTokens.get(userId),
};
