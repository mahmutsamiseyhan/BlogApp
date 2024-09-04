const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

// Özel log formatı tanımlayın
// Bu format, log mesajlarını yazarken zaman damgasını, seviyesini ve mesajı (veya hata durumunda stack trace'i) içerir.
const logFormat = printf(({ level, message, timestamp, stack }) => {
  // Eğer stack trace varsa, mesaj yerine stack trace'i yazar, aksi halde sadece mesajı yazar.
  return `${timestamp} ${level}: ${stack || message}`;
});

// Logger'ı oluşturun
const logger = createLogger({
  // Log seviyesini belirleyin. Bu örnekte, 'info' seviyesi ve üzerindeki tüm loglar kaydedilecektir.
  level: 'info',
  format: combine(
    timestamp(),  // Her log girdisine zaman damgası ekler.
    errors({ stack: true }),  // Hatalar için stack trace'i otomatik olarak loglar.
    logFormat  // Yukarıda tanımlanan özel log formatını kullanır.
  ),
  transports: [
    // Logları 'error.log' dosyasına kaydeder. Sadece 'error' seviyesindeki loglar bu dosyaya yazılır.
    new transports.File({ filename: 'error.log', level: 'error' }),
    // Logları konsola yazdırır. Bu örnekte, 'info' seviyesi ve üzerindeki loglar konsola yazdırılır.
    new transports.Console({ level: 'info' })
  ]
});

// Logger'ı dışa aktararak, uygulamanızın diğer bölümlerinde kullanabilirsiniz.
module.exports = logger;
