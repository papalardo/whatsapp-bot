import path from 'path';
import Env from './core/env.js';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const development = {
  client: 'pg',
  connection: Env.get('DATABASE_URL'),
  migrations: {
    directory: path.join(path.resolve(), '/database/migrations'),
  },
  seeds: {
    directory: path.join(path.resolve(), '/database/seeds')
  }
};

export default {

  development,

  production: {
    ...development,
    pool: {
      min: 2,
      max: 10
    },
  }

};
