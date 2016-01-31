var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.JWT_SECRET, userProperty: 'payload'});

var path = process.cwd();
var UserHandler = require(path + '/server/components/user/userHandler.server.js');
var userHandler = new UserHandler();

router.param('user', userHandler.getByName);

router.get('/users/:user/', userHandler.getUser);
router.put('/users/:user/profile', auth, userHandler.setProfileInfo);

router.post('/register', userHandler.register);
router.post('/login', userHandler.logIn);

module.exports = router;