const cron = require('node-cron');
const interviewReportModel = require('../models/interviewReport.model');
const { sendReminderEmail } = require('../services/email.service');

// Cron Expression: "0 8 * * *" ka matlab hai har din subah 8:00 AM
// Testing ke liye agar tumhe har 1 minute mein chalana hai toh "* * * * *" likh sakte ho
const START_CRON_SCHEDULE = "0 8 * * *";

const startDailyReminders = () => {
    cron.schedule(START_CRON_SCHEDULE, async () => {
        console.log(`[Cron Engine] Running daily reminder check at ${new Date().toISOString()}`);

        try {
            // Step 1: Aaj ke din ki Start aur End limit set karna (Taaki exact time match na karna pade)
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);

            // Step 2: Database se wo reports nikalna jinka aaj ka task bacha hai
            // .populate("user") hume User model se email aur name la kar dega
            const reports = await interviewReportModel.find({
                "preparationPlan": {
                    $elemMatch: {
                        targetDate: { $gte: todayStart, $lte: todayEnd },
                        isCompleted: false,
                        reminderSent: false
                    }
                }
            }).populate('user');

            if (reports.length === 0) {
                console.log("[Cron Engine] No pending tasks for today. Sleeping.");
                return;
            }

            console.log(`[Cron Engine] Found ${reports.length} users with pending tasks today.`);

            // Step 3: Har report ko process karna aur email bhejna
            for (let report of reports) {
                const userEmail = report.user.email; // Assuming User model has 'email'
                const userName = report.user.name || "User"; // Assuming User model has 'name'
                const jobTitle = report.title;

                // Find the exact day plan from the array that matches today
                const todayPlanIndex = report.preparationPlan.findIndex(plan =>
                    plan.targetDate >= todayStart &&
                    plan.targetDate <= todayEnd &&
                    !plan.isCompleted &&
                    !plan.reminderSent
                );

                if (todayPlanIndex !== -1) {
                    const plan = report.preparationPlan[todayPlanIndex];

                    // Send the email
                    const isSent = await sendReminderEmail(
                        userEmail,
                        userName,
                        jobTitle,
                        plan.day,
                        plan.tasks
                    );

                    // Step 4: Agar email chala gaya, toh database update karo (Idempotency)
                    if (isSent) {
                        report.preparationPlan[todayPlanIndex].reminderSent = true;

                        // Sirf changed array element ko save karne ke liye
                        report.markModified(`preparationPlan.${todayPlanIndex}`);
                        await report.save();

                        console.log(`[Cron Engine] Updated reminderSent status for Interview ID: ${report._id}, Day: ${plan.day}`);
                    }
                }
            }

        } catch (error) {
            console.error("[Cron Engine Error] Failed to process daily reminders:", error);
        }
    }, {
        timezone: "Asia/kolkata"
    }
    );

    console.log("[Cron Engine] Daily reminder job initialized and waiting for schedule.");
};

module.exports = {
    startDailyReminders
};