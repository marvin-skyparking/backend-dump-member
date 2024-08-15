import { SequelizeOptions } from 'sequelize-typescript';

const config: { [key: string]: SequelizeOptions } = {
  development: {
    username: 'root',
    password: '50p4y5ky0v0!',
    database: 'db_skyccc',
    host: '8.215.44.147',
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
    username: 'root',
    password: '',
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
    models: [__dirname + '/../models']
  }
};

export default config;
