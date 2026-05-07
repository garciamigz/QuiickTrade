const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/tradeController");

router.post("/offer", tradeController.createTrade);
router.post("/cancel", tradeController.cancelTrade);
router.get("/reports", tradeController.getReports);

module.exports = router;
