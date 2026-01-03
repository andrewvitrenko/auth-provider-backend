export interface JwtPayload {
  sub: string;
  email: string;
  sid: string;
}

export interface SessionTokens {
  access_token: string;
  refresh_token: string;
}
