// 'nodemailer' modülünü yükler. Bu modül, e-posta gönderimi için kullanılır.
const nodemailer = require("nodemailer");

// Yapılandırma bilgilerini içeren 'config' dosyasını yükler. Genellikle bu dosya e-posta kimlik bilgilerini ve diğer ayarları içerir.
const config = require("../config");

// E-posta taşıyıcısını oluşturur ve yapılandırır.
// 'nodemailer.createTransport', e-posta göndermek için gerekli bağlantı ve yetkilendirme ayarlarını sağlar.
const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail kullanılıyor, başka bir sağlayıcı kullanıyorsanız değiştirin
    auth: {
        user: process.env.EMAIL_USERNAME || config.email.username, // Çevre değişkeninden e-posta adresini alır veya yapılandırma dosyasından alır
        pass: process.env.EMAIL_PASSWORD || config.email.password // Çevre değişkeninden şifreyi alır veya yapılandırma dosyasından alır
    }
});

// E-posta sunucusuna bağlantıyı doğrular.
// 'transporter.verify' yöntemi, yapılandırmanın doğru olup olmadığını kontrol eder.
transporter.verify((error, success) => {
    if (error) {
        // Bağlantı hatası oluşursa, hatayı konsola yazdırır.
        console.error("E-posta sunucusuna bağlantı hatası:", error);
    } else {
        // Bağlantı başarılı olursa, başarı mesajını konsola yazdırır.
        console.log("E-posta sunucusuna bağlantı başarılı");
    }
});

// E-posta taşıyıcısını dışa aktarır.
// Bu, diğer dosyalarda veya modüllerde kullanılmak üzere 'transporter' nesnesini sağlar.
module.exports = transporter;
