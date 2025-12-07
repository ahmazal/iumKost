const express = require("express");
const router = express.Router();
const penghuniController = require("../controller/penghuniController");
const authMiddleware = require("../middleware/authMiddleware");

// Semua route dilindungi dengan authentication
// Hanya admin yang bisa akses

router.get("/", authMiddleware, penghuniController.getAllPenghuni);
router.get("/:id", authMiddleware, penghuniController.getPenghuniById);
router.post("/", authMiddleware, penghuniController.createPenghuni);
router.put("/:id", authMiddleware, penghuniController.updatePenghuni);
router.put("/:id/password", authMiddleware, penghuniController.updatePasswordPenghuni);
router.delete("/:id", authMiddleware, penghuniController.deletePenghuni);

module.exports = router;