// 'mongoose' modülünü yükler. Mongoose, MongoDB ile etkileşim kurmak için kullanılan bir kütüphanedir.
const mongoose = require('mongoose');
// Mongoose'un 'Schema' sınıfını alır. Schema, veritabanı koleksiyonunun yapısını tanımlar.
const Schema = mongoose.Schema;

// Blog verilerini tanımlayan bir Mongoose şeması oluşturur.
const blogSchema = new Schema({
    // 'baslik' alanı, blog yazısının başlığıdır.
    baslik: {
        type: String,                  // 'baslik' alanı bir dizedir.
        required: [true, 'Başlık zorunludur'], // 'baslik' alanının doldurulması zorunludur.
        trim: true                     // Başlıktaki baştaki ve sondaki boşlukları otomatik olarak keser.
    },
    // 'url' alanı, blog yazısının benzersiz URL'sidir.
    url: {
        type: String,                  // 'url' alanı bir dizedir.
        required: true,                // 'url' alanının doldurulması zorunludur.
        unique: true                   // 'url' alanı benzersiz olmalıdır (aynı URL iki kez kullanılmamalıdır).
    },
    // 'altbaslik' alanı, blog yazısının alt başlığıdır.
    altbaslik: String,                // 'altbaslik' alanı isteğe bağlı bir dizedir.
    // 'aciklama' alanı, blog yazısının açıklamasıdır.
    aciklama: String,                 // 'aciklama' alanı isteğe bağlı bir dizedir.
    // 'resim' alanı, blog yazısına ait resim URL'sidir.
    resim: String,                    // 'resim' alanı isteğe bağlı bir dizedir.
    // 'anasayfa' alanı, blog yazısının anasayfada görünüp görünmeyeceğini belirler.
    anasayfa: {
        type: Boolean,                // 'anasayfa' alanı bir boolean (doğru/yanlış) değeridir.
        default: false                // Varsayılan değer 'false' olarak ayarlanır.
    },
    // 'onay' alanı, blog yazısının onaylanıp onaylanmadığını gösterir.
    onay: {
        type: Boolean,                // 'onay' alanı bir boolean (doğru/yanlış) değeridir.
        default: false                // Varsayılan değer 'false' olarak ayarlanır.
    },
    // 'userId' alanı, blog yazısını oluşturan kullanıcının ID'sini referans alır.
    userId: {
        type: Schema.Types.ObjectId,  // 'userId' alanı, MongoDB ObjectId türündedir.
        ref: 'User',                  // 'User' modeline referans verir. (Kullanıcının modelini belirtir.)
        required: true                // 'userId' alanının doldurulması zorunludur.
    },
    // 'categories' alanı, blog yazısının ait olduğu kategorileri içerir.
    categories: [{
        type: Schema.Types.ObjectId,  // Her bir kategori MongoDB ObjectId türündedir.
        ref: 'Category'               // 'Category' modeline referans verir. (Kategorinin modelini belirtir.)
    }]
}, { timestamps: true });             // 'timestamps: true' seçeneği, 'createdAt' ve 'updatedAt' alanlarını otomatik olarak ekler.

// 'blogSchema' şemasını 'Blog' adında bir model olarak dışa aktarır.
// Bu model, MongoDB koleksiyonlarıyla etkileşim kurmak için kullanılacaktır.
module.exports = mongoose.model('Blog', blogSchema);
