module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("userdetails", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    verify : {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }
    // account_created: {
    //   type: Sequelize.DATE
    // },
    // account_updated: {
    //   type: Sequelize.DATE
    // }
  });
  return User;
};



// async function createTable(){
//     await db.query(`CREATE TABLE if not exists userdetails 
//     (id VARCHAR(255) PRIMARY KEY NOT NULL ,
//      first_name VARCHAR(255) NOT NULL , 
//      last_name VARCHAR(255) NOT NULL , 
//      password VARCHAR(255) NOT NULL ,
//      username VARCHAR(255) UNIQUE NOT NULL ,
//      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , 
//      updated_at DATETIME on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  
//      );`);
// }

// async function createUser(user){
//   const result = await db.query(
//     `INSERT INTO userdetails (id, first_name, last_name, password, username) VALUES
//     (UUID(), ?, ?, ?, ?);`, [user.first_name, user.last_name, user.password, user.username]
//   );
//   return result;
// }

// async function getUserByUserName(userName){
//   const result = await db.query(`SELECT * FROM userdetails WHERE userdetails.username = ${userName}`);
//   return result;
// }
// module.exports = {
//   createTable,
//   createUser,
//   getUserByUserName
// }