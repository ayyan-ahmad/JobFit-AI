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
const updateUserPoints = async (userId, aiScore, topicsWithDifficulty = []) => {
    try {
        const basePoints = 10; // Sirf participate karne ke liye chota inam
        const performancePoints = Math.round(aiScore || 0); // Score out of 10

        let totalEarnedPoints = 0;

        if (performancePoints > 0) {
            // Calculate average difficulty multiplier
            let totalMultiplier = 0;
            let count = 0;
            
            if (topicsWithDifficulty.length > 0) {
                topicsWithDifficulty.forEach(t => {
                    const diff = t.difficulty || 'medium';
                    totalMultiplier += (diff === 'hard' ? 2 : diff === 'medium' ? 1.5 : 1);
                    count++;
                });
            }
            
            const multiplier = count > 0 ? (totalMultiplier / count) : 1.5; // Default to medium (1.5)
            
            // Formula: Base (10) + (Performance * 10 * Multiplier)
            totalEarnedPoints = Math.round(basePoints + (performancePoints * 10 * multiplier));
        } else {
            // Zero effort pe zero points (Spam prevention)
            totalEarnedPoints = 0;
        }

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