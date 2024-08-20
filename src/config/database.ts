import { Sequelize } from 'sequelize';
import EnvConfig from './envConfig';

const sequelize = new Sequelize(
  EnvConfig.DB_DEV,
  EnvConfig.USERNAME_DB_DEV,
  EnvConfig.PASSWORD_DB_DEV,
  {
    host: '8.215.44.147',
    dialect: 'mariadb',
    logging: false
  }
);

export default sequelize;
