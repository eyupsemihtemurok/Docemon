const express = require('express');
const AuthController = require('../Controllers/AuthController');
const authMiddleware = require('../Middlewares/AuthMiddleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - nationalId
 *         - fullName
 *         - email
 *         - password
 *       properties:
 *         nationalId:
 *           type: string
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         bloodType:
 *           type: string
 *         chronicDiseases:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *         phone:
 *           type: string
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and get JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 */
router.get('/me', authMiddleware, AuthController.getMe);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', authMiddleware, AuthController.updateProfile);

module.exports = router;
