const express = require("express");
const router = express.Router();
const authController = require("../controller/auth/me");
const auth = require("../controller/auth/index");

router.post("/login", auth.login);
router.post("/refresh", auth.refreshToken);
router.get("/me", authController.me);

module.exports = router;
