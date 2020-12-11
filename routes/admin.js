const express = require("express");
const router = express.Router();
const protectedRouteAdmin = require("../middleware/middlewares").protectedAdmin;
const adminController = require('../controllers/admin')

router.get("/login", adminController.adminLoginGET);
router.post("/login", adminController.adminLoginPOST);

router.get("/logout", adminController.adminLogout);

router.get("/dashboard",  protectedRouteAdmin,adminController.getDashboard);
router.get('/backup', protectedRouteAdmin,adminController.backup)
router.get('/customers', protectedRouteAdmin,adminController.getCustomers)
//games-due
router.get("/games-due",protectedRouteAdmin,adminController.dueGames);
router.get("/add-admin", protectedRouteAdmin,adminController.getAddAdmin)
router.post("/add-admin", protectedRouteAdmin,adminController.addAdmin)
router.get('/profit', protectedRouteAdmin,adminController.showProfitForm)
router.post('/profit', protectedRouteAdmin,adminController.Profit)
router.get("/showProfit", protectedRouteAdmin, adminController.showProfit);
router.get("/showTrans", protectedRouteAdmin, adminController.showTrans);
router.get("/sortTransDate", protectedRouteAdmin, adminController.sortTransDate);
router.get("/sortTransPrice", protectedRouteAdmin, adminController.sortTransPrice);
router.get("/groupbyTrans", protectedRouteAdmin, adminController.groupbyTrans);
/// Game Routes
router.get("/add-game", protectedRouteAdmin, adminController.showAddGameForm);
router.post("/add-game", protectedRouteAdmin,adminController.addGame);
router.get("/all-games", protectedRouteAdmin, adminController.allGames);

router.get("/add-stock-game",protectedRouteAdmin,adminController.getAddStockGame)
router.post("/add-stock-game",protectedRouteAdmin,adminController.addStockGame)

router.get('/del-game/:id',protectedRouteAdmin,adminController.deleteGame)
router.get('/return-games-ad/:id',protectedRouteAdmin,adminController.adReturnGame)
router.get('/approveReturn',protectedRouteAdmin,adminController.approve)
router.get('/rejectReturn/:id',protectedRouteAdmin,adminController.reject)

//End Game Routes

//Console Routes
router.get("/add-console", protectedRouteAdmin, adminController.showAddConsoleForm);
router.post('/add-console', protectedRouteAdmin,adminController.addConsole)
router.get("/all-consoles", protectedRouteAdmin, adminController.allConsoles);
router.get("/add-stock-console",protectedRouteAdmin,adminController.getAddStockConsole)
router.post("/add-stock-console",protectedRouteAdmin,adminController.addStockConsole)
router.get('/del-console/:id',protectedRouteAdmin,adminController.deleteConsole)

//End Console Routes



router.get('/categories', adminController.categories);
router.post('/categories', adminController.addCategories);
router.get("/del-cat/:id", adminController.deleteCategory)

router.get("/del-man/:id", adminController.deleteManufacture)

router.get('/manufacturers',adminController.manufacturers)
router.post('/manufacturers', adminController.addManufacturers)

router.get("*", (req, res) => {
  res.redirect("/admin/dashboard");
});

module.exports = router;
