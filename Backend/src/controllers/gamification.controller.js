const userModel = require("../models/user.models.js"); 

// 1. Leaderboard Fetch karne ka function (Naye Page ke liye)
const getLeaderboard = async (req, res) => {
    try {
        // Users ko unke totalPoints ke descending (highest to lowest) order mein sort kiya
        const leaderboard = await userModel.find({}, 'username totalPoints practiceSessionsCompleted')
            .sort({ totalPoints: -1 })
            .limit(50); // Top 50 users ko fetch karega

        return res.status(200).json({
            success: true,
            data: leaderboard
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Leaderboard fetch karne mein error aaya",
            error: error.message
        });
    }
};

// 2. Points update karne ka function (Internal Use/API endpoint dono ke liye)
const updateUserPoints = async (userId, aiScore) => {
    try {
        const basePoints = 20; // 10 questions complete karne ke fixed points
        const performancePoints = Math.round(aiScore || 0); // Gemini ka score
        const totalEarnedPoints = basePoints + performancePoints;

        const updatedUser = await userModel.findByIdAndUpdate( 
            userId,
            {
                $inc: {
                    totalPoints: totalEarnedPoints,
                    practiceSessionsCompleted: 1
                }
            },
            { new: true }
        );

        return {
            success: true,
            earnedPoints: totalEarnedPoints,
            totalPoints: updatedUser.totalPoints
        };
    } catch (error) {
        console.error("Points update failed:", error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { getLeaderboard, updateUserPoints };