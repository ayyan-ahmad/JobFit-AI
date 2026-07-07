const mongoose = require('mongoose');

const evaluationItemSchema = new mongoose.Schema({
    question: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 10 },
    feedback: { type: String, required: true },
    modelAnswer: { type: String, required: true }
}, { _id: false });

const mockResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    overallScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    overallSummary: {
        type: String,
        required: true
    },
    evaluations: [evaluationItemSchema]
}, {
    timestamps: true
});

const MockResultModel = mongoose.model('MockResult', mockResultSchema);

module.exports = MockResultModel;
