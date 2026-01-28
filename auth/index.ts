// Типы
export type {
  TokenPayload,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  AuthResult,
  TokenVerificationResult,
  RefreshResult,
} from "./types.js";

// JWT утилиты
export {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken,
  revokeToken,
  revokeTokens,
  isTokenRevoked,
  clearRevokedTokens,
  decodeToken,
  extractTokenFromHeader,
} from "./jwt.js";

// Auth сервис
export {
  hashPassword,
  comparePassword,
  login,
  logout,
  logoutAllDevices,
  validateAccessToken,
  validateRefreshToken,
  refreshToken,
  refreshTokenPair,
  validateAuthHeader,
  isAuthenticated,
  getUserIdFromHeader,
  preparePasswordForRegistration,
  createTokensForNewUser,
  getActiveSessionsCount,
} from "./authService.js";
