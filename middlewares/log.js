// 'winston' modülünü yükler. Winston, Node.js uygulamalarında günlük (logging) işlemleri için kullanılan bir kütüphanedir.
const winston = require('winston');

// Winston ile bir logger (günlükleyici) oluşturur.
// Logger, hata seviyesinde günlük kaydı yapacak şekilde ayarlanmıştır.
const logger = winston.createLogger({
    // Günlükleme seviyesini belirler. Bu örnekte sadece 'error' seviyesindeki loglar kaydedilecektir.
    level: 'error',
    // Günlük formatını belirler. Timestamp (zaman damgası) ve JSON formatında günlükler kaydedilecektir.
    format: winston.format.combine(
        winston.format.timestamp(),  // Zaman damgası ekler.
        winston.format.json()        // JSON formatında loglar oluşturur.
    ),
    // Günlüklerin nereye kaydedileceğini belirler.
    transports: [
        // 'error.log' dosyasına sadece 'error' seviyesindeki günlükleri kaydeder.
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // Konsola günlükleri yazdırır. Bu, özellikle geliştirme sırasında faydalıdır.
        new winston.transports.Console()
    ]
});

// Hata yönetimi middleware işlevini tanımlar ve dışa aktarır.
// Bu middleware, hataları günlüğe kaydeder ve sonraki hata yönetimi middleware'ine geçiş yapar.
module.exports = (err, req, res, next) => {
    // Hata bilgilerini günlüğe kaydeder.
    // Hata mesajı, stack trace, istek bilgileri ve zaman damgası kaydedilir.
    logger.error({
        message: err.message,          // Hata mesajını kaydeder.
        stack: err.stack,            // Hata stack trace'ini kaydeder.
        method: req.method,          // İstek yöntemini (GET, POST, vb.) kaydeder.
        url: req.url,                // İstek yapılan URL'yi kaydeder.
        headers: req.headers,        // İstek başlıklarını kaydeder.
        timestamp: new Date().toISOString()  // Zaman damgasını ISO formatında kaydeder.
    });

    // Hata yönetimi middleware'ine geçiş yapar.
    next(err);
};
