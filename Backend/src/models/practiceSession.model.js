const mongoose = require("mongoose");

// 1. Individual Question ka Schema (Mixed Types ke liye Flexible)
const PracticeQuestionSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    type: { 
        type: String, 
        required: true, 
        enum: ["subjective", "mcq", "msq"] // Strictly teenon formats accept honge
    },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    question: { type: String, required: true },
    
    // MCQ/MSQ ke liye options array hoga, subjective ke liye null rahega
    options: { 
        type: [String], 
        default: null 
    },
    
    // Flexible answer field: 
    // - Subjective ke liye: String (Ideal answer guidelines)
    // - MCQ ke liye: String (Single choice text)
    // - MSQ ke liye: [String] (Multiple choice texts)
    correctAnswer: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true 
    },
    
    interviewerIntent: { type: String }
});

// 2. Main Practice Session Schema (Track record maintain karne ke liye)
const PracticeSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Agar tumhare pas user authentication hai
        required: false // Agar abhi test ke liye guest user rkhna ho toh false kr dena
    },
    selectedTopics: {
        type: [String], // Array of strings jaise ['html', 'css', 'dsa']
        required: true
    },
    topicsWithDifficulty: [
        {
            topic: { type: String, required: true },
            difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" }
        }
    ],
    // Gemini dwara generated 10 questions yaha store honge
    questions: [PracticeQuestionSchema],
    
    // User ke answers store karne ka object array
    userAnswers: [
        {
            questionId: { type: Number, required: true },
            // Flexible kyuki user ka answer string bhi ho skta h (Subjective/MCQ) aur array bhi (MSQ)
            answer: { type: mongoose.Schema.Types.Mixed }, 
            isCorrect: { type: Boolean, default: null }, // Only for MCQ/MSQ (Auto evaluate ho skta h)
            score: { type: Number, default: 0 }, // Subjective aur partial marking ke liye
            feedback: { type: String, default: null } // Gemini se aane wala feedback for individual question
        }
    ],
    
    // Final Report Metrics
    evaluation: {
        totalScore: { type: Number, default: 0 }, // Score out of 10
        overallFeedback: { type: String, default: "" },
        completedAt: { type: Date }
    },
    
    status: {
        type: String,
        enum: ["created", "completed"],
        default: "created"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("PracticeSession", PracticeSessionSchema);