import { Sequelize } from 'sequelize';
import EnvConfig from './envConfig';

const sequelize = new Sequelize(
  EnvConfig.DB_PROD,
  EnvConfig.USERNAME_DB_PROD,
  EnvConfig.PASSWORD_DB_PROD,
  {
    host: EnvConfig.DB_HOST,
    dialect: 'mariadb',
    logging: false,
    dialectOptions: {
      connectTimeout: 60000 // 60 seconds
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
