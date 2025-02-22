const express = require("express");
const { createVideo, getVideos, getVideoById,updateVideo, deleteVideo } = require("../Controller/VideoController");
const router = express.Router();

router.post("/create", createVideo);
router.get("/getAll", getVideos);
router.get("/getIndividual/:id", getVideoById);
router.put("/update/:id", updateVideo);
router.delete("/delete/:id", deleteVideo);

module.exports = router;