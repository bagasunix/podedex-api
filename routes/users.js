const router = require("express").Router();

/* GET Controllers. */
const userC = require("../controllers/userC");
// Middleware
const Protected = require("../middlewares/verifyToken");
// Auth
router.get("/", Protected, userC.getAllUsers);
router.post("/signup", userC.addUser);
router.post("/login", userC.login);
router.delete("/logout", Protected, userC.logout);

module.exports = router;
