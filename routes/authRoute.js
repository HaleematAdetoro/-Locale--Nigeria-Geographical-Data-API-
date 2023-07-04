const express = require("express");
const Router = express.Router();
const authController = require("../controllers/authController");
const validatorsMw = require("../middleware/validatorMw");
const User = require("../models/usermodel")

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage authentication
 */

/**
 * @swagger
 *   /api/v1/auth/signup:
 *     post:
 *       summary: Sign up user
 *       tags: [signup]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/signup'
 *       responses:
 *         "201":
 *           description: sign up successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/responses/201'
 *
 *
 *
 *         "400":
 *           description: Invalid user data
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/responses/401'
 *
 *
 *
 */

Router.post("/signup", validatorsMw("signup"), authController.signup);

/**
 * @swagger
 *   /api/v1/auth/login:
 *     post:
 *       summary: login user
 *       tags: [login]
 *       requestBody:
 *         description: You need to provide the API Key received after sign up
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/login'
 *       responses:
 *         "200":
 *            description: Login successful
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/responses/200'
 *
 *
 *         "401":
 *           description: unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/responses/401'
 *
 *
 *
 *
 *
 *
 */

Router.post("/login", validatorsMw("login"), authController.login);

module.exports = Router;
