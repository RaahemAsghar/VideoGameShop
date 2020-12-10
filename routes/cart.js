const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cart')

router.get('/', cartController.getCart)
router.get('/add/game/:id', cartController.addToCartGame)
router.get('/increase/game/:id', cartController.increaseGame)
router.get('/decrease/game/:id', cartController.decreaseGame)

router.get('/add/console/:id', cartController.addToCartConsole)
router.get('/increase/console/:id', cartController.increaseConsole)
router.get('/decrease/console/:id', cartController.decreaseConsole)

router.get('/checkout', cartController.checkout)


module.exports = router;
