// 'mongoose' modülünü yükler. Mongoose, MongoDB ile etkileşim kurmak için kullanılan bir kütüphanedir.
const mongoose = require('mongoose');
// 'bcrypt' modülünü yükler. Bcrypt, şifreleri güvenli bir şekilde hashlemek için kullanılır.
const bcrypt = require('bcrypt');
const Blog = require('./blog'); // Blog modelini içe aktar

// Mongoose'un 'Schema' sınıfını alır. Schema, veritabanı koleksiyonunun yapısını tanımlar.
const Schema = mongoose.Schema;

// Kullanıcı verilerini tanımlayan bir Mongoose şeması oluşturur.
const userSchema = new Schema({
    // 'fullname' alanı, kullanıcının tam adını içerir.
    fullname: {
        type: String,                  // 'fullname' alanı bir dizedir.
        required: [true, 'Ad Soyad alanı zorunludur'], // 'fullname' alanının doldurulması zorunludur ve bir hata mesajı içerir.
        trim: true,                    // Kullanıcı adındaki baştaki ve sondaki boşlukları otomatik olarak keser.
        validate: {
            // 'fullname' alanının en az bir ad ve bir soyad içermesini sağlar.
            validator: function(value) {
                return value.split(" ").length >= 2;
            },
            message: "Lütfen ad ve soyad bilginizi giriniz." // Geçersiz bilgi girildiğinde hata mesajı.
        }
    },
    // 'email' alanı, kullanıcının e-posta adresini içerir.
    email: {
        type: String,                  // 'email' alanı bir dizedir.
        required: [true, 'Email alanı zorunludur'], // 'email' alanının doldurulması zorunludur ve bir hata mesajı içerir.
        unique: true,                  // 'email' alanı benzersiz olmalıdır (aynı e-posta adresi iki kez kullanılmamalıdır).
        lowercase: true,               // E-posta adresini küçük harfe dönüştürür.
        trim: true,                    // E-posta adresindeki baştaki ve sondaki boşlukları otomatik olarak keser.
        validate: {
            // E-posta adresinin geçerli bir formatta olduğunu doğrular.
            validator: function(value) {
                return /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
            message: "Geçerli bir email adresi giriniz." // Geçersiz e-posta adresi girildiğinde hata mesajı.
        }
    },
    // 'password' alanı, kullanıcının şifresini içerir.
    password: {
        type: String,                  // 'password' alanı bir dizedir.
        required: [true, 'Şifre alanı zorunludur'], // 'password' alanının doldurulması zorunludur ve bir hata mesajı içerir.
        minlength: [6, 'Şifre en az 6 karakter olmalıdır'] // Şifrenin minimum uzunluğu 6 karakterdir.
    },
    // 'roles' alanı, kullanıcının rollerini içerir.
    roles: [{
        type: Schema.Types.ObjectId,   // Her bir rol MongoDB ObjectId türündedir.
        ref: 'Role'                    // 'Role' modeline referans verir. (Rol modelinin adını belirtir.)
    }],
    // Şifre sıfırlama token'ını ve token'ın süresini içerir.
    resetToken: String,
    resetTokenExpiration: Date
}, { timestamps: true });             // 'timestamps: true' seçeneği, 'createdAt' ve 'updatedAt' alanlarını otomatik olarak ekler.

// Kullanıcı kaydedilmeden önce çalışacak olan 'pre' middleware'i tanımlar.
userSchema.pre('save', async function(next) {
    // Şifre değişmemişse, işlemi atlar.
    if (!this.isModified('password')) return next();
    // Şifreyi hashler. '12' hashleme karmaşıklığıdır.
    this.password = await bcrypt.hash(this.password, 12);
    // Hashleme işlemi tamamlandığında middleware işlevini devam ettirir.
    next();
});

// Kullanıcı silindiğinde onunla ilişkili blogları da silmek için 'pre' middleware'i tanımlar.
userSchema.pre('remove', async function(next) {
    try {
        // Kullanıcıya ait blogları siler.
        await Blog.deleteMany({ userId: this._id });
        next(); // Silme işlemi başarılıysa, işlemi devam ettirir.
    } catch (err) {
        next(err); // Hata durumunda next fonksiyonuna hata gönderir.
    }
});

// 'userSchema' şemasını 'User' adında bir model olarak dışa aktarır.
// Bu model, MongoDB koleksiyonlarıyla etkileşim kurmak için kullanılacaktır.
module.exports = mongoose.model('User', userSchema);
