const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const db = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = db;
