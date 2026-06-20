const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")


async function authUser(req, res, next) {
    // Accept token from cookie OR Authorization header (Bearer token)
    let token = req.cookies.token

    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1]
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Token not found. Unauthorized" })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })
    if (isTokenBlacklisted) {
        return res.status(401).json({ message: "Token is blacklisted. Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid token. Unauthorized" })
    }
}

module.exports = { authUser }