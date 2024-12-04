const { Pool } = require("pg");

const pool = new Pool({
    user: "root",
    host: "db",
    database: "flights",
    password: "root",
    port: 5432,
    dialect: "postgres",
});

module.exports = pool;

