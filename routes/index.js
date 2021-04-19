const router = require("express").Router();

/* GET Controllers. */
const pokeC = require("../controllers/pokedoC");
// Middleware
const Protected = require("../middlewares/verifyToken");
const Role = require("../middlewares/roleUser");
// Auth
router.get("/", Protected, Role.restrictTo("admin"), pokeC.pokeapi);

module.exports = router;
