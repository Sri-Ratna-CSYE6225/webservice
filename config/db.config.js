const env = process.env;

const config = {
  db: {
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || 'Ratna@18',
    database: env.DB_NAME || 'users',
    dialect: "mysql",
    pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
    }
  }
};
  
module.exports = config;