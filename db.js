const { Pool } = require("pg");
require("dotenv").config();

const devConfig = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
};

const proConfig = {
  connectionString: process.env.DATABASE_URL, //DATABASE_URL will be coming from Heroku PostgreSQL add on when it's in production
};

const pool = new Pool(
  process.env.NODE_ENV === "production" ? proConfig : devConfig
);

/*
const pool = new Pool({
  user: "postgres",
  password: "dospek20",
  host: "localhost",
  port: 5432,
  database: "ipa_app",
});
*/

module.exports = pool;
