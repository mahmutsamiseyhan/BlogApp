// Gerekli modüller ve yardımcı dosyalar dahil ediliyor
const User = require("../models/user");
const bcrypt = require("bcrypt"); // Şifreleme işlemleri için kullanılır
const sendMail = require("../helpers/send-mail"); // E-posta gönderme fonksiyonu
const config = require("../config"); // Uygulama konfigürasyonları
const crypto = require("crypto"); // Kriptografik işlemler için kullanılır
const jwt = require('jsonwebtoken'); // JSON Web Token oluşturma ve doğrulama işlemleri
const Role = require("../models/role"); // Rol modelini içe aktar

// BASE_URL için ortam değişkeni ayarlanıyor, yoksa varsayılan değer kullanılıyor
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Kullanıcı kayıt sayfasını gösterir
exports.get_register = async function(req, res, next) {
    try {
        // Kayıt sayfasını render eder
        return res.render("auth/register", {
            title: "Kayıt Ol",
            csrfToken: req.csrfToken() // CSRF koruması için token gönderilir
        });
    } catch (err) {
        next(err); // Hata durumunda sonraki middleware'e geçilir
    }
};

// Kullanıcı kayıt işlemini gerçekleştirir
exports.post_register = async function(req, res, next) {
    const { name, email, password, role } = req.body; // Formdan gelen veriler

    try {
        // Kullanıcının zaten var olup olmadığını kontrol et
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            req.session.message = { text: "Bu e-posta adresi zaten kayıtlı.", class: "danger" };
            return res.redirect("register");
        }

        // Yeni kullanıcı oluştur
        const newUser = new User({
            fullname: name,
            email: email,
            password: password // Şifre, 'pre' middleware'i ile otomatik olarak hashlenir
        });

        // Rolü bul ve kullanıcıya ata
        const userRole = await Role.findOne({ rolename: role });
        if (userRole) {
            newUser.roles.push(userRole._id);
            await newUser.save();
        } else {
            req.session.message = { text: "Seçilen rol bulunamadı.", class: "danger" };
            return res.redirect("register");
        }

        // Kullanıcıya e-posta gönder
        await sendMail(newUser.email, "Hesabınız oluşturuldu.", "Hesabınız başarılı şekilde oluşturuldu.");

        req.session.message = { text: "Hesabınıza giriş yapabilirsiniz", class: "success" };
        return res.redirect("login");
    } catch (err) {
        console.log("Kayıt işlemi sırasında hata oluştu:", err);
        if (err.name === "ValidationError") {
            let msg = "";
            for (let e in err.errors) {
                msg += err.errors[e].message + " ";
            }
            return res.render("auth/register", {
                title: "Kayıt Ol",
                message: { text: msg, class: "danger" }
            });
        } else {
            next(err);
        }
    }
};

// Kullanıcı giriş sayfasını gösterir
exports.get_login = async function(req, res, next) {
    const message = req.session.message; // Oturumdan mesaj alır
    delete req.session.message; // Mesajı oturumdan temizler
    try {
        return res.render("auth/login", {
            title: "Giriş Yap",
            message: message, // Mesajı login sayfasına gönderir
            csrfToken: req.csrfToken() // CSRF koruması için token ekler
        });
    } catch (err) {
        next(err); // Hata işleme
    }
};

// Kullanıcı giriş işlemini gerçekleştirir
exports.post_login = async function(req, res, next) {
    const { email, password } = req.body; // Giriş formundan gelen veriler

    try {
        const user = await User.findOne({ email: email }).populate('roles'); // Kullanıcıyı ve rollerini getir
        if (!user) {
            return res.render('auth/login', {
                title: 'Giriş Yap',
                message: { text: 'Email veya şifre hatalı', class: 'danger' },
                csrfToken: req.csrfToken()
            });
        }

        // Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth/login', {
                title: 'Giriş Yap',
                message: { text: 'Email veya şifre hatalı', class: 'danger' },
                csrfToken: req.csrfToken()
            });
        }

        // Oturum bilgilerini ayarla
        const userRoles = user.roles.map(role => role.rolename); // Kullanıcı rollerini al
        req.session.roles = userRoles; // Örneğin ["admin", "moderator"]
        req.session.isAuth = true;
        req.session.fullname = user.fullname;
        req.session.userid = user.id;

        // Yönlendirme için hedef URL'yi ayarla
        if (req.session.roles.includes("admin")) {
            return res.redirect(`${BASE_URL}/blogs`);
        } else if (req.session.roles.includes("moderator")) {
            return res.redirect(`${BASE_URL}/blogs`);
        } else if (req.session.roles.includes("guest")) {
            return res.redirect(`${BASE_URL}/blogs`);
        } else {
            // Varsayılan yönlendirme (örneğin, ana sayfa)
            return res.redirect(`${BASE_URL}/`);
        }

    } catch (err) {
        console.error('Giriş hatası:', err);
        next(err);
    }
};

// Şifre sıfırlama sayfasını gösterir
exports.get_reset = async function(req, res, next) {
    try {
        // Şifre sıfırlama sayfasını render eder
        return res.render("auth/reset-password", {
            title: "Şifre Sıfırla",
            csrfToken: req.csrfToken() // CSRF koruması için token ekler
        });
    } catch (err) {
        next(err); // Hata işleme
    }
};

// Parola sıfırlama işlemini gerçekleştirir
exports.post_reset = async function(req, res, next) {
    const email = req.body.email; // Formdan gelen e-posta
    try {
        const user = await User.findOne({ email: email }); // Kullanıcıyı e-posta adresine göre bulur
        if (!user) {
            req.session.message = { text: "E-posta adresi bulunamadı", class: "danger" }; // Kullanıcı bulunamazsa hata mesajı
            return res.redirect(`${BASE_URL}/account/reset-password`);
        }

        // Şifre sıfırlama token'ı oluşturur
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token; // Token'ı kullanıcının veritabanı kaydına ekler
        user.resetTokenExpiration = Date.now() + 3600000; // Token'ın geçerlilik süresi 1 saat
        await user.save();

        // Kullanıcıya şifre sıfırlama e-postası gönderir
        await sendMail(
            user.email,
            "Parola Sıfırlama",
            `Parolanızı sıfırlamak için aşağıdaki bağlantıya tıklayın: ${BASE_URL}/account/new-password/${token}`
        );

        // Kullanıcıya bilgilendirme mesajı gösterir ve giriş sayfasına yönlendirir
        req.session.message = { text: "Parolanızı sıfırlamak için e-posta adresinizi kontrol ediniz.", class: "success"};
        res.redirect(`${BASE_URL}/account/login`);
    } catch (err) {
        console.log(err); // Hata konsola yazdırılır
        next(err); // Hata işleme
    }
};

// Yeni şifre belirleme sayfasını gösterir
exports.get_newpassword = async function(req, res, next) {
    const token = req.params.token; // URL'den token alır

    try {
        // Kullanıcıyı token ve token geçerlilik süresine göre bulur
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            // Kullanıcı bulunamazsa hata mesajı gösterir ve yönlendirir
            req.session.message = { text: "Geçersiz veya süresi dolmuş token", class: "danger" };
            return res.redirect(`${BASE_URL}/account/reset-password`);
        }

        // Yeni şifre belirleme sayfasını render eder
        return res.render("auth/new-password", {
            title: "Yeni Şifre",
            csrfToken: req.csrfToken(), // CSRF koruması için token ekler
            userId: user._id, // Kullanıcı ID'si
            token: token // Şifre sıfırlama token'ı
        });
    } catch (err) {
        console.log(err); // Hata konsola yazdırılır
        next(err); // Hata işleme
    }
};

// Yeni şifre belirleme işlemini gerçekleştirir
exports.post_newpassword = async function(req, res) {
    const token = req.body.token; // Formdan gelen token
    const userId = req.body.userId; // Formdan gelen kullanıcı ID'si
    const newPassword = req.body.password; // Formdan gelen yeni şifre

    try {
        // Kullanıcıyı token, token süresi ve kullanıcı ID'sine göre bulur
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId
        });

        if (!user) {
            // Kullanıcı bulunamazsa hata mesajı gösterir ve yönlendirir
            req.session.message = { text: "Geçersiz veya süresi dolmuş token", class: "danger" };
            return res.redirect(`${BASE_URL}/account/reset-password`);
        }

        // Yeni şifreyi hash'ler ve kullanıcı kaydını günceller
        user.password = newPassword; // password alanını yeni şifre ile değiştirir
        user.resetToken = undefined; // Token'ı temizler
        user.resetTokenExpiration = undefined; // Token süresini temizler

        await user.save(); // Kullanıcıyı kaydeder

        // Kullanıcıya başarı mesajı gösterir ve giriş sayfasına yönlendirir
        req.session.message = { text: "Parolanız güncellendi", class: "success" };
        return res.redirect(`${BASE_URL}/account/login`);
    } catch (err) {
        console.log(err); // Hata konsola yazdırılır
        next(err); // Hata işleme
    }
};

// Kullanıcı çıkış işlemini gerçekleştirir
exports.get_logout = function(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.log(err); // Hata konsola yazdırılır
            return res.redirect(`${BASE_URL}/`); // Hata durumunda ana sayfaya yönlendirilir
        }
        res.redirect(`${BASE_URL}/account/login`); // Oturum başarıyla sonlandırılırsa giriş sayfasına yönlendirilir
    });
};
