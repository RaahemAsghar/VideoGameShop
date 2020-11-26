const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require('../middleware/middlewares').resetSession
const protectedUser = require('../middleware/middlewares').protectedUser
const userController = require('../controllers/user')
router.get('/my-account',protectedUser, userController.getAccount)


module.exports = router;
