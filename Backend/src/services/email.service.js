const emailjs = require('@emailjs/nodejs');

/**
 * @description Sends a daily interview preparation reminder email to the user via EmailJS API.
 * @param {string} to - User's email address
 * @param {string} userName - User's name
 * @param {string} jobTitle - The job role they are preparing for
 * @param {number} dayNumber - Which day of the plan it is
 * @param {Array<string>} tasks - The tasks for the day
*/
const sendReminderEmail = async (to, userName, jobTitle, dayNumber, tasks) => {
    try {
        // Converting tasks array into an HTML list for the email format
        const tasksHtml = tasks.map(task => `<li>${task}</li>`).join('');

        // Template parameters that EmailJS will inject into your email template
        const templateParams = {
            to_email: to,
            userName: userName,
            jobTitle: jobTitle,
            dayNumber: dayNumber,
            tasksHtml: tasksHtml
        };

        // Call the EmailJS Node API
        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            templateParams,
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY, // Private key is required for Node.js
            }
        );

        console.log(`[Email Service] Reminder sent to ${to} via EmailJS. Status: ${response.status}`);
        return true;

    } catch (error) {
        console.error(`[Email Service Error] Failed to send email to ${to} via EmailJS:`, error);
        return false;
    }
};

module.exports = {
    sendReminderEmail
};