const { evaluateInterviewAnswers } = require("../services/ai.services");
const MockResultModel = require("../models/mockResult.model");

/**
 * @description Controller to evaluate user's mock interview answers using AI.
 */
async function evaluateMockInterviewController(req, res) {
    try {
        const { qnaList } = req.body;

        // Validation: Ensure we received an array of questions and answers
        if (!qnaList || !Array.isArray(qnaList) || qnaList.length === 0) {
            return res.status(400).json({ 
                message: "A valid list of questions and answers (qnaList) is required." 
            });
        }

        // Call the AI Service
        const evaluationResult = await evaluateInterviewAnswers(qnaList);

        // Auto-save result to DB in background (silently)
        const savedResult = await MockResultModel.create({
            user: req.user.id,
            overallScore: evaluationResult.overallScore,
            overallSummary: evaluationResult.overallSummary,
            evaluations: evaluationResult.evaluations
        });

        // Send the result + saved ID back to frontend
        res.status(200).json({
            message: "Interview evaluated successfully.",
            resultId: savedResult._id,
            result: evaluationResult
        });

    } catch (error) {
        console.error("Error in evaluateMockInterviewController:", error);

        // Detect Gemini API rate limit (429) errors
        const isRateLimit =
            error?.status === 429 ||
            error?.code === 429 ||
            (typeof error?.message === "string" && error.message.toLowerCase().includes("rate limit")) ||
            (typeof error?.message === "string" && error.message.toLowerCase().includes("quota")) ||
            (typeof error?.message === "string" && error.message.toLowerCase().includes("resource_exhausted"));

        if (isRateLimit) {
            return res.status(429).json({
                message: "AI is currently busy evaluating other interviews. Please wait a moment and try again.",
                error: "rate_limit"
            });
        }

        res.status(500).json({
            message: "Failed to evaluate interview answers. Please try again.",
            error: error.message
        });
    }
}

/**
 * @description Controller to get all past mock interview results of the logged-in user.
 */
async function getMockResultsController(req, res) {
    try {
        const results = await MockResultModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select('overallScore overallSummary createdAt');

        res.status(200).json({
            message: "Mock results fetched successfully.",
            mockResults: results
        });
    } catch (error) {
        console.error("Error in getMockResultsController:", error);
        res.status(500).json({ message: "Failed to fetch mock results.", error: error.message });
    }
}

/**
 * @description Controller to get a single mock interview result by ID.
 */
async function getMockResultByIdController(req, res) {
    try {
        const { resultId } = req.params;
        const result = await MockResultModel.findOne({ _id: resultId, user: req.user.id });

        if (!result) {
            return res.status(404).json({ message: "Mock result not found." });
        }

        res.status(200).json({ message: "Mock result fetched successfully.", mockResult: result });
    } catch (error) {
        console.error("Error in getMockResultByIdController:", error);
        res.status(500).json({ message: "Failed to fetch mock result.", error: error.message });
    }
}

module.exports = {
    evaluateMockInterviewController,
    getMockResultsController,
    getMockResultByIdController
};
