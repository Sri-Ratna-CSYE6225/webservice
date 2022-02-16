const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const basicAuthentication = require('../utils/authenticate');

router.post('/', userController.createUser);
router.get('/self', basicAuthentication(), userController.getUser);
router.put('/self', basicAuthentication(), userController.updateUser);
module.exports = router;