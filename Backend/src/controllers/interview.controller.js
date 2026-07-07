const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf, evaluateInterviewAnswers } = require("../services/ai.services")
const interviewReportModel = require("../models/interviewReport.model")
const MockResultModel = require("../models/mockResult.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        // Resume is optional - extract text only if file was uploaded
        let resumeText = ""
        if (req.file && req.file.buffer) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = resumeContent.text
        }

        const { selfDescription, jobDescription } = req.body

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required." })
        }

        if (!selfDescription && !resumeText) {
            return res.status(400).json({ message: "Either a resume or self description is required." })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })
        // 🔴 CHANGE 1: Har plan day ke liye targetDate compute karna
        if (interViewReportByAi && interViewReportByAi.preparationPlan) {
            interViewReportByAi.preparationPlan = interViewReportByAi.preparationPlan.map((plan) => {
                const targetDate = new Date();
                // Aaj ki date mein jitne dynamic "day" hain unhe add kar rahe hain (e.g., Day 1 = Tomorrow)
                targetDate.setDate(targetDate.getDate() + Number(plan.day));

                return {
                    ...plan,
                    targetDate: targetDate
                };
            });
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error in generateInterViewReportController:", error)

        // Detect Gemini API rate limit (429) errors
        const isRateLimit =
            error?.status === 429 ||
            error?.code === 429 ||
            (typeof error?.message === "string" && error.message.toLowerCase().includes("rate limit")) ||
            (typeof error?.message === "string" && error.message.toLowerCase().includes("quota")) ||
            (typeof error?.message === "string" && error.message.toLowerCase().includes("resource_exhausted"))

        if (isRateLimit) {
            return res.status(429).json({
                message: "AI limit reached. Please wait a moment and try again.",
                error: "rate_limit"
            })
        }

        res.status(500).json({
            message: "Failed to generate interview report.",
            error: error.message
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const html = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.status(200).json({ html })

    } catch (error) {
        console.error("Error in generateResumePdfController:", error)

        const isRateLimit =
            error?.status === 429 ||
            error?.code === 429 ||
            (typeof error?.message === "string" && error.message.toLowerCase().includes("rate limit")) ||
            (typeof error?.message === "string" && error.message.toLowerCase().includes("quota")) ||
            (typeof error?.message === "string" && error.message.toLowerCase().includes("resource_exhausted")) ||
            (typeof error?.message === "string" && error.message.toLowerCase().includes("too many requests"))

        if (isRateLimit) {
            return res.status(429).json({
                message: "AI is currently busy due to high traffic. Please wait a moment and try again.",
                error: "rate_limit"
            })
        }

        res.status(500).json({
            message: "Failed to generate resume PDF. Please try again later.",
            error: error.message
        })
    }
}

/**
 * 🔴 CHANGE 2: Naya Controller Jo Frontend Checkbox Ka State Update Karega
 * @description Controller to update the completion status of a specific day's plan.
 */
async function updatePlanStatusController(req, res) {
    try {
        const { interviewId, day } = req.params;
        const { isCompleted } = req.body; // Expecting boolean true/false

        // Using positional operator `$` to update the object matching the array element criteria
        const interviewReport = await interviewReportModel.findOneAndUpdate(
            {
                _id: interviewId,
                user: req.user.id,
                "preparationPlan.day": Number(day)
            },
            {
                $set: { "preparationPlan.$.isCompleted": isCompleted }
            },
            { new: true }
        );

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report or specific day not found." });
        }

        res.status(200).json({
            message: "Plan status updated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("Error in updatePlanStatusController:", error);
        res.status(500).json({ message: "Failed to update plan status.", error: error.message });
    }
}


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

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, updatePlanStatusController, evaluateMockInterviewController, getMockResultsController, getMockResultByIdController }
