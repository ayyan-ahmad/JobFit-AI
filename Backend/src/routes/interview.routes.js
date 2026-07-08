const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const mockInterviewController = require("../controllers/mockInterview.controller")
const upload = require("../middlewares/filr.middleware")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)


/**
 * @route PATCH /api/interview/report/:interviewId/plan/:day
 * @description Update the completion status of a specific day's plan.
 * @access Private
 */
interviewRouter.patch("/report/:interviewId/plan/:day", authMiddleware.authUser, interviewController.updatePlanStatusController)


/**
 * @route POST /api/interview/evaluate
 * @description Evaluate the answers provided in a mock interview (auto-saves result to DB).
 * @access Private
 */
interviewRouter.post("/evaluate", authMiddleware.authUser, mockInterviewController.evaluateMockInterviewController);

/**
 * @route GET /api/interview/mock-results
 * @description Get all past mock interview results for the logged-in user.
 * @access Private
 */
interviewRouter.get("/mock-results", authMiddleware.authUser, mockInterviewController.getMockResultsController);

/**
 * @route GET /api/interview/mock-results/:resultId
 * @description Get a single mock interview result by ID.
 * @access Private
 */
interviewRouter.get("/mock-results/:resultId", authMiddleware.authUser, mockInterviewController.getMockResultByIdController);

module.exports = interviewRouter