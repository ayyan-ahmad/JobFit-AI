require("dotenv").config(); // load environment variable from .env file to process.env

const app = require("./src/app"); // load express app
const connectToDB = require("./src/config/database"); // load db connection function


connectToDB()

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});