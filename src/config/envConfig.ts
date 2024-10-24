import dotenv from 'dotenv';
import { IEnvInterface } from '../interfaces/env.interface';

dotenv.config();

const ENV: any = process.env;
const EnvConfig: IEnvInterface = ENV;

// if (EnvConfig.NODE_ENV !== 'production') {
//   EnvConfig.SENTRY_ENABLE = false;
//   EnvConfig.ENABLE_CLUSTER = false;
//   EnvConfig.APP_CORES = 1;
// }

if (EnvConfig.NODE_ENV == 'production') {
  EnvConfig.APP_URL = EnvConfig.APP_URL;
  EnvConfig.DB_PROD = EnvConfig.DB_PROD ;
  EnvConfig.ENABLE_SWAGGER = EnvConfig.ENABLE_SWAGGER;
  EnvConfig.PORT = EnvConfig.PORT;
  EnvConfig.USERNAME_DB_PROD = EnvConfig.USERNAME_DB_PROD;
  EnvConfig.PASSWORD_DB_PROD = EnvConfig.PASSWORD_DB_PROD;
  EnvConfig.SENTRY_URI = EnvConfig.SENTRY_URI ?? '';
  EnvConfig.SENTRY_ENABLE = EnvConfig.SENTRY_ENABLE ?? false;
  EnvConfig.JWT_SECRET = EnvConfig.JWT_SECRET ?? 'skyparking';
  EnvConfig.BAYARIND_DEV_URL =
  EnvConfig.BAYARIND_DEV_URL ?? 'https://snaptest.bayarind.id';
  EnvConfig.WMS_F = EnvConfig.WMS_F ?? 1;
  EnvConfig.MAX_F = EnvConfig.MAX_F ?? 5;
  EnvConfig.WMS_S = EnvConfig.WMS_S ?? 1;
  EnvConfig.MAX_S = EnvConfig.MAX_S ?? 5;
  EnvConfig.FONTE_ENDPOINT =
  EnvConfig.FONTE_ENDPOINT ?? 'https://api.fonnte.com/send';
  EnvConfig.FONTE_TOKEN = EnvConfig.FONTE_TOKEN ?? 'FrkqWjdXi31Wph2UbdMh';
}
export default EnvConfig;
