const Quiz = require("../Models/Quiz");
const Video = require("../Models/Video");
const Question = require("../Models/question");

const QuizController = {
  //  Create a new quiz and assign it to a video
  async create(req, res) {
    try {
      const { questions, video_id } = req.body;

      if (!questions || !video_id) {
        return res.status(400).json({ message: "Video ID and questions are required." });
      }
      const video = await Video.findById(video_id);
      if (!video) {
        return res.status(404).json({ message: "Video not found." });
      }
      const existingQuestions = await Question.find({ _id: { $in: questions } });
      if (existingQuestions.length !== questions.length) {
        return res.status(400).json({ message: "Some questions do not exist." });
      }

      const quiz = new Quiz({ questions, video_id });
      await quiz.save();

      video.quiz_id = quiz._id;
      await video.save();

      res.status(201).json({ message: "Quiz created successfully", quiz });
    } catch (error) {
      console.error(" Error creating quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //  Get All Quizzes with Questions
  async getQuizzes(req, res) {
    try {
      const quizzes = await Quiz.find().populate("questions");
      res.status(200).json(quizzes);
    } catch (error) {
      console.error(" Error retrieving quizzes:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //  Get a Quiz by `quiz_id`
  async getQuizById(req, res) {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findById(id).populate("questions");
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found." });
      }
      res.status(200).json(quiz);
    } catch (error) {
      console.error(" Error retrieving quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //  Get a Quiz by `video_id`
  async getQuizByVideo(req, res) {
    try {
      const { video_id } = req.params;

      const quiz = await Quiz.findOne({ video_id }).populate("questions");
      if (!quiz) {
        return res.status(404).json({ message: "No quiz found for this video." });
      }
      const easyQuestions = quiz.questions.filter(q => q.difficulty === 0);
      const mediumQuestions = quiz.questions.filter(q => q.difficulty === 1);
      const hardQuestions = quiz.questions.filter(q => q.difficulty === 2);

      easyQuestions.sort(() => Math.random() - 0.5);
      mediumQuestions.sort(() => Math.random() - 0.5);
      hardQuestions.sort(() => Math.random() - 0.5);

      const selectedQuestions = [
        ...easyQuestions.slice(0, 3),
        ...mediumQuestions.slice(0, 4),
        ...hardQuestions.slice(0, 3),
      ];

      res.status(200).json({ quiz_id: quiz._id, questions: selectedQuestions });
    } catch (error) {
      console.error(" Error retrieving quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //  Update a Quiz (Modify Questions)
  async updateQuiz(req, res) {
    try {
      const { id } = req.params;
      const { questions } = req.body;

      const quiz = await Quiz.findById(id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found." });
      }

      const existingQuestions = await Question.find({ _id: { $in: questions } });
      if (existingQuestions.length !== questions.length) {
        return res.status(400).json({ message: "Some questions do not exist." });
      }
      quiz.questions = questions;
      await quiz.save();

      res.status(200).json({ message: "Quiz updated successfully", quiz });
    } catch (error) {
      console.error(" Error updating quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete a Quiz
  async deleteQuiz(req, res) {
    try {
      const { id } = req.params;

      const quiz = await Quiz.findById(id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found." });
      }

      await Video.findByIdAndUpdate(quiz.video_id, { $unset: { quiz_id: "" } });
      await Quiz.findByIdAndDelete(id);

      res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error(" Error deleting quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = QuizController;
