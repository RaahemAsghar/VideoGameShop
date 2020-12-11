const express = require("express");
const router = express.Router();
const gameController = require('../controllers/game');
const { getAccount } = require("../controllers/user");

router.get('/:gid', gameController.getGame)

router.get('/rent/:id', gameController.rentGame)

router.get('/page/:page', gameController.games)

router.get('/page/:page/category/:cat', gameController.gamesByCat)
router.get('/priceasc/page/:page', gameController.sortByPriceGames)


module.exports = router;
