require("dotenv").config(); // load environment variable from .env file to process.env

const app = require("./src/app"); // load express app
const connectToDB = require("./src/config/database"); // load db connection function
const { startDailyReminders } = require("./src/jobs/cronTasks"); // Cron function

connectToDB()


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startDailyReminders(); // ✅ Server + DB ready, ab cron safe hai
});