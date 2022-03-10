const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const basicAuthentication = require('../utils/authenticate');
const binaryParser = require('../utils/binaryParser');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})
router.post('/', userController.createUser);
router.get('/self', basicAuthentication(), userController.getUser);
router.put('/self', basicAuthentication(), userController.updateUser);
// router.post('/self/pic', [binaryParser()], userController.uploadPic);
module.exports = router;