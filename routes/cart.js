const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cart')
const protectFromAdmin = require('../middleware/middlewares').protectedFromAdmin
router.get('/', protectFromAdmin,cartController.getCart)
router.get('/add/game/:id', protectFromAdmin,cartController.addToCartGame)
router.get('/increase/game/:id', protectFromAdmin,cartController.increaseGame)
router.get('/decrease/game/:id', protectFromAdmin,cartController.decreaseGame)

router.get('/add/console/:id', protectFromAdmin,cartController.addToCartConsole)
router.get('/increase/console/:id', protectFromAdmin,cartController.increaseConsole)
router.get('/decrease/console/:id', protectFromAdmin,cartController.decreaseConsole)

router.get('/checkout', protectFromAdmin,cartController.checkout)


module.exports = router;
