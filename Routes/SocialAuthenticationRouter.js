// routes/socialAuth.js
const express = require('express');
const router = express.Router();
const User = require('../Models/User'); 

const upsertSocialUser = async (provider, payload) => {
  const { tokenResponse, userInfo, email, username } = payload;

  if (!tokenResponse || !userInfo || !email) {
    throw new Error("Missing required fields: tokenResponse, userInfo, and email are all required.");
  }
  let user = await User.findOne({ email });
  const socialData = { tokenResponse, userInfo };

  if (!user) {
    user = new User({
      authMethod: provider,
      email,
      username: username || undefined,
      [provider]: socialData,
    });
  } else {
    user.authMethod = provider;
    user[provider] = socialData;
    if (username && !user.username) {
      user.username = username;
    }
  }
  await user.save();
  return user;
};

// LinkedIn endpoint
router.post('/linkedin', async (req, res) => {
  try {
    const user = await upsertSocialUser('linkedin', req.body);
    res.json({
      message: "LinkedIn data saved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error storing LinkedIn data:", error);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
});

// Google endpoint
router.post('/google', async (req, res) => {
  try {
    const user = await upsertSocialUser('google', req.body);
    res.json({
      message: "Google data saved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error storing Google data:", error);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
});

// Apple endpoint
router.post('/apple', async (req, res) => {
  try {
    const user = await upsertSocialUser('apple', req.body);
    res.json({
      message: "Apple data saved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error storing Apple data:", error);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
