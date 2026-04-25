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
 *         - tc
 *         - ad_soyad
 *         - email
 *         - sifre
 *       properties:
 *         tc:
 *           type: string
 *           description: T.C. Kimlik Numarası
 *         ad_soyad:
 *           type: string
 *         email:
 *           type: string
 *         sifre:
 *           type: string
 *         kan_grubu:
 *           type: string
 *         kronik_hastaliklar:
 *           type: string
 *         dogum_tarihi:
 *           type: string
 *           format: date
 *         telefon:
 *           type: string
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı oluşturur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *       400:
 *         description: Hatalı istek
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi yapar ve JWT döner
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - sifre
 *             properties:
 *               email:
 *                 type: string
 *               sifre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Başarılı giriş
 *       401:
 *         description: Yetkisiz erişim
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mevcut kullanıcının profil bilgilerini getirir
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil bilgileri
 *       401:
 *         description: Yetkisiz
 */
router.get('/me', authMiddleware, AuthController.getMe);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Kullanıcı profilini günceller
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
 *         description: Profil güncellendi
 */
router.put('/profile', authMiddleware, AuthController.updateProfile);

module.exports = router;
