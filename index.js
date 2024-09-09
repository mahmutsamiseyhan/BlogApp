// 'express' modülünü yükler ve yeni bir Express uygulama nesnesi oluşturur.
const express = require("express");
const app = express();  // 'app' nesnesi burada tanımlanıyor

// Heroku gibi bir proxy arkasında çalışırken 'trust proxy' ayarını etkinleştirin
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Heroku için güvenilir proxy ayarı
}

// Gerekli modülleri yükler
const methodOverride = require('method-override');
const path = require("path");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csurf = require("csurf");

const config = require("./config");  // Uygulama yapılandırma dosyasını yükler
const mongoose = require("./data/db");  // MongoDB bağlantısını sağlayan dosyayı yükler

// Model importları - Veritabanı modellerini tanımlar ve yükler
require("./models/category");
require("./models/blog");
require("./models/user");
require("./models/role");

const populate = require("./data/dummy-data");  // Dummy verileri eklemek için kullanılan modül

// Route'ları dahil et - Uygulamanın çeşitli yollarını tanımlar
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
// Orta katman (middleware) işlevlerini dahil et
const locals = require("./middlewares/locals");
const logMiddleware = require("./middlewares/log");
const errorHandling = require("./middlewares/error-handling");

// EJS şablon motorunu ayarla
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));  // Views dizinini belirtmek için

// URL-encoded ve JSON verilerini işle - Gelen isteklerdeki verileri parse eder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Çerezleri işleme
app.use(cookieParser());

// Oturum yönetimi ayarlarını yap - Oturum verilerini saklar ve yönetir
app.use(session({
    secret: config.sessionSecret,  // Oturumun güvenliğini sağlayan gizli anahtar
    resave: false,  // Oturumun her istekte yeniden kaydedilmesini engeller
    saveUninitialized: false,  // Başlatılmamış oturumların saklanmasını engeller
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // 1 gün süreli çerez
        secure: process.env.NODE_ENV === 'production', // HTTPS üzerinden çalışırken true yapın
        httpOnly: true,  // Çerezin sadece HTTP protokolü üzerinden erişilebilir olmasını sağlar
        sameSite: 'strict'  // Çerezin aynı site politikasına uyulmasını sağlar
    },
    store: MongoStore.create({ 
        mongoUrl: `mongodb+srv://${config.db.user}:${config.db.password}@${config.db.host}.mongodb.net/${config.db.database}?retryWrites=true&w=majority`
    })  // Oturum verilerini MongoDB'de saklar
}));

// Statik dosyaları servis et - Public ve node_modules dizinlerinden statik dosyaları sunar
app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

// Global değişkenler middleware - Uygulama genelinde kullanılacak değişkenleri tanımlar
app.use((req, res, next) => {
    res.locals.isAuth = req.session.isAuth || false;
    res.locals.isAdmin = req.session.roles && req.session.roles.includes('admin');
    res.locals.isModerator = req.session.roles && req.session.roles.includes('moderator');
    res.locals.fullname = req.session.fullname || '';
    next();
});

// CSRF koruması için middleware'i ekle
app.use(csurf({ cookie: true }));  // CSRF token'ını çerezde depolamak için

// Route'ları tanımla - Uygulamanın yönlendirmelerini ayarlar
app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use("/", userRoutes);

// Log ve hata işleme orta katmanlarını ekle
app.use(logMiddleware);
app.use(errorHandling);

// Tanımlanmamış URL'ler için 404 sayfası
app.use("*", (req, res) => {
    res.status(404).render("error/404", { title: "Not Found" });
});

// Hata işleme middleware'i
app.use((err, req, res, next) => {
    console.error('Hata:', err.message);
    res.status(500).render('error/500', { message: 'Bir hata oluştu' }); // 'error/500' olarak değiştirildi
});

// MongoDB bağlantısı başarılı olduğunda
mongoose.connection.once('open', () => {
    console.log('MongoDB Atlas bağlantısı başarılı.');

    // Sunucuyu başlat
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, function() {
        console.log(`Server is running on port ${PORT}`);

        // Dummy verileri ekle
        populate().then(() => {
            console.log('Dummy data eklendi');
        }).catch(err => {
            console.error('Dummy data eklenirken hata oluştu:', err);
        });
    });
});

// MongoDB bağlantı hatalarını yakala
mongoose.connection.on('error', (err) => {
    console.error('MongoDB Atlas bağlantı hatası:', err);
});
