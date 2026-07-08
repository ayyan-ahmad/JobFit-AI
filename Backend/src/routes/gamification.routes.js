
const express = require("express");
const { getLeaderboard } = require("../controllers/gamification.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = express.Router();

// Yeh route leaderboard page par data lane ke liye hai
// URL banega: GET /api/gamification/leaderboard
router.route("/leaderboard").get(authMiddleware.authUser, getLeaderboard);

module.exports = router;