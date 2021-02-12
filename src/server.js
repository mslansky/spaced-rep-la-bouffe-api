'use strict';
require('dotenv').config();

const knex = require('knex');
const app = require('./app');
const { PORT, DB_URL } = require('./config');

const pg = require('pg');
pg.defaults.ssl = {
  rejectUnauthorized: false,
};


const db = knex({
  client: 'pg',
  connection: DB_URL,
  ssl: { rejectUnauthorized: false }
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
