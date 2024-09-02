const express = require("express");
const app = express();
const methodOverride = require('method-override');
const path = require("path");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csurf = require("csurf");

const config = require("./config");
const mongoose = require("./data/db");

// Model importları
require("./models/category");
require("./models/blog");
require("./models/user");
require("./models/role");

const populate = require("./data/dummy-data");

// Route'ları dahil et
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

// Orta katman (middleware) işlevlerini dahil et
const locals = require("./middlewares/locals");
const logMiddleware = require("./middlewares/log");
const errorHandling = require("./middlewares/error-handling");

// EJS şablon motorunu ayarla
app.set("view engine", "ejs");

// URL-encoded ve JSON verilerini işle
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Çerezleri işleme
app.use(cookieParser());

// Oturum yönetimi ayarlarını yap
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // 1 gün
        secure: process.env.NODE_ENV === 'production', // HTTPS üzerinden çalışırken true yapın
        httpOnly: true,
        sameSite: 'strict'
    },
    store: MongoStore.create({ 
        mongoUrl: `mongodb+srv://${config.db.user}:${config.db.password}@${config.db.host}.mongodb.net/${config.db.database}?retryWrites=true&w=majority`
    })
}));

// Statik dosyaları servis et
app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

// Route'ları tanımla
app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use("/", userRoutes);

// Global değişkenler middleware
app.use((req, res, next) => {
    res.locals.isAuth = req.isAuthenticated ? req.isAuthenticated() : false;
    res.locals.isAdmin = req.user && req.user.roles && req.user.roles.includes('admin');
    res.locals.isModerator = req.user && req.user.roles && req.user.roles.includes('moderator');
    next();
});

// CSRF koruması için middleware'i ekle
app.use(csurf());

// Tanımlanmamış URL'ler için 404 sayfası
app.use("*", (req, res) => {
    res.status(404).render("error/404", { title: "not found" });
});

// Hata işleme middleware'i
app.use((err, req, res, next) => {
    console.error('Hata:', err.message);
    res.status(500).render('admin/error', { message: 'Bir hata oluştu' });
});

// Log ve hata işleme orta katmanlarını ekle
app.use(logMiddleware);
app.use(errorHandling);

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
