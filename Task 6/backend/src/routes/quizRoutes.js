const express = require("express");

const {
  getQuizById,
  submitQuiz,
} = require("../controllers/quizController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", protect, getQuizById);
router.post("/:id/submit", protect, submitQuiz);

module.exports = router;