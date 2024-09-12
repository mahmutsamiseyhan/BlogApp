// Express kütüphanesini ve Router'ı dahil et
const express = require("express");
// Yeni bir Express router nesnesi oluşturur
const router = express.Router();
// User controller'ını dahil et
const userController = require("../controllers/user");


// Belirli bir kategoriye ait blog yazılarını listeleme endpoint'i
// URL: /blogs/category/:slug
// :slug, kategori adını temsil eder
// Örneğin: /blogs/category/technology gibi bir URL, 'technology' kategorisindeki blogları listeler
router.get("/blogs/category/:slug", userController.blog_list);

// Belirli bir blog yazısının detaylarını gösteren endpoint
// URL: /blogs/:slug
// :slug, blog yazısının başlığını veya tanımlayıcısını temsil eder
// Örneğin: /blogs/my-first-post gibi bir URL, 'my-first-post' başlıklı blogun detaylarını gösterir
router.get("/blogs/:slug", userController.blogs_details);

// Tüm blog yazılarını listeleme endpoint'i
// URL: /blogs
// Bu endpoint, veritabanındaki tüm blogları listeler
router.get("/blogs", userController.blog_list);

// Ana sayfa endpoint'i
// URL: /
// Bu endpoint, uygulamanın ana sayfasını render eder
router.get("/", userController.index);

// Router'ı dışa aktar
// Bu, tanımlanan rotaların uygulamanın diğer bölümlerinde kullanılmasına olanak tanır
module.exports = router;
