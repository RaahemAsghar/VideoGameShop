const express = require("express");
const router = express.Router();
const gameController = require('../controllers/game')

router.get('/:gid', gameController.getGame)

router.get('/rent/:id', gameController.rentGame)

module.exports = router;
