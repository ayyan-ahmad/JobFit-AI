require("dotenv").config(); // load environment variable from .env file to process.env

const app = require("./src/app"); // load express app
const connectToDB = require("./src/config/database"); // load db connection function


connectToDB()


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});