export interface TokenPayload {
  exp: number;
  iat: number;
  sub: string;
  jti: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
