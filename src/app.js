const express = require("express");




const app = express();// Creates an Express application

app.use(express.json()); // Middleware to  Parse incoming JSON data and store it in req.body


// require all the routes here
const authRouter = require("./routes/auth.routes");

//using all the routes here
app.use("/api/auth", authRouter); 





module.exports = app;




