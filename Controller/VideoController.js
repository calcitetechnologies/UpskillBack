const Video = require("../Models/Video");  
const axios = require("axios");
const iso8601 = require("iso8601-duration");
require("dotenv").config();

const API_KEY = process.env.YOUTUBE_API_KEY;

// Function to extract video ID from various YouTube URL formats
const extractVideoId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Controller Function to Fetch and Store YouTube Video Details
const getVideoDetails = async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: "Video URL is required." });
    }

    // Extract Video ID
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      return res.status(400).json({ error: "Invalid YouTube video URL." });
    }

    // Check if video exists in DB
    const existingVideo = await Video.findOne({ video_id: videoId });
    if (existingVideo) {
      return res.status(200).json(existingVideo);
    }

    // Fetch video details from YouTube API
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${API_KEY}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.items.length) {
      return res.status(404).json({ error: "Video not found." });
    }

    const videoData = data.items[0];
    const snippet = videoData.snippet;
    const stats = videoData.statistics;
    const content = videoData.contentDetails;

    // Convert Duration (PT12M34S -> 12:34)
    const duration = iso8601.parse(content.duration);
    const formattedDuration = `${duration.minutes}:${duration.seconds}`;

    // Calculate Engagement Score
    const views = parseInt(stats.viewCount || 0);
    const likes = parseInt(stats.likeCount || 0);
    const comments = parseInt(stats.commentCount || 0);
    const engagementScore = ((likes + comments) / (views || 1)) * 100;

    // Save to Database
    const newVideo = new Video({
      video_id: videoId,
      title: snippet.title,
      description: snippet.description,
      video_url: videoUrl,
      channel_id: snippet.channelId,
      channel_name: snippet.channelTitle,
      likes_count: likes,
      comments_count: comments,
      views_count: views,
      length: formattedDuration,
      publish_date: snippet.publishedAt.split("T")[0],
      category: snippet.categoryId,
      engagement_score: engagementScore.toFixed(2),
    });

    await newVideo.save();
    res.status(201).json(newVideo);
    
  } catch (error) {
    console.error("Error fetching video details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getVideoDetails };
