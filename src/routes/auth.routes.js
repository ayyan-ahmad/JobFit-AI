const express = require('express');
const authController = require('../controllers/auth.controller');




const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @description Login a user with email and password
 * @access Public
 */
authRouter.post('/login', authController.loginUserController)

/**
 * @route POST /api/auth/logout
 * @description Logout a user
 * @access Public
 */
authRouter.post('/logout', authController.logoutUserController)

/**
 * @route GET /api/auth/me
 * @description Get current logged-in user details
 * @access Private
 */
authRouter.get('/me', authController.getMeController)

module.exports = authRouter

