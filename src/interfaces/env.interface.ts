export interface IEnvInterface {
  NODE_ENV: string;
  DB_HOST: string;
  APP_URL: string;
  PORT: string;
  DB_PROD: string;
  USERNAME_DB_PROD: string;
  PASSWORD_DB_PROD: string;
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
  FONTE_TOKEN: string;
  FONTE_ENDPOINT: string;
}
