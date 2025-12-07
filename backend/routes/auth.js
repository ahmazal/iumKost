const express = require("express");
const router = express.Router();
const auth = require("../controller/auth/index");
const authController = require("../controller/auth/me");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", auth.login);
router.post("/refresh", auth.refreshToken);
router.get("/me", authMiddleware, authController.me);

module.exports = router;
