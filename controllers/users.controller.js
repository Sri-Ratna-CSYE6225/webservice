const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const {v4:uuidv4} = require('uuid');
const basicAuthentication = require('../utils/authenticate');
const User = db.users;
/* POST/CREATE a user */
router.post('/', async function(req, res, next) {
    console.log("-------------", req.body);
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
  });

  router.get('/self', basicAuthentication(), async function(req, res, next) {
    const user = await User.findOne({where : {username: req.params.username}});
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
  });

 async function authenticateUser(username, password){
    const user = User.findOne({where : {username: username}});
    if(user.dataValues){
        bcrypt.compare(user.dataValues.password, password, function(err, res){
            if(res){
                return true;
            } else {
                return false;
            }
        });
    }
  }
  module.exports = {
      router: router,
      authenticateUser: authenticateUser
  };