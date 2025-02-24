const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserLearningSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  theme_id: {
    type: Schema.Types.ObjectId,
    ref: "Theme",
    required: true,
  },
  section_id: {
    type: Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
  modules: [
    {
      module_id: {
        type: Schema.Types.ObjectId,
        ref: "Module",
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      video_progress: {
        type: Number, // Percentage (0-100)
        default: 0,
      },
      videos: [
        {
          video_id: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true,
          },
          title: {
            type: String,
            required: true,
            trim: true,
          },
          video_url: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          analysis_id: {
            type: Schema.Types.ObjectId,
            ref: "Analysis",
          },
          quiz_id: {
            type: Schema.Types.ObjectId,
            ref: "Quiz",
          },
          watch_percentage: {
            type: Number, // Track user's progress for each video
            default: 0,
          },
          quiz_completed: {
            type: Boolean,
            default: false,
          },
          quiz_score: {
            type: Number,
            default: 0,
          },
          completed_at: Date,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("UserLearning", UserLearningSchema);
