// 'express' modülünü yükler.
const express = require('express');
// Yeni bir Express router nesnesi oluşturur.
const router = express.Router();
// 'checkRole' middleware'ini 'auth' middleware dosyasından içe aktarır.
// Bu middleware, belirli bir role sahip kullanıcıların erişimini kontrol etmek için kullanılır.
const { checkRole } = require('../middlewares/auth');

// Moderatör paneli rotası
// Ana URL ("/") için GET isteği yapıldığında, 'checkRole' middleware'i çağrılır.
// 'checkRole' middleware'i, kullanıcının 'moderator' rolüne sahip olup olmadığını kontrol eder.
router.get('/', checkRole('moderator'), (req, res) => {
    // Eğer kullanıcı 'moderator' rolüne sahipse, moderatör paneli sayfası render edilir.
    res.render('moderator/dashboard', { title: 'Moderator Paneli' });
});

// Router'ı dışa aktarır, böylece başka dosyalarda kullanılabilir.
module.exports = router;
