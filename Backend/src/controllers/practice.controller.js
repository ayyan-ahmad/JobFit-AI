const PracticeSession = require("../models/practiceSession.model");
const { generateCustomPracticeQuestions, evaluatePracticeSession } = require("../services/ai.services");

/**
 * @route   POST /api/practice/start
 * @desc    Create a new custom practice session with 10 mixed questions based on selected topics
 * @access  Public (or Protected if using Auth)
 */
const startPracticeSession = async (req, res) => {
    try {
        const { topics } = req.body;

        // Validation: Check if topics are provided and it's a non-empty array
        if (!topics || !Array.isArray(topics) || topics.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Choose at least choose one topic!"
            });
        }

        console.log(`Generating 10 questions for selected topics: ${topics.join(", ")}...`);

        // 1. Gemini Se Dynamic Questions Fetch Karo (Using our custom practice AI service)
        const generatedQuestions = await generateCustomPracticeQuestions({ topics });

        // 2. Database mein naya practice session create karo
        const newSession = new PracticeSession({
            userId: req.user._id, // User tracking ke liye
            selectedTopics: topics,
            questions: generatedQuestions,
            userAnswers: [], // Starting empty, answers baad me submit honge
            status: "created"
        });

        await newSession.save();

        // 3. Response frontend ko bhej do (Taaki simulator room start ho sake)
        return res.status(201).json({
            success: true,
            message: "Session successfully created! Best of luck for the test.",
            sessionId: newSession._index || newSession._id,
            // Filtering questions out to not pass correctAnswers to front-end initially if you want to keep it secure
            questions: newSession.questions.map(q => ({
                id: q.id,
                type: q.type,
                topic: q.topic,
                question: q.question,
                options: q.options // Contains null for subjective, and 4 choices for MCQ/MSQ
            }))
        });

    } catch (error) {
        console.error("Error in startPracticeSession controller:", error);
        return res.status(500).json({
            success: false,
            message: "Kuch gadbad ho gayi backend mein questions generate karte waqt.",
            error: error.message
        });
    }
};

const evaluateSessionAnswers = async (req, res) => {
    try {
        const { sessionId, userAnswers } = req.body;

        // 1. Session check matching MongoDB ID
        const session = await PracticeSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ success: false, message: "Session nahi mila, bhai!" });
        }

        // 2. Trigger Gemini AI to score and break down feedback
        const aiEvaluation = await evaluatePracticeSession({
            questions: session.questions,
            userAnswers: userAnswers
        });

        // 3. Map outcomes back into our database schema
        session.userAnswers = userAnswers.map(ua => {
            const match = aiEvaluation.questionsBreakdown.find(qb => qb.questionId === ua.questionId);
            return {
                questionId: ua.questionId,
                answer: ua.answer,
                isCorrect: match ? match.isCorrect : false,
                feedback: match ? match.feedback : "No feedback generated."
            };
        });

        session.evaluation = {
            totalScore: aiEvaluation.totalScore,
            overallFeedback: aiEvaluation.overallFeedback,
            completedAt: new Date()
        };
        session.status = "completed";

        await session.save();

        // 4. Send metrics directly to dashboard scoreboard UI
        return res.status(200).json({
            success: true,
            evaluation: session.evaluation,
            detailedBreakdown: session.userAnswers
        });

    } catch (error) {
        console.error("Error in evaluateSessionAnswers controller:", error);
        return res.status(500).json({ success: false, message: "Evaluation processing failed.", error: error.message });
    }
};


const getPracticeHistory = async (req, res) => {
    try {
        const sessions = await PracticeSession.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select("-questions -userAnswers"); // Skip heavy data for listing
            
        return res.status(200).json({ success: true, sessions });
    } catch (error) {
        console.error("Error fetching practice history:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch practice history." });
    }
};

const getPracticeSessionById = async (req, res) => {
    try {
        const session = await PracticeSession.findOne({ 
            _id: req.params.sessionId, 
            userId: req.user._id 
        });

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found or unauthorized." });
        }

        return res.status(200).json({ success: true, session });
    } catch (error) {
        console.error("Error fetching practice session details:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch session details." });
    }
};

module.exports = {
    startPracticeSession, evaluateSessionAnswers, getPracticeHistory, getPracticeSessionById
};