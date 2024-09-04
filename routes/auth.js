// 'express' modülünü yükler.
const express = require("express");
// Yeni bir Express router nesnesi oluşturur.
const router = express.Router();
// 'express-rate-limit' modülünü yükler. Bu modül, belirli işlemler için oran sınırlaması (rate limiting) eklemeye yarar.
const rateLimit = require("express-rate-limit"); 

// Kimlik doğrulama denetleyicilerini yükler.
const authController = require("../controllers/auth");
// CSRF koruması için middleware'i yükler.
const csrf = require("../middlewares/csrf");

// Rate limiter: 15 dakikalık bir pencerede en fazla 5 giriş denemesine izin verir.
// Bu, brute force saldırılarını önlemeye yardımcı olur.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 5 // 15 dakika içinde maksimum 5 giriş denemesi
});

// Kayıt sayfası için GET isteği
router.get("/register", csrf, authController.get_register);
// Kayıt işlemi için POST isteği
router.post("/register", csrf, authController.post_register);

// Giriş sayfası için GET isteği
router.get("/login", csrf, authController.get_login);
// Giriş işlemi için POST isteği, rate limiter eklenir.
// Bu, kullanıcıların hızlı bir şekilde ardışık giriş denemesi yapmasını engeller.
router.post("/login", csrf, loginLimiter, authController.post_login);

// Şifre sıfırlama sayfası için GET isteği
router.get("/reset-password", csrf, authController.get_reset);
// Şifre sıfırlama işlemi için POST isteği
router.post("/reset-password", csrf, authController.post_reset);

// Yeni şifre sayfası için GET isteği (token ile)
// Kullanıcı şifresini sıfırlamak için özel bir token kullanır.
router.get("/new-password/:token", csrf, authController.get_newpassword);
// Yeni şifre işlemi için POST isteği
router.post("/new-password", csrf, authController.post_newpassword);

// Çıkış işlemi için GET isteği
router.get("/logout", csrf, authController.get_logout);

// Router'ı dışa aktarır, böylece başka dosyalarda kullanılabilir
module.exports = router;
