const express = require("express");
const { getVideoDetails } = require("../Controller/VideoController");

const router = express.Router();

// Define API Routes
router.post("/get-video-details", getVideoDetails);

module.exports = router;
