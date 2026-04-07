require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const dialect = (process.env.DB_DIALECT || 'mysql').toLowerCase();
const defaultPort = dialect === 'postgres' ? 5432 : 3306;

const common = {
  dialect,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || defaultPort,
  database: process.env.DB_NAME || 'handwerkerregion',
  username: process.env.DB_USER || (dialect === 'postgres' ? 'postgres' : 'root'),
  password: process.env.DB_PASSWORD || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};

module.exports = {
  development: { ...common },
  test: {
    ...common,
    database: process.env.DB_NAME_TEST || `${common.database}_test`,
    logging: false,
  },
  production: { ...common },
};
