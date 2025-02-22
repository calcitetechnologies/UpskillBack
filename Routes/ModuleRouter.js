const express = require("express");
const { createModule, getModules, getModuleById, updateModule, deleteModule,getModulesBySectionId } = require("../Controller/ModuleController");
const {authMiddleware} = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/create",authMiddleware, createModule);
router.get("/getAll", getModules);
router.get("/getIndividual/:id", getModuleById);
router.get("/getModuleBySection/:section_id",getModulesBySectionId);
router.put("/update/:id", updateModule);
router.delete("/delete/:id", deleteModule);

module.exports = router;
