const express = require("express");

const {
  getAllCourses,
  getCourseById,
  createCourse,
  enrollInCourse,
  getMyCourses,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getAllCourses);
router.get("/my-courses", protect, getMyCourses);
router.get("/:id", getCourseById);

router.post(
  "/",
  protect,
  allowRoles("INSTRUCTOR", "ADMIN"),
  createCourse
);

router.post("/:id/enroll", protect, allowRoles("LEARNER"), enrollInCourse);

module.exports = router;