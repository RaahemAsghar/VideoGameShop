const express = require("express");
const router = express.Router();
const protectedRouteAdmin = require("../middleware/middlewares").protectedAdmin;
const adminController = require('../controllers/admin')

router.get("/login", adminController.adminLoginGET);
router.post("/login", adminController.adminLoginPOST);

router.get("/logout", adminController.adminLogout);

router.get("/dashboard", /*protectedRouteAdmin,*/ adminController.getDashboard);
router.get('/backup', adminController.backup)

//games-due
router.get("/games-due",adminController.dueGames);


/// Game Routes
router.get("/add-game", /*protectedRouteAdmin,*/ adminController.showAddGameForm);
router.post("/add-game", adminController.addGame);
router.get("/all-games", /*protectedRouteAdmin,*/ adminController.allGames);

router.get("/add-stock-game",adminController.getAddStockGame)
router.post("/add-stock-game",adminController.addStockGame)

router.get('/del-game/:id',adminController.deleteGame)

//End Game Routes

//Console Routes
router.get("/add-console", /*protectedRouteAdmin,*/ adminController.showAddConsoleForm);
router.post('/add-console', adminController.addConsole)
router.get("/all-consoles", /*protectedRouteAdmin,*/ adminController.allConsoles);
router.get("/add-stock-console",adminController.getAddStockConsole)
router.post("/add-stock-console",adminController.addStockConsole)
router.get('/del-console/:id',adminController.deleteConsole)

//End Console Routes



router.get('/categories', adminController.categories);
router.post('/categories', adminController.addCategories);
router.get('/manufacturers',adminController.manufacturers)
router.post('/manufacturers', adminController.addManufacturers)

router.get("*", (req, res) => {
  res.redirect("/admin/dashboard");
});

module.exports = router;
