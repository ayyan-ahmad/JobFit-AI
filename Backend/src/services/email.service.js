const nodemailer = require('nodemailer');

// Transporter configuration: Yeh humare Node app ko SMTP server se connect karta hai
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports (like 587)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * @description Sends a daily interview preparation reminder email to the user.
 * @param {string} to - User's email address
 * @param {string} userName - User's name
 * @param {string} jobTitle - The job role they are preparing for
 * @param {number} dayNumber - Which day of the plan it is
 * @param {Array<string>} tasks - The tasks for the day
 */
const sendReminderEmail = async (to, userName, jobTitle, dayNumber, tasks) => {
    try {
        // Converting tasks array into an HTML list for a clean email format
        const tasksHtml = tasks.map(task => `<li>${task}</li>`).join('');

        const mailOptions = {
            from: `"JobFit AI Assistant" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: `Day ${dayNumber} Mission: Prepare for your ${jobTitle} Interview! 🚀`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>Hello ${userName}! 👋</h2>
                    <p>Welcome to <strong>Day ${dayNumber}</strong> of your interview preparation for the <strong>${jobTitle}</strong> role.</p>
                    
                    <p>Here are your tasks for today. Log in to JobFit AI and mark them as completed once you are done!</p>
                    
                    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <ul style="margin: 0; padding-left: 20px;">
                            ${tasksHtml}
                        </ul>
                    </div>

                    <p>Consistency is key. You've got this!</p>
                    <br/>
                    <p>Best regards,<br/><strong>JobFit AI Team</strong></p>
                </div>
            `,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Service] Reminder sent to ${to}. Message ID: ${info.messageId}`);
        return true;

    } catch (error) {
        console.error(`[Email Service Error] Failed to send email to ${to}:`, error);
        return false;
    }
};

module.exports = {
    sendReminderEmail
};