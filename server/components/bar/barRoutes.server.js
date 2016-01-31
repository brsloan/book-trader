var express = require('express');
var router = express.Router();

var path = process.cwd();
var BarHandler = require(path + '/server/components/bar/barHandler.server.js');
var barHandler = new BarHandler();

router.get('/bars/packaged/:location', barHandler.getBarsWithUserData);

module.exports = router;