const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors")




const app = express();// Creates an Express application

app.use(express.json()); // Middleware to  Parse incoming JSON data and store it in req.body
app.use(cookieParser()) // Middleware to parse cookies from incoming requests and populate req.cookies with an object containing the cookie data

// Allow both localhost (dev) and Vercel (production) as origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://job-fit-ai-plum.vercel.app"
]

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error("CORS not allowed for origin: " + origin))
    },
    credentials: true
}))

// require all the routes here
const authRouter = require("./routes/auth.routes");
const interviewRouter= require("./routes/interview.routes")

//using all the routes here
app.use("/api/auth", authRouter); 
app.use("/api/interview", interviewRouter)



module.exports = app;
