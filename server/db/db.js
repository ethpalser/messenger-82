const Sequelize = require("sequelize");

const db = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = db;
