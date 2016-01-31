var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.JWT_SECRET, userProperty: 'payload'});

var path = process.cwd();
var BookHandler = require(path + '/server/components/book/bookHandler.server.js');
var bookHandler = new BookHandler();

var UserHandler = require(path + '/server/components/user/userHandler.server.js');
var userHandler = new UserHandler();

router.param('user', userHandler.getByName);

router.get('/books', bookHandler.getAllBooks);
router.put('/books', auth, bookHandler.saveBook);
router.get('/books/user/:user', bookHandler.getUserBooks);
router.get('/books/:id', bookHandler.getBook);
//router.delete('/books/:id', auth, bookHandler.deleteBook);

module.exports = router;