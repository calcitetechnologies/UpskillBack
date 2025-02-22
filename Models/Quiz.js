const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  video_id: {
    type: Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
});

module.exports = mongoose.model("Quiz", QuizSchema);
