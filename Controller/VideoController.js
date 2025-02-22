const Video = require("../Models/Video");
const Module = require("../Models/Module");

//  Create a new video
const createVideo = async (req, res) => {
    try {
        const { title, video_url, description, module_id } = req.body;

        if (!title || !video_url || !description || !module_id) {
            return res.status(400).json({ message: "Title, video URL, description, and module_id are required." });
        }
        const moduleExists = await Module.findById(module_id);
        if (!moduleExists) {
            return res.status(404).json({ message: "Module not found." });
        }
        const existingVideo = await Video.findOne({ module_id });
        if (existingVideo) {
            return res.status(400).json({ message: "A video already exists for this module." });
        }
        const newVideo = new Video({ title, video_url, description, module_id });
        await newVideo.save();

        moduleExists.video_id = newVideo._id;
        await moduleExists.save();

        res.status(201).json({ message: "Video created successfully", video: newVideo });
    } catch (error) {
        console.error(" Error creating video:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//  Get All Videos
const getVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate("module_id", "name");
        res.status(200).json(videos);
    } catch (error) {
        console.error(" Error retrieving videos:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//  Get Video by  ID
const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id).populate("module_id", "name");
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        res.status(200).json(video);
    } catch (error) {
        console.error(" Error retrieving video by ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Update Video
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, video_url, description } = req.body;

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        if (title) video.title = title;
        if (video_url) video.video_url = video_url;
        if (description) video.description = description;

        await video.save();

        res.status(200).json({ message: "Video updated successfully", video });
    } catch (error) {
        console.error(" Error updating video:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



//  Delete Video by ID
const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        await Module.findByIdAndUpdate(video.module_id, { $unset: { video_id: "" } });
        await Video.findByIdAndDelete(id);

        res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        console.error("  Error deleting video:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createVideo, getVideos, getVideoById,updateVideo, deleteVideo };
