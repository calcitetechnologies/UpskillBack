const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userProgressSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },

    theme_progress: [
      {
        theme_id: { type: Schema.Types.ObjectId, ref: "Theme" },
        status: {
          type: String,
          enum: ["not_started", "in_progress", "completed"],
          default: "not_started",
        },
        completion_percentage: { type: Number, default: 0 },
        started_at: Date,
        completed_at: Date,
      },
    ],

    skill_levels: [
      {
        skill_id: { type: Schema.Types.ObjectId, ref: "Skill" },
        level: { type: Number, default: 1 },
        experience_points: { type: Number, default: 0 },
      },
    ],

    completed_videos: [
      {
        video_id: { type: Schema.Types.ObjectId, ref: "Video" },
        watch_percentage: { type: Number, default: 0 },
        quiz_completed: { type: Boolean, default: false },
        quiz_score: { type: Number },
        completed_at: Date,
      },
    ],

    completed_modules: [
      {
        module_id: { type: Schema.Types.ObjectId, ref: "Module" },
        completed_at: Date,
      },
    ],

    badges: [
      {
        type: Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProgress", userProgressSchema);
