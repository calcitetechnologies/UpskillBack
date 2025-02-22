const express = require("express");
const {create,getQuizzes,getQuizById,getQuizByVideo,updateQuiz,deleteQuiz} = require("../Controller/QuizController");

const router = express.Router();

router.post("/create", create);  
router.get("/getAll", getQuizzes);  
router.get("/getIndividual/:id", getQuizById);  
router.get("/getByVideo/:video_id", getQuizByVideo);  
router.put("/update/:id", updateQuiz);  
router.delete("/delete/:id", deleteQuiz);  

module.exports = router;
