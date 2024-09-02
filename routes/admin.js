// 'express' modülünü yükler ve yeni bir Express router nesnesi oluşturur.
const express = require("express");
const router = express.Router();
const Blog = require('../models/blog'); // Blog modelinizi doğru içe aktarın


// Yardımcı işlevler ve middleware'leri yükler.
const imageUpload = require("../helpers/image-upload"); // Görüntü yükleme işlemleri için yardımcı modül.
const csrf = require("../middlewares/csrf"); // CSRF koruması için middleware.
const adminController = require("../controllers/admin"); // Admin denetleyicilerini yükler.
const isAdmin = require("../middlewares/is-admin"); // Admin yetkisi kontrolü için middleware.
const isModerator = require("../middlewares/is-moderator"); // Moderator yetkisi kontrolü için middleware.

// Blog rotaları
router.get("/blogs", isModerator, adminController.get_blogs);
// "/blogs" URL'sine GET isteği yapıldığında, 'isModerator' middleware'i ve 'get_blogs' denetleyicisi çağrılır.

router.get("/blog/create", isModerator, csrf, adminController.get_blog_create);
// "/blog/create" URL'sine GET isteği yapıldığında, 'isModerator' middleware'i ve CSRF koruması uygulanır, ardından 'get_blog_create' denetleyicisi çağrılır.

router.post("/blog/create", isModerator, csrf, imageUpload.upload.single("resim"), adminController.post_blog_create);
// "/blog/create" URL'sine POST isteği yapıldığında, 'isModerator' middleware'i, CSRF koruması, tek dosya yükleme işlemi yapılır ve 'post_blog_create' denetleyicisi çağrılır.

router.get("/blogs/:blogid", isModerator, csrf, adminController.get_blog_edit);
// "/blogs/:blogid" URL'sine GET isteği yapıldığında, belirli bir blogu düzenlemek için 'get_blog_edit' denetleyicisi çağrılır.

router.post("/blogs/:blogid", isModerator, csrf, imageUpload.upload.single("resim"), adminController.post_blog_edit);
// "/blogs/:blogid" URL'sine POST isteği yapıldığında, blogu düzenler ve 'post_blog_edit' denetleyicisi çağrılır.

router.get("/blog/delete/:blogid", isModerator, csrf, adminController.get_blog_delete);
// "/blog/delete/:blogid" URL'sine GET isteği yapıldığında, blogu silmek için 'get_blog_delete' denetleyicisi çağrılır.

router.post("/blog/delete/:blogid", isModerator, adminController.post_blog_delete);
// "/blog/delete/:blogid" URL'sine POST isteği yapıldığında, blog silme işlemi gerçekleştirilir ve 'post_blog_delete' denetleyicisi çağrılır.

// Kategori rotaları
router.get("/categories", isAdmin, adminController.get_categories);
// "/categories" URL'sine GET isteği yapıldığında, admin yetkisi gerektirir ve 'get_categories' denetleyicisi çağrılır.

router.get("/category/create", isAdmin, csrf, adminController.get_category_create);
// "/category/create" URL'sine GET isteği yapıldığında, admin yetkisi gerektirir, CSRF koruması uygulanır ve 'get_category_create' denetleyicisi çağrılır.

router.post("/category/create", isAdmin, adminController.post_category_create);
// "/category/create" URL'sine POST isteği yapıldığında, admin yetkisi gerektirir ve 'post_category_create' denetleyicisi çağrılır.

router.get("/categories/:categoryid", isAdmin, csrf, adminController.get_category_edit);
// "/categories/:categoryid" URL'sine GET isteği yapıldığında, belirli bir kategoriyi düzenlemek için 'get_category_edit' denetleyicisi çağrılır.

router.post("/categories/:categoryid", isAdmin, adminController.post_category_edit);
// "/categories/:categoryid" URL'sine POST isteği yapıldığında, kategori düzenleme işlemi yapılır ve 'post_category_edit' denetleyicisi çağrılır.

router.get("/category/delete/:categoryid", isAdmin, csrf, adminController.get_category_delete);
// "/category/delete/:categoryid" URL'sine GET isteği yapıldığında, kategori silme sayfasını gösterir ve 'get_category_delete' denetleyicisi çağrılır.

router.post("/category/delete/:categoryid", isAdmin, adminController.post_category_delete);
// "/category/delete/:categoryid" URL'sine POST isteği yapıldığında, kategori silinir ve 'post_category_delete' denetleyicisi çağrılır.

router.post("/categories/remove", isAdmin, adminController.get_category_remove);
// "/categories/remove" URL'sine POST isteği yapıldığında, birden fazla kategoriyi kaldırır ve 'get_category_remove' denetleyicisi çağrılır.
// Blog ekleme route'u
router.post('/blog/create', async (req, res, next) => {
    try {
        // Blog oluşturma işlemleri
        // Örneğin: const newBlog = await Blog.create(req.body);

        // Başarılı olursa, başka bir sayfaya yönlendirme yapabilirsiniz
        res.redirect('/admin/blogs');
    } catch (error) {
        console.error('Blog ekleme hatası:', error.message);
        // Hata durumunda hata sayfasını göster
        res.render('admin/error', { message: 'Blog eklenirken bir hata oluştu.' });
    }
});
// Blog listesi route'u
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find(); // Tüm blogları MongoDB'den al
        res.render('admin/blog-list', { blogs }); // `blogs` verisini şablona aktar
    } catch (error) {
        console.error('Blogları alma hatası:', error);
        res.render('admin/error', { message: 'Bloglar yüklenirken bir hata oluştu.' });
    }
});
// Rol rotaları
router.get("/roles", isAdmin, adminController.get_roles);
// "/roles" URL'sine GET isteği yapıldığında, admin yetkisi gerektirir ve 'get_roles' denetleyicisi çağrılır.

router.get("/roles/:roleid", isAdmin, csrf, adminController.get_role_edit);
// "/roles/:roleid" URL'sine GET isteği yapıldığında, belirli bir rolü düzenlemek için 'get_role_edit' denetleyicisi çağrılır.

router.post("/roles/:roleid", isAdmin, adminController.post_role_edit);
// "/roles/:roleid" URL'sine POST isteği yapıldığında, rol düzenleme işlemi yapılır ve 'post_role_edit' denetleyicisi çağrılır.

// Kullanıcı Silme
router.get('/user/delete/:userId', adminController.get_user_delete); // Onay sayfasını gösterir
router.post('/user/delete', adminController.post_user_delete); // Silme işlemini gerçekleştirir


// Rol Silme
router.get('/role/delete/:roleId', adminController.get_role_delete); // Onay sayfasını gösterir
router.post('/role/delete', adminController.post_role_delete); // Silme işlemini gerçekleştirir


// Kullanıcı rotaları
router.get("/users", isAdmin, adminController.get_user);
// "/users" URL'sine GET isteği yapıldığında, admin yetkisi gerektirir ve 'get_user' denetleyicisi çağrılır.

router.get("/users/:userid", isAdmin, csrf, adminController.get_user_edit);
// "/users/:userid" URL'sine GET isteği yapıldığında, belirli bir kullanıcıyı düzenlemek için 'get_user_edit' denetleyicisi çağrılır.

router.post("/users/:userid", isAdmin, adminController.post_user_edit);
// "/users/:userid" URL'sine POST isteği yapıldığında, kullanıcı düzenleme işlemi yapılır ve 'post_user_edit' denetleyicisi çağrılır.

// Hata işleme middleware'i
router.use((err, req, res, next) => {
    // Hata yığını (stack) loglanır.
    console.error(err.stack);
    // Hata durumunda kullanıcıya bir hata sayfası gösterir.
    res.status(500).render('admin/error', { error: err });
});

// Router'ı dışa aktarır, böylece başka dosyalarda kullanılabilir.
module.exports = router;
