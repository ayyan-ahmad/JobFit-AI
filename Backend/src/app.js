const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors")




const app = express();// Creates an Express application

app.use(express.json()); // Middleware to  Parse incoming JSON data and store it in req.body
app.use(cookieParser()) // Middleware to parse cookies from incoming requests and populate req.cookies with an object containing the cookie data
app.use(cors({// Middleware to enable Cross-Origin Resource Sharing (CORS) for the specified origin and allow credentials (cookies) to be included in cross-origin requests
    origin: "http://localhost:5173",
    credentials: true
}))

// require all the routes here
const authRouter = require("./routes/auth.routes");

//using all the routes here
app.use("/api/auth", authRouter); 





module.exports = app;




