const Question = require("../Models/question");

//  Create a new question
const createQuestion = async (req, res) => {
    try {
        const { question, options, difficulty, correctAnswer } = req.body;

        if (!question || !options || options.length < 2 || difficulty === undefined || correctAnswer === undefined) {
            return res.status(400).json({ message: "All fields are required, and there must be at least two options." });
        }
        if (correctAnswer < 0 || correctAnswer >= options.length) {
            return res.status(400).json({ message: "Correct answer index is out of range." });
        }
        const newQuestion = new Question({ question, options, difficulty, correctAnswer });
        await newQuestion.save();

        res.status(201).json({ message: "Question created successfully", question: newQuestion });
    } catch (error) {
        console.error(" Error creating question:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//  Get all questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        console.error(" Error retrieving questions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//  Get a specific question by ID
const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error(" Error retrieving question by ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//  Update a question by ID
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, options, difficulty, correctAnswer } = req.body;
        const existingQuestion = await Question.findById(id);
        if (!existingQuestion) {
            return res.status(404).json({ message: "Question not found." });
        }
        if (question) existingQuestion.question = question;
        if (options) existingQuestion.options = options;
        if (difficulty !== undefined) existingQuestion.difficulty = difficulty;
        if (correctAnswer !== undefined) {
            if (correctAnswer < 0 || correctAnswer >= options.length) {
                return res.status(400).json({ message: "Correct answer index is out of range." });
            }
            existingQuestion.correctAnswer = correctAnswer;
        }

        await existingQuestion.save();

        res.status(200).json({ message: "Question updated successfully", question: existingQuestion });
    } catch (error) {
        console.error(" Error updating question:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//  Delete a question by ID
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        await Question.findByIdAndDelete(id);

        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error(" Error deleting question:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion };
