const mongoose = require('mongoose');


/**
 * ==================================================
 *                INPUT TO AI
 * ==================================================
 *
 * User will provide:
 *
 * @property {string} jobDescription
 * Job description of the target role.
 *
 * @property {string} resumeText
 * Extracted text from the user's resume.
 *
 * @property {string} selfDescription
 * User's self-introduction or background summary.
 *
 *
 * ==================================================
 *               OUTPUT FROM AI
 * ==================================================
 *
 * @property {number} matchScore
 * Resume-job match score (0-100).
 *
 *
 * @property {Array<Object>} technicalQuestions
 * List of technical interview questions.
 *
 * technicalQuestions = [
 *   {
 *     question: string,
 *     intention: string,
 *     answer: string
 *   }
 * ]
 *
 *
 * @property {Array<Object>} behavioralQuestions
 * List of behavioral interview questions.
 *
 * behavioralQuestions = [
 *   {
 *     question: string,
 *     intention: string,
 *     answer: string
 *   }
 * ]
 *
 *
 * @property {Array<Object>} skillGaps
 * Missing or weak skills identified by AI.
 *
 * skillGaps = [
 *   {
 *     skill: string,
 *     type: string,
 *     priority: "low" | "medium" | "high"
 *   }
 * ]
 *
 *
 * @property {Array<Object>} preparationPlan
 * Personalized preparation roadmap.
 *
 * preparationPlan = [
 *   {
 *     day: number,
 *     focus: string,
 *     tasks: string[]
 *   }
 * ]
 *
 *
 * ==================================================
 *               EXAMPLE RESPONSE
 * ==================================================
 *
 * {
 *   matchScore: 82,
 *
 *   technicalQuestions: [
 *     {
 *       question: "What is React Virtual DOM?",
 *       intention: "Evaluate React fundamentals",
 *       answer: "Virtual DOM is a lightweight copy..."
 *     }
 *   ],
 *
 *   behavioralQuestions: [
 *     {
 *       question: "Tell me about a challenge you faced.",
 *       intention: "Assess problem-solving ability",
 *       answer: "During a project..."
 *     }
 *   ],
 *
 *   skillGaps: [
 *     {
 *       skill: "Docker",
 *       type: "DevOps",
 *       priority: "high"
 *     }
 *   ],
 *
 *   preparationPlan: [
 *     {
 *       day: 1,
 *       focus: "React Fundamentals",
 *       tasks: [
 *         "Learn Components",
 *         "Practice Hooks",
 *         "Build Todo App"
 *       ]
 *     }
 *   ]
 * }
 */


const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [true, "Job title is required"]
    }
}, {
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;  