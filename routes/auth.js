const express = require('express');
const authController = require('../controllers/auth')

const router = express.Router();

router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/botLogin', authController.botLogin)
router.post('/evalWebhook', authController.webhookEval)

module.exports = router;