const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cart')

router.get('/', cartController.getCart)
router.get('/add/game/:id', cartController.addToCartGame)
router.get('/checkout', cartController.checkout)
router.get('/increase/game/:id', cartController.increaseGame)
router.get('/decrease/game/:id', cartController.decreaseGame)

// router.get('/add/console/:id', cartController.addToCartConsole)

module.exports = router;
