const express = require("express");
const router = express.Router();
const tagihanController = require("../controller/tagihanController");
const riwayatController = require("../controller/riwayatPembayaranController");
const kamarController = require("../controller/kamarController");
const authMiddleware = require("../middleware/authMiddleware");

// ===== TAGIHAN ROUTES =====
router.get("/", authMiddleware, tagihanController.getAllTagihan);
router.get("/unpaid", authMiddleware, tagihanController.getUnpaidTagihan);
router.get("/statistics", authMiddleware, tagihanController.getStatistics);
router.get("/:id", authMiddleware, tagihanController.getTagihanById);
router.post("/", authMiddleware, tagihanController.createTagihan);
router.put("/:id", authMiddleware, tagihanController.updateTagihan);
router.put("/:id/status", authMiddleware, tagihanController.updateStatusTagihan);
router.delete("/:id", authMiddleware, tagihanController.deleteTagihan);

// Proses pembayaran
router.post("/:id/bayar", authMiddleware, tagihanController.processPembayaran);

// ===== RIWAYAT PEMBAYARAN ROUTES =====
router.get("/riwayat/all", authMiddleware, riwayatController.getAllRiwayat);
router.get("/riwayat/stats", authMiddleware, riwayatController.getMonthlyStats);
router.get("/riwayat/:id", authMiddleware, riwayatController.getRiwayatById);
router.get("/riwayat/tagihan/:idTagihan", authMiddleware, riwayatController.getRiwayatByTagihan);
router.put("/riwayat/:id", authMiddleware, riwayatController.updateRiwayat);
router.delete("/riwayat/:id", authMiddleware, riwayatController.deleteRiwayat);

// ===== KAMAR ROUTES (untuk dropdown) =====
router.get("/kamar/all", authMiddleware, kamarController.getAllKamar);
router.get("/kamar/occupied", authMiddleware, kamarController.getOccupiedKamar);

module.exports = router;