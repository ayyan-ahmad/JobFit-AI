const express = require("express");
const cookieParser = require("cookie-parser")




const app = express();// Creates an Express application

app.use(express.json()); // Middleware to  Parse incoming JSON data and store it in req.body
app.use(cookieParser()) // Middleware to parse cookies from incoming requests and populate req.cookies with an object containing the cookie data

// require all the routes here
const authRouter = require("./routes/auth.routes");

//using all the routes here
app.use("/api/auth", authRouter); 





module.exports = app;




