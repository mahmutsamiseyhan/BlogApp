// Gerekli model ve yardımcı dosyalar dahil ediliyor
const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const fs = require("fs");
const slugField = require("../helpers/slugfield");

// Blog silme sayfasını gösterir
exports.get_blog_delete = async function(req, res){
    // URL'den blog ID'sini ve oturumdan kullanıcı ID'sini alır
    const blogid = req.params.blogid;
    const userid = req.session.userid;
    const isAdmin = req.session.roles.includes("admin"); // Kullanıcının admin olup olmadığını kontrol eder

    try {
        // Blog'u kullanıcı yetkilerine göre bulur
        const blog = await Blog.findOne(
            isAdmin ? {_id: blogid} : {_id: blogid, userId: userid}
        );

        if(blog) {
            // Blog bulunduysa, silme onay sayfasını gösterir
            return res.render("admin/blog-delete", {
                title: "delete blog",
                blog: blog
            });
        }
        res.redirect("/admin/blogs"); // Blog bulunamazsa blog listesine yönlendirir
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Blog silme işlemini gerçekleştirir
exports.post_blog_delete = async function(req, res) {
    const blogid = req.body.blogid; // Formdan gelen blog ID'sini alır
    try {
        const blog = await Blog.findById(blogid); // Blog'u bulur
        if(blog) {
            await blog.remove(); // Blog bulunduysa silinir
            return res.redirect("/admin/blogs?action=delete"); // Silme işlemi sonrası yönlendirme yapılır
        }
        res.redirect("/admin/blogs"); // Blog bulunamazsa yönlendirir
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Kategori silme sayfasını gösterir
exports.get_category_delete = async function(req, res){
    const categoryid = req.params.categoryid; // URL'den kategori ID'sini alır

    try {
        const category = await Category.findById(categoryid); // Kategoriyi bulur

        res.render("admin/category-delete", {
            title: "delete category",
            category: category
        }); // Silme sayfasını gösterir
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Kategori silme işlemini gerçekleştirir
exports.post_category_delete = async function(req, res) {
    const categoryid = req.body.categoryid; // Formdan kategori ID'sini alır
    try {
        await Category.findByIdAndDelete(categoryid); // Kategoriyi siler
        res.redirect("/admin/categories?action=delete"); // Silme işlemi sonrası yönlendirme yapılır
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Yeni blog oluşturma sayfasını gösterir
// Blog oluşturma sayfasını gösterir
exports.get_blog_create = async function(req, res) {
    try {
        const categories = await Category.find(); // Kategorileri veritabanından al
        res.render("admin/blog-create", {
            title: "Yeni Blog Oluştur",
            categories: categories,
            values: req.body || {}, // `values` değişkenini `req.body` ile doldur veya boş bir obje gönder
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        console.log("Kategori alınırken hata oluştu:", err);
        res.redirect('/admin/blogs');
    }
};

// Yeni blog oluşturma işlemini gerçekleştirir
// Blog oluşturma işlemi
exports.post_blog_create = async function(req, res) {
    const baslik = req.body.baslik;
    const altbaslik = req.body.altbaslik;
    const aciklama = req.body.aciklama;
    const anasayfa = req.body.anasayfa == "on" ? true : false;
    const onay = req.body.onay == "on" ? true : false;
    const categories = req.body.categories || []; // Seçilen kategorileri alır
    const userid = req.session.userid;
    let resim = "";

    try {
        // Başlık ve açıklama doğrulama işlemleri
        if (baslik == "") {
            throw new Error("Başlık boş geçilemez");
        }

        if (baslik.length < 5 || baslik.length > 20) {
            throw new Error("Başlık 5-20 karakter aralığında olmalıdır.");
        }

        if (aciklama == "") {
            throw new Error("Açıklama boş geçilemez");
        }

        // Resim yükleme kontrolü ve eski resmin silinmesi
        if (req.file) {
            resim = req.file.filename;

            fs.unlink("./public/images/" + req.body.resim, err => {
                if (err) {
                    console.log("Eski resim silinirken hata oluştu:", err);
                }
            });
        }

        // Yeni blog oluşturma
        const newBlog = await Blog.create({
            baslik: baslik,
            url: slugField(baslik), // Başlıktan URL oluşturur
            altbaslik: altbaslik,
            aciklama: aciklama,
            resim: resim,
            anasayfa: anasayfa,
            onay: onay,
            userId: userid,
            categories: categories // Seçilen kategorileri bloga ekler
        });

        res.redirect("/admin/blogs?action=create"); // Blog oluşturulduktan sonra yönlendirme yapılır
    } catch (err) {
        let hataMesaji = "";

        if (err instanceof Error) {
            hataMesaji += err.message;

            // Hata durumunda hata mesajı ve kullanıcı girdileri ile sayfayı yeniden gösterir
            res.render("admin/blog-create", {
                title: "add blog",
                categories: await Category.find(),
                message: { text: hataMesaji, class: "danger" },
                values: {
                    baslik: baslik,
                    altbaslik: altbaslik,
                    aciklama: aciklama,
                    categories: categories // Seçili kategorileri korur
                }
            });
        }
    }
};

// Yeni kategori oluşturma sayfasını gösterir
exports.get_category_create = async function(req, res) {
    try {
        res.render("admin/category-create", {
            title: "add category"
        }); // Kategori oluşturma sayfasını gösterir
    }
    catch(err) {
        res.redirect("/500"); // Hata durumunda hata sayfasına yönlendirir
    }
}

// Yeni kategori oluşturma işlemini gerçekleştirir

// Kategori oluşturma işlemi
exports.post_category_create = async function(req, res, next) {
    try {
        const { name } = req.body; // İstekten gelen kategori adı
        const url = slugField(name); // Kategorinin URL'si için slug oluştur

        // Yeni kategori oluştur
        const newCategory = new Category({
            name: name,
            url: url // Oluşturulan slug URL olarak kullanılır
        });

        await newCategory.save(); // Kategoriyi veritabanına kaydet

        req.session.message = { text: "Kategori başarıyla oluşturuldu", class: "success" };
        res.redirect("/admin/categories");
    } catch (err) {
        console.log("Kategori oluşturma sırasında hata oluştu:", err);
        req.session.message = { text: "Kategori oluşturulurken bir hata oluştu.", class: "danger" };
        res.redirect("/admin/category/create");
    }
};
// Blog düzenleme sayfasını gösterir
exports.get_blog_edit = async function(req, res) {
    const blogid = req.params.blogid; // URL'den blog ID'sini alır
    const userid = req.session.userid;

    const isAdmin = req.session.roles.includes("admin"); // Kullanıcının admin olup olmadığını kontrol eder

    try {
        const blog = await Blog.findOne(
            isAdmin ? {_id: blogid} : {_id: blogid, userId: userid}
        ).populate('categories'); // Blog'u kategorileriyle birlikte bulur

        const categories = await Category.find(); // Tüm kategorileri getirir

        if(blog) {
            return res.render("admin/blog-edit", {
                title: blog.baslik,
                blog: blog,
                categories: categories
            }); // Blog düzenleme sayfasını gösterir
        }

        res.redirect("/admin/blogs"); // Blog bulunamazsa blog listesine yönlendirir
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Blog düzenleme işlemini gerçekleştirir
exports.post_blog_edit = async function(req, res) {
    // Formdan gelen tüm bilgileri alır
    const blogid = req.body.blogid;
    const baslik = req.body.baslik;
    const altbaslik = req.body.altbaslik;
    const aciklama = req.body.aciklama;
    const kategoriIds = req.body.categories;
    const url = req.body.url;
    const userid = req.session.userid;

    let resim = req.body.resim;

    if(req.file) {
        resim = req.file.filename;

        fs.unlink("./public/images/" + req.body.resim, err => {
            console.log(err);
        });
    }

    const anasayfa = req.body.anasayfa == "on" ? true : false;
    const onay = req.body.onay == "on" ? true : false;
    const isAdmin = req.session.roles.includes("admin");

    try {
        const blog = await Blog.findOne(
            isAdmin ? {_id: blogid} : {_id: blogid, userId: userid}
        );

        if(blog) {
            // Blog bilgilerini günceller
            blog.baslik = baslik;
            blog.altbaslik = altbaslik;
            blog.aciklama = aciklama;
            blog.resim = resim;
            blog.anasayfa = anasayfa;
            blog.onay = onay;
            blog.url = url;
            
            if(kategoriIds == undefined) {
                blog.categories = [];
            } else {
                blog.categories = kategoriIds;
            }

            await blog.save(); // Blogu kaydeder
            return res.redirect("/admin/blogs?action=edit&blogid=" + blogid); // Düzenleme sonrası yönlendirme yapılır
        }
        res.redirect("/admin/blogs"); // Blog bulunamazsa yönlendirme yapılır
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Belirli bir kategoriyi bir blogdan kaldırır
exports.get_category_remove = async function(req, res) {
    const blogid = req.body.blogid; // Formdan gelen blog ID'si
    const categoryid = req.body.categoryid; // Formdan gelen kategori ID'si

    try {
        await Blog.findByIdAndUpdate(blogid, {
            $pull: { categories: categoryid }
        }); // Blogdan kategoriyi çıkarır
        res.redirect("/admin/categories/" + categoryid); // Yönlendirme yapılır
    } catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Kategori düzenleme sayfasını gösterir
exports.get_category_edit = async function(req, res) {
    const categoryid = req.params.categoryid; // URL'den kategori ID'sini alır

    try {
        const category = await Category.findById(categoryid); // Kategoriyi bulur
        const blogs = await Blog.find({categories: categoryid}); // Bu kategoriye ait blogları bulur
        const countBlog = blogs.length; // Blog sayısını hesaplar

        if(category) {
            return res.render("admin/category-edit", {
                title: category.name,
                category: category,
                blogs: blogs,
                countBlog: countBlog
            }); // Kategori düzenleme sayfasını gösterir
        }

        res.redirect("admin/categories"); // Kategori bulunamazsa yönlendirme yapılır
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Kategori düzenleme işlemini gerçekleştirir
exports.post_category_edit = async function(req, res) {
    const categoryid = req.body.categoryid; // Formdan kategori ID'sini alır
    const name = req.body.name; // Formdan yeni kategori ismini alır

    try {
        await Category.findByIdAndUpdate(categoryid, {
            name: name
        }); // Kategoriyi günceller
        return res.redirect("/admin/categories?action=edit&categoryid=" + categoryid); // Düzenleme sonrası yönlendirme yapılır
    }    
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Blog listesini gösterir
exports.get_blogs = async function(req, res) {
    const userid = req.session.userid; // Oturumdan kullanıcı ID'sini alır
    const isModerator = req.session.roles.includes("moderator"); // Kullanıcının moderator olup olmadığını kontrol eder
    const isAdmin = req.session.roles.includes("admin"); // Kullanıcının admin olup olmadığını kontrol eder

    try {
        let query = {};
        if (isModerator && !isAdmin) {
            query.userId = userid; // Eğer kullanıcı moderator ise ve admin değilse sadece kendi bloglarını gösterir
        }

        const blogs = await Blog.find(query).select('id baslik altbaslik resim').populate('categories', 'name'); // Blogları getirir
        
        res.render("admin/blog-list", {
            title: "blog list",
            blogs: blogs,
            action: req.query.action,
            blogid: req.query.blogid
        }); // Blog listesi sayfasını gösterir
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Kategori listesini gösterir
exports.get_categories = async function(req, res) {
    try {
        const categories = await Category.find(); // Tüm kategorileri getirir

        res.render("admin/category-list", {
            title: "blog list",
            categories: categories,
            action: req.query.action,
            categoryid: req.query.categoryid
        }); // Kategori listesi sayfasını gösterir
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Rol listesini gösterir
exports.get_roles = async function(req, res) {
    try {
        const roles = await Role.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'roles',
                    as: 'users'
                }
            },
            {
                $project: {
                    _id: 1,
                    rolename: 1,
                    user_count: { $size: "$users" } // Her rol için kullanıcı sayısını hesaplar
                }
            }
        ]);

        res.render("admin/role-list", {
            title: "role list",
            roles: roles
        });// Rol listesi sayfasını gösterir
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Rol düzenleme sayfasını gösterir
exports.get_role_edit = async function(req, res) {
    const roleid = req.params.roleid; // URL'den rol ID'sini alır
    try {
        const role = await Role.findById(roleid); // Rolü bulur
        const users = await User.find({roles: roleid}); // Bu role sahip kullanıcıları bulur
        if(role) {
            return res.render("admin/role-edit", {
                title: role.rolename,
                role: role,
                users: users
            }); // Rol düzenleme sayfasını gösterir
        }

        res.redirect("admin/roles"); // Rol bulunamazsa yönlendirme yapılır
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Rol düzenleme işlemini gerçekleştirir
exports.post_role_edit = async function(req, res) {
    const roleid = req.body.roleid; // Formdan rol ID'sini alır
    const rolename = req.body.rolename; // Formdan yeni rol ismini alır
    try {
        await Role.findByIdAndUpdate(roleid, {
            rolename: rolename
        }); // Rolü günceller
        return res.redirect("/admin/roles"); // Düzenleme sonrası yönlendirme yapılır
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}
// Rol silme onay sayfasını gösterir
exports.get_role_delete = async function(req, res) {
    const roleId = req.params.roleId; // URL'den rol ID'sini alır

    try {
        const role = await Role.findById(roleId); // Rolü bulur
        if (role) {
            // Rol bulunduysa, silme onay sayfasını gösterir
            return res.render("admin/role-delete", {
                title: "Rolü Sil",
                role: role,
                csrfToken: req.csrfToken() // CSRF token'ını şablona gönder
            });
        }
        res.redirect("/admin/roles"); // Rol bulunamazsa rol listesine yönlendirir
    } catch (err) {
        console.log(err); // Hata konsola yazdırılır
        res.redirect("/admin/roles");
    }
}

// Rol silme işlemini gerçekleştirir
exports.post_role_delete = async function(req, res) {
    const roleId = req.body.roleId; // Formdan gelen rol ID'sini alır

    try {
        const role = await Role.findById(roleId); // Rolü bulur
        if (role) {
            await role.remove(); // Rol bulunduysa silinir
            return res.redirect("/admin/roles?action=delete"); // Silme işlemi sonrası yönlendirme yapılır
        }
        res.redirect("/admin/roles"); // Rol bulunamazsa yönlendirir
    } catch (err) {
        console.log(err); // Hata konsola yazdırılır
        res.redirect("/admin/roles");
    }
}

// Kullanıcı silme onay sayfasını gösterir
exports.get_user_delete = async function(req, res){
    const userId = req.params.userId; // URL'den kullanıcı ID'sini alır

    try {
        const user = await User.findById(userId); // Kullanıcıyı bulur
        if(user) {
            // Kullanıcı bulunduysa, silme onay sayfasını gösterir
            return res.render("admin/user-delete", {
                title: "Kullanıcıyı Sil",
                user: user,
                csrfToken: req.csrfToken() // CSRF token'ını şablona gönder
            });
        }
        res.redirect("/admin/users"); // Kullanıcı bulunamazsa kullanıcı listesine yönlendirir
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
        res.redirect("/admin/users");
    }
}


// Kullanıcı silme işlemini gerçekleştirir
exports.post_user_delete = async function(req, res) {
    const userId = req.body.userId; // Formdan gelen kullanıcı ID'sini alır

    try {
        const user = await User.findById(userId); // Kullanıcıyı bulur
        if(user) {
            await user.remove(); // Kullanıcı bulunduysa silinir
            return res.redirect("/admin/users?action=delete"); // Silme işlemi sonrası yönlendirme yapılır
        }
        res.redirect("/admin/users"); // Kullanıcı bulunamazsa yönlendirir
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
        res.redirect("/admin/users");
    }
}


// Kullanıcı listesini gösterir
exports.get_user = async function(req,res) {
    try {
        const users = await User.find().select('id fullname email').populate('roles', 'rolename'); // Kullanıcıları getirir ve rollerini dahil eder

        res.render("admin/user-list", {
            title: "user list",
            users: users
        }); // Kullanıcı listesi sayfasını gösterir
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Kullanıcı düzenleme sayfasını gösterir
exports.get_user_edit = async function(req,res) {
    const userid = req.params.userid; // URL'den kullanıcı ID'sini alır
    try {
        const user = await User.findById(userid).populate('roles'); // Kullanıcıyı roller ile birlikte bulur
        const roles = await Role.find(); // Tüm rolleri getirir

        res.render("admin/user-edit", {
            title: "user edit",
            user: user,
            roles: roles
        }); // Kullanıcı düzenleme sayfasını gösterir
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}

// Kullanıcı düzenleme işlemini gerçekleştirir
exports.post_user_edit = async function(req,res) {
    const userid = req.body.userid; // Formdan kullanıcı ID'sini alır
    const fullname = req.body.fullname; // Formdan tam adını alır
    const email = req.body.email; // Formdan e-posta adresini alır
    const roleIds = req.body.roles; // Formdan seçilen rolleri alır

    try {
        const user = await User.findById(userid); // Kullanıcıyı bulur

        if(user) {
            // Kullanıcı bilgilerini günceller
            user.fullname = fullname;
            user.email = email;
            user.roles = roleIds || []; // Rol listesi boşsa boş bir dizi olarak ayarlar

            await user.save(); // Kullanıcıyı kaydeder
            return res.redirect("/admin/users"); // Düzenleme sonrası yönlendirme yapılır
        }
        return res.redirect("/admin/users"); // Kullanıcı bulunamazsa yönlendirme yapılır
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
    }
}