const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit"); // Oran sınırlayıcı

const authController = require("../controllers/auth"); // Kimlik doğrulama denetleyicilerini yükler
const csrf = require("../middlewares/csrf"); // CSRF koruması için middleware

// Rate limiter: 15 dakikalık pencerede en fazla 5 giriş denemesi
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 5 // 15 dakika içinde maksimum 5 giriş denemesi
});

// Kayıt sayfası GET isteği
router.get("/register", csrf, authController.get_register);
// Kayıt işlemi POST isteği
router.post("/register", csrf, authController.post_register);

// Giriş sayfası GET isteği
router.get("/login", csrf, authController.get_login);
// Giriş işlemi POST isteği, rate limiter eklenebilir
router.post("/login", csrf, loginLimiter, authController.post_login);

// Şifre sıfırlama sayfası GET isteği
router.get("/reset-password", csrf, authController.get_reset);
// Şifre sıfırlama işlemi POST isteği
router.post("/reset-password", csrf, authController.post_reset);

// Yeni şifre sayfası GET isteği (token ile)
router.get("/new-password/:token", csrf, authController.get_newpassword);
// Yeni şifre işlemi POST isteği
router.post("/new-password", csrf, authController.post_newpassword);

// Çıkış işlemi GET isteği
router.get("/logout", csrf, authController.get_logout);

// Router'ı dışa aktarır, böylece başka dosyalarda kullanılabilir
module.exports = router;
