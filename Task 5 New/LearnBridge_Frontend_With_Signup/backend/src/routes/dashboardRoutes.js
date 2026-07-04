const express = require("express");

const {
  getLearnerDashboard,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/learner",
  protect,
  allowRoles("LEARNER"),
  getLearnerDashboard
);

module.exports = router;