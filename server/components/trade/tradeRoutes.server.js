var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.JWT_SECRET, userProperty: 'payload'});

var path = process.cwd();
var TradeHandler = require(path + '/server/components/trade/tradeHandler.server.js');
var tradeHandler = new TradeHandler();

var UserHandler = require(path + '/server/components/user/userHandler.server.js');
var userHandler = new UserHandler();

router.param('user', userHandler.getByName);

router.get('/trades/:user', tradeHandler.getTradesUser);
router.post('/trades', auth, tradeHandler.saveTrade);
router.delete('/trades/:id', auth, tradeHandler.deleteTrade);
router.put('/trades/:id/accept', auth, tradeHandler.acceptTrade);
router.put('/trades/:id/reject', auth, tradeHandler.rejectTrade);

router.delete('/books/:id', auth, tradeHandler.removeBook);

module.exports = router;