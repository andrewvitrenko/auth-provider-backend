export interface IEnv {
  DATABASE_URL: string;
  SHADOW_DATABASE_URL: string;
  PORT?: number;
  ACCESS_TOKEN_SECRET: string;
}
