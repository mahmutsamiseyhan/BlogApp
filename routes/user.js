// Express kütüphanesini ve Router'ı dahil et
const express = require("express");
const router = express.Router(); // Router'ı oluştur

// User controller'ını dahil et
const userController = require("../controllers/user");

// Belirli bir kategoriye ait blog yazılarını listeleme endpoint'i
// URL: /blogs/category/:slug
// :slug, kategori adını temsil eder
router.get("/blogs/category/:slug", userController.blog_list);

// Belirli bir blog yazısının detaylarını gösteren endpoint
// URL: /blogs/:slug
// :slug, blog yazısının başlığını veya tanımlayıcısını temsil eder
router.get("/blogs/:slug", userController.blogs_details);

// Tüm blog yazılarını listeleme endpoint'i
// URL: /blogs
router.get("/blogs", userController.blog_list);

// Ana sayfa endpoint'i
// URL: /
router.get("/", userController.index);

// Router'ı dışa aktar
module.exports = router;
