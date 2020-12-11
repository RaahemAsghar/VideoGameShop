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
router.get('/search-result', userController.getsearchResults)

router.get('/user-history',protectedUser, userController.userHistory)
router.get('/return-game',protectedUser, userController.showReturnGame)
router.post('/return-game-result/:id', userController.returnGame)
router.get("/return-game-result/:id", protectedUser, userController.returnGameResult);
router.get("/Success", protectedUser, userController.success);
router.get("/games_due", protectedUser, userController.gamesDue);
router.get('/sortprice', userController.sortByPrice)
router.get('/groupCategory/:id', userController.groupByCategory)

router.get('*', (req,res)=>{
    req.flash('login_msg', "You need to login first.")
    res.redirect('/user/my-account')
})



module.exports = router;
