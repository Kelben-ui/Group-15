const express = require("express");

const {
  getLessonById,
  markLessonCompleted,
} = require("../controllers/lessonController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", protect, getLessonById);
router.post("/:id/complete", protect, markLessonCompleted);

module.exports = router;