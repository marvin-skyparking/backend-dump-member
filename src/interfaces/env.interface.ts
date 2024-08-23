export interface IEnvInterface {
  NODE_ENV: string;
  APP_URL: string;
  PORT: string;
  DB_DEV: string;
  USERNAME_DB_DEV: string;
  PASSWORD_DB_DEV: string;
  ENABLE_SWAGGER: boolean;
  SENTRY_URI: string;
  SENTRY_ENABLE: boolean;
  JWT_SECRET: string;
  BAYARIND_DEV_URL: string;
  ENCRYPTION_KEY: string;
  WMS_F: number;
  MAX_F: number;
  WMS_S: number;
  MAX_S: number;
}
