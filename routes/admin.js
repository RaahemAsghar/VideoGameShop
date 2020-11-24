const express = require("express");
const router = express.Router();
const protectedRouteAdmin = require("../middleware/middlewares").protectedAdmin;
const adminController = require('../controllers/admin')

router.get("/login", adminController.adminLoginGET);
router.post("/login", adminController.adminLoginPOST);

router.get("/logout", adminController.adminLogout);

router.get("/dashboard", /*protectedRouteAdmin,*/ adminController.getDashboard);
/// Game Routes
router.get("/add-game", /*protectedRouteAdmin,*/ adminController.showAddGameForm);
router.post("/add-game", adminController.addGame);
router.get("/all-games", /*protectedRouteAdmin,*/ adminController.allGames);

//End Game Routes

//Console Routes
router.get("/add-console", /*protectedRouteAdmin,*/ adminController.showAddConsoleForm);
router.post('/add-console', adminController.addConsole)
router.get("/all-consoles", /*protectedRouteAdmin,*/ adminController.allConsoles);

//End Console Routes



router.get('/categories', adminController.categories);

router.get('/manufacturers',adminController.manufacturers)


router.get("*", (req, res) => {
  res.redirect("/admin/dashboard");
});

module.exports = router;
