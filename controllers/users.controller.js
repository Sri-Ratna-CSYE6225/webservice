const express = require('express');
const router = express.Router();
const userDB = require('../db/users');
/* POST/CREATE a user */
router.post('/', async function(req, res, next) {
    // console.log(req.body);
    var user ={
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        username: req.body.username
    };
    console.log("---------------", user);
    try {
      res.json(await userDB.createTable().then(async() => {
          await userDB.createUser(user);
      }));
    } catch (err) {
      console.error(`Error while creating user `, err.message);
      next(err);
    }
  });

  module.exports = router;