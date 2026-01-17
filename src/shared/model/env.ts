export interface IEnv {
  DATABASE_URL: string;
  PORT?: number;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
}
