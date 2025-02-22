const express = require("express");
const { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion } = require("../Controller/QuestionController");
const router = express.Router();

router.post("/create", createQuestion);
router.get("/getAll", getAllQuestions);
router.get("/getIndividual/:id", getQuestionById);
router.put("/update/:id", updateQuestion);
router.delete("/delete/:id", deleteQuestion);

module.exports = router;