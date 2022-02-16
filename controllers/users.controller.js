// const express = require('express');
// const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const {v4:uuidv4} = require('uuid');
const User = db.users;
/* POST/CREATE a user */
// router.post('/', async function(req, res, next) {
async function createUser(req, res, next){
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(!emailRegexp.test(req.body.username)){
        res.status(400).send({
            message: "Enter emailId in correct format. eg:abc@xyz.com"
        });
    }
    const getUser = await User.findOne({where : {username: req.body.username}}).catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
    });
    if(getUser){
        res.status(400).send({
            message: "User already exists."
        });
    } else{
    var user ={
            id: uuidv4(),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: hashedPassword,
            username: req.body.username
        };

        User.create(user)
        .then(data => {
          res.status(201).send({
              id: data.id,
              first_name: data.first_name,
              last_name: data.last_name,
              username: data.username,
              account_created: data.createdAt,
              account_updated: data.updatedAt
          });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });
    }
  }

//   router.get('/self', basicAuthentication(), async function(req, res, next) {
async function getUser(req, res, next){
    const user = await getUserByUserName(req.user.username);
    if(user){
        res.status(200).send({
            id: user.dataValues.id,
            first_name: user.dataValues.first_name,
            last_name: user.dataValues.last_name,
            username: user.dataValues.username,
            account_created: user.dataValues.createdAt,
            account_updated: user.dataValues.updatedAt
        });
    } else {
        res.status(400).send({
            message: "User not found"
        });
    }    
  }

async function updateUser(req, res, next){
    if(req.body.username != req.user.username){
        res.sendStatus(400);
    }
    User.update({ 
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: await bcrypt.hash(req.body.password, 10)
}, {where : {username: req.user.username}}).then((result) => {
    if(result == 1){
        res.sendStatus(204);
    } else {
        res.sendStatus(400);
    }
}).catch(err => {
    res.status(500).send({
        message: "Error updating user"
      });
});

}

 async function getUserByUserName(username){
    return User.findOne({where : {username: username}});
  }

  async function comparePasswords(existingPassword, currentPassword){
    return bcrypt.compare(existingPassword, currentPassword);
  }

  module.exports = {
      createUser: createUser,
      getUser: getUser,
      getUserByUserName: getUserByUserName,
      comparePasswords: comparePasswords,
      updateUser: updateUser
  };