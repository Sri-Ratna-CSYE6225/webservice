module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("profilepics", {
      file_name: {
        type: Sequelize.STRING
      },
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      url: {
        type: Sequelize.STRING
      },
      upload_date: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.STRING
      },
    });
    return User;
  };