import { SequelizeOptions } from 'sequelize-typescript';
import EnvConfig from './envConfig';

const config: { [key: string]: SequelizeOptions } = {
  development: {
    username: EnvConfig.USERNAME_DB_PROD,
    password: EnvConfig.PASSWORD_DB_PROD,
    database: EnvConfig.DB_PROD,
    host: EnvConfig.DB_HOST,
    dialect: 'mysql',
    models: [__dirname + '/../models']
  },
  test: {
    username: 'root',
    password: '',
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    models: [__dirname + '/../models']
  },
  production: {
    username: EnvConfig.USERNAME_DB_PROD,
    password: EnvConfig.PASSWORD_DB_PROD,
    database: EnvConfig.DB_PROD,
    host: EnvConfig.DB_HOST,
    dialect: 'mysql',
    models: [__dirname + '/../models']
  }
};

export default config;
