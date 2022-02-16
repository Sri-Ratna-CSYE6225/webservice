const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.db.database, dbConfig.db.user, dbConfig.db.password, {
  host: dbConfig.db.host,
  dialect: dbConfig.db.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.db.pool.max,
    min: dbConfig.db.pool.min,
    acquire: dbConfig.db.pool.acquire,
    idle: dbConfig.db.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./users.js")(sequelize, Sequelize);
module.exports = db