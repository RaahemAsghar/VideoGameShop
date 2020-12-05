const express = require("express");
const router = express.Router();
const consoleController = require('../controllers/console')

router.get('/:id', consoleController.getConsole)



module.exports = router;
