const express = require("express");
const router = express.Router();
const { startPracticeSession, evaluateSessionAnswers, getPracticeHistory, getPracticeSessionById } = require("../controllers/practice.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Route to start session
router.post("/start", authMiddleware.authUser, startPracticeSession);
// Route to process answers after completion
router.post("/evaluate", authMiddleware.authUser, evaluateSessionAnswers);

// Routes for history
router.get("/history", authMiddleware.authUser, getPracticeHistory);
router.get("/history/:sessionId", authMiddleware.authUser, getPracticeSessionById);

module.exports = router; 