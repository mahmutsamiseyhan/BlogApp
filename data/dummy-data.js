const mongoose = require('mongoose'); // MongoDB veritabanı ile etkileşim için Mongoose kütüphanesi
const Category = require("../models/category"); // Kategori verilerini temsil eden Mongoose modeli
const Blog = require("../models/blog"); // Blog yazılarını temsil eden Mongoose modeli
const slugField = require("../helpers/slugfield"); // URL'ler için slug (kısa ve anlaşılır isim) oluşturma fonksiyonu
const User = require("../models/user"); // Kullanıcı verilerini temsil eden Mongoose modeli
const bcrypt = require("bcrypt"); // Şifreleri güvenli bir şekilde şifrelemek ve doğrulamak için Bcrypt kütüphanesi
const Role = require("../models/role"); // Kullanıcı rolleri için Mongoose modeli

async function populate() {
    try {
        // Veritabanı bağlantısının sağlandığından emin olunuyor
        await new Promise((resolve, reject) => {
            if (mongoose.connection.readyState === 1) { 
                resolve();
            } else {
                mongoose.connection.once('connected', resolve); 
                mongoose.connection.once('error', reject); 
            }
        });
    //     //Veritabanını temizleyip tekrar doldurma işlemi
    // await Category.deleteMany({}); // Tüm kategori verilerini sil
    // await User.deleteMany({}); // Tüm kullanıcı verilerini sil
    // await Blog.deleteMany({}); // Tüm blog yazılarını sil
    // await Role.deleteMany({}); // Tüm rol verilerini sil
        
        // Mevcut rollerin olup olmadığını kontrol et ve ekle
        const existingRoles = await Role.find({});
        if (existingRoles.length === 0) {
            const roles = await Role.create([
                { rolename: "admin" },
                { rolename: "moderator" },
                { rolename: "guest" }
            ]);
            console.log("Roller başarıyla oluşturuldu:", roles);
        } else {
            console.log("Roller zaten mevcut.");
        }
        
        // Admin rolünü kontrol et ve yoksa oluştur
        let adminRole = await Role.findOne({ rolename: "admin" });
        
        // Mevcut admin kullanıcıyı kontrol et
        const existingAdmin = await User.findOne({ roles: adminRole._id });
        
        if (!existingAdmin) {
            // Eğer admin kullanıcı yoksa, yeni bir admin oluştur
            
            const adminUser = new User({
                fullname: "Mahmut Sami Seyhan",
                email: "mahmutsamiseyhan.mss@gmail.com",
                password: ('135790'), 
                roles: [adminRole._id]
            });
            
            await adminUser.save();
            console.log("Admin kullanıcı başarıyla oluşturuldu.");
        } else {
            console.log("Zaten bir admin kullanıcı mevcut.");
        }

        console.log("Veritabanı başarıyla güncellendi veya veriler eklendi.");
    } catch (error) {
        console.error("Veritabanı işlemleri sırasında hata oluştu:", error);
    }
}

module.exports = populate;


    



