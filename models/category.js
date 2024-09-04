// 'mongoose' modülünü yükler. Mongoose, MongoDB ile etkileşim kurmak için kullanılan bir kütüphanedir.
const mongoose = require('mongoose');
// Mongoose'un 'Schema' sınıfını alır. Schema, veritabanı koleksiyonunun yapısını tanımlar.
const Schema = mongoose.Schema;

// Kategori verilerini tanımlayan bir Mongoose şeması oluşturur.
const categorySchema = new Schema({
    // 'name' alanı, kategorinin adıdır.
    name: {
        type: String,                  // 'name' alanı bir dizedir.
        required: [true, 'Kategori adı zorunludur'], // 'name' alanının doldurulması zorunludur ve bir hata mesajı içerir.
        unique: true,                  // 'name' alanı benzersiz olmalıdır (aynı isim iki kez kullanılmamalıdır).
        trim: true                     // Kategori adındaki baştaki ve sondaki boşlukları otomatik olarak keser.
    },
    // 'url' alanı, kategorinin benzersiz URL'sidir.
    url: {
        type: String,                  // 'url' alanı bir dizedir.
        required: true,                // 'url' alanının doldurulması zorunludur.
        unique: true                   // 'url' alanı benzersiz olmalıdır (aynı URL iki kez kullanılmamalıdır).
    },
    // 'blogs' alanı, bu kategoriye ait blog gönderilerinin referanslarını içerir.
    blogs: [{
        type: Schema.Types.ObjectId,   // Her bir blog gönderisi MongoDB ObjectId türündedir.
        ref: 'Blog'                    // 'Blog' modeline referans verir. (Blog modelinin adını belirtir.)
    }]
});

// 'categorySchema' şemasını 'Category' adında bir model olarak dışa aktarır.
// Bu model, MongoDB koleksiyonlarıyla etkileşim kurmak için kullanılacaktır.
module.exports = mongoose.model('Category', categorySchema);
