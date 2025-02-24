const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserProgressSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    points: { type: Number, default: 0 },
    module_points: { type: Number, default: 0 },
    section_points: { type: Number, default: 0 },
    theme_points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },

    theme_progress: [
      {
        theme_id: { type: Schema.Types.ObjectId, ref: "Theme" },
        status: { type: String, enum: ["not_started", "in_progress", "completed"], default: "not_started" },
        completion_percentage: { type: Number, default: 0 },
        started_at: Date,
        completed_at: Date,
      },
    ],

    section_progress: [
      {
        section_id: { type: Schema.Types.ObjectId, ref: "Section" },
        status: { type: String, enum: ["not_started", "in_progress", "completed"], default: "not_started" },
        completion_percentage: { type: Number, default: 0 },
        started_at: Date,
        completed_at: Date,
      },
    ],

    completed_modules: [
      {
        module_id: { type: Schema.Types.ObjectId, ref: "Module" },
        completed_at: Date,
        points_earned: { type: Number, default: 0 }
      },
    ],

    badges: [{ type: Schema.Types.ObjectId, ref: "Badge" }],

    daily_points: [
      {
        date: { type: Date, required: true },
        points: { type: Number, default: 0 },
      }
    ],
    weekly_points: [
      {
        weekStart: { type: Date, required: true },
        weekEnd: { type: Date, required: true },
        points: { type: Number, default: 0 },
      }
    ],
    monthly_points: [
      {
        month: { type: String, required: true }, 
        points: { type: Number, default: 0 },
      }
    ],

    dailyStreak: { type: Number, default: 0 },
    maxDailyStreak: { type: Number, default: 0 },
    lastCompletionDate: { type: Date },
    weeklyStreak: { type: Number, default: 0 },
    maxWeeklyStreak: { type: Number, default: 0 },
    consecutiveModules: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProgress", UserProgressSchema);
