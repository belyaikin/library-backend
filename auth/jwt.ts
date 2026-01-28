import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import {
  TokenPayload,
  AuthTokens,
  TokenVerificationResult,
  RefreshResult,
} from "./types.js";

const JWT_CONFIG = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || "access-secret-key-change-in-production",
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "refresh-secret-key-change-in-production",
  accessTokenExpirySeconds: Number(process.env.JWT_ACCESS_EXPIRY_SECONDS) || 900, // 15 минут
  refreshTokenExpirySeconds: Number(process.env.JWT_REFRESH_EXPIRY_SECONDS) || 604800, // 7 дней
};

const revokedTokens = new Set<string>();

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_CONFIG.accessTokenSecret, {
    expiresIn: JWT_CONFIG.accessTokenExpirySeconds,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_CONFIG.refreshTokenSecret, {
    expiresIn: JWT_CONFIG.refreshTokenExpirySeconds,
  });
}

export function generateTokenPair(userId: string, email?: string): AuthTokens {
  const payload: TokenPayload = {
    userId,
    email,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export function verifyAccessToken(token: string): TokenVerificationResult {

  if (revokedTokens.has(token)) {
    return {
      valid: false,
      expired: false,
      error: "Token has been revoked",
    };
  }

  try {
    const payload = jwt.verify(token, JWT_CONFIG.accessTokenSecret) as TokenPayload;
    return {
      valid: true,
      expired: false,
      payload,
    };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return {
        valid: false,
        expired: true,
        error: "Token has expired",
      };
    }
    if (error instanceof JsonWebTokenError) {
      return {
        valid: false,
        expired: false,
        error: "Invalid token",
      };
    }
    return {
      valid: false,
      expired: false,
      error: "Token verification failed",
    };
  }
}

export function verifyRefreshToken(token: string): TokenVerificationResult {
  if (revokedTokens.has(token)) {
    return {
      valid: false,
      expired: false,
      error: "Token has been revoked",
    };
  }

  try {
    const payload = jwt.verify(token, JWT_CONFIG.refreshTokenSecret) as TokenPayload;
    return {
      valid: true,
      expired: false,
      payload,
    };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return {
        valid: false,
        expired: true,
        error: "Refresh token has expired",
      };
    }
    if (error instanceof JsonWebTokenError) {
      return {
        valid: false,
        expired: false,
        error: "Invalid refresh token",
      };
    }
    return {
      valid: false,
      expired: false,
      error: "Refresh token verification failed",
    };
  }
}

export function refreshAccessToken(refreshToken: string): RefreshResult {
  const verification = verifyRefreshToken(refreshToken);

  if (!verification.valid || !verification.payload) {
    return {
      success: false,
      error: verification.error || "Invalid refresh token",
    };
  }

  const newAccessToken = generateAccessToken({
    userId: verification.payload.userId,
    email: verification.payload.email,
  });

  return {
    success: true,
    accessToken: newAccessToken,
  };
}

export function revokeToken(token: string): void {
  revokedTokens.add(token);
}

export function revokeTokens(tokens: string[]): void {
  tokens.forEach((token) => revokedTokens.add(token));
}

export function isTokenRevoked(token: string): boolean {
  return revokedTokens.has(token);
}

export function clearRevokedTokens(): void {
  revokedTokens.clear();
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload | null;
    return decoded;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}
