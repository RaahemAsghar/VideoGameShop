const express = require("express");
const router = express.Router();
const gameController = require('../controllers/game');
const { getAccount } = require("../controllers/user");

router.get('/:gid', gameController.getGame)

router.get('/rent/:id', gameController.rentGame)

router.get('/page/:page', gameController.games)


module.exports = router;
