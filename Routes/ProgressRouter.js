const express = require("express");
const router = express.Router();
const ProgressController = require("../Controller/ProgressController");
const {authMiddleware} = require("../middleware/auth.middleware"); 

router.post("/completeModule", authMiddleware, ProgressController.completeModule);
router.get("/modules", authMiddleware, ProgressController.getModuleProgress);
router.get("/sections", authMiddleware, ProgressController.getSectionProgress);
router.get("/themes", authMiddleware, ProgressController.getThemeProgress);

module.exports = router;
