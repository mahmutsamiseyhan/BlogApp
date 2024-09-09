// Gerekli modüllerin içe aktarılması
const mongoose = require('mongoose'); // Mongoose, MongoDB ile etkileşimde bulunmak için kullanılan bir ODM (Object Data Modeling) kütüphanesi
const config = require('../config'); // Veritabanı bağlantı bilgilerini içeren yapılandırma dosyası

// Mongoose'un sorgu davranışını yapılandırma: strictQuery modunu devre dışı bırakır
mongoose.set('strictQuery', false); 

// MongoDB Atlas bağlantı dizesi oluşturuluyor
const connectString = `mongodb+srv://${config.db.user}:${config.db.password}@${config.db.host}.mongodb.net/${config.db.database}?retryWrites=true&w=majority&ssl=true&tlsAllowInvalidCertificates=true`;

// MongoDB'ye bağlanmak için bir fonksiyon tanımlanıyor
async function connect() {
    try {
        // Mongoose ile veritabanına bağlanma işlemi
        await mongoose.connect(connectString, {
            useNewUrlParser: true, // Yeni URL yapısını kullanarak bağlantı sağlanır
            useUnifiedTopology: true, // Yeni bağlantı yönetimi mekanizması kullanılır
            sslValidate: true, // SSL sertifikası doğrulaması yapılır
        });
        console.log("MongoDB Atlas bağlantısı başarılı."); // Başarılı bağlantı mesajı
    } catch (err) {
        console.error("MongoDB Atlas bağlantı hatası: ", err); // Bağlantı hatası durumunda hata mesajı
    }
}


// Tanımlanan `connect` fonksiyonu çağrılır
connect();

// Mongoose modülü dışa aktarılır, böylece diğer dosyalarda kullanılabilir
module.exports = mongoose;
