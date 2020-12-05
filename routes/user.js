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
router.post('/search-result', userController.getsearchResults)
router.get('/user-history',protectedUser, userController.userHistory)
router.get('*', (req,res)=>{
    req.flash('login_msg', "You need to login first.")
    res.redirect('/user/my-account')
})


module.exports = router;
