const env = process.env;
const config = {
  db: {
    host: env.DB_HOST || 'csye6225.cslvthzxy1ut.us-east-1.rds.amazonaws.com',
    user: env.DB_USER || 'csye6225',
    password: env.DB_PASSWORD || 'Lolol12345',
    database: env.DB_NAME || 'csye6225',
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