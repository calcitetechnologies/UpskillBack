const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserfeedbackSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  video_id: {
    type: Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Userfeedback", UserfeedbackSchema);
