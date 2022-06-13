import knex from 'knex';
import configuration from '../knexfile.js';
import paginate from 'knex-paginate';

const environment = process.env.NODE_ENV || 'development';
const connection = knex(configuration[environment]);

paginate.attachPaginate();

export default connection;