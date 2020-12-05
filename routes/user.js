const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require('../middleware/middlewares').resetSession
const protectedUser = require('../middleware/middlewares').protectedUser
const userController = require('../controllers/user')

router.get('/my-account',protectedUser, userController.getAccount)
router.get('/edit-account',protectedUser, userController.getEditAccount)
router.post('/edit-account', protectedUser, userController.editAccount)
router.get('/search-result',protectedUser, userController.getsearchResults)
router.get('/user-history',protectedUser, userController.userHistory)
router.get('/return-game',protectedUser, userController.showReturnGame)
router.post('/return-game', userController.returnGame)
router.get("/return-game-result", protectedUser, userController.returnGameResult);


module.exports = router;
