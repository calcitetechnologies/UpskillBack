const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  difficulty: {
    type: Number,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
