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

if (EnvConfig.NODE_ENV === 'development') {
  EnvConfig.APP_URL = EnvConfig.APP_URL ?? 'http://localhost:9000';
  EnvConfig.DB_DEV = EnvConfig.DB_DEV ?? 'db_skyccc';
  EnvConfig.ENABLE_SWAGGER = EnvConfig.ENABLE_SWAGGER ?? true;
  EnvConfig.PORT = EnvConfig.PORT ?? 3306;
  EnvConfig.USERNAME_DB_DEV = EnvConfig.USERNAME_DB_DEV ?? 'root';
  EnvConfig.PASSWORD_DB_DEV = EnvConfig.PASSWORD_DB_DEV ?? '50p4y5ky0v0!';
  EnvConfig.SENTRY_URI = EnvConfig.SENTRY_URI ?? '';
  EnvConfig.SENTRY_ENABLE = EnvConfig.SENTRY_ENABLE ?? false;
  EnvConfig.JWT_SECRET = EnvConfig.JWT_SECRET ?? 'skyparking';
  EnvConfig.BAYARIND_DEV_URL =
    EnvConfig.BAYARIND_DEV_URL ?? 'https://snaptest.bayarind.id';
  EnvConfig.WMS_F = EnvConfig.WMS_F ?? 1;
  EnvConfig.MAX_F = EnvConfig.MAX_F ?? 5;
  EnvConfig.WMS_S = EnvConfig.WMS_S ?? 1;
  EnvConfig.MAX_S = EnvConfig.MAX_S ?? 5;
}
export default EnvConfig;
