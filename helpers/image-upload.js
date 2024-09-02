// 'multer' modülünü yükler. 'multer' dosya yüklemeleri için kullanılan bir Node.js middleware'idir.
const multer = require("multer");
// 'path' modülünü yükler. Dosya yollarını işlemek için kullanılır.
const path = require("path");

// 'multer' için dosya depolama yapılandırmasını belirler.
// 'diskStorage', dosyaları yerel diske kaydetmek için kullanılan bir depolama motorudur.
const storage = multer.diskStorage({
    // Dosyaların kaydedileceği dizini belirler.
    destination: function(req, file, cb) {
        // './public/images/' dizinine dosyayı kaydetmek için yol belirtir.
        cb(null, './public/images/');
    },
    // Dosyanın adını belirler.
    filename: function(req, file, cb) {
        // Dosyanın orijinal adını, geçerli tarih ve saat ile birleştirir, böylece her dosya benzersiz olur.
        cb(null, path.parse(file.originalname).name + "-" + Date.now() + path.extname(file.originalname));
    }
});

// Dosya filtreleme fonksiyonunu tanımlar.
// Bu fonksiyon, yüklenen dosyanın türünü kontrol eder.
const fileFilter = (req, file, cb) => {
    // Dosyanın MIME türü 'image/' ile başlıyorsa, dosya kabul edilir.
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // Eğer dosya bir resim değilse, hata döner.
        cb(new Error('Yalnızca resim dosyaları yüklenebilir.'), false);
    }
};

// 'multer' middleware'ini yapılandırır.
// 'storage' ve 'fileFilter' ayarlarını içerir ve dosya boyutu sınırlaması ekler.
const upload = multer({
    // Depolama yapılandırmasını kullanır.
    storage: storage,
    // Dosya türü filtreleme işlevini kullanır.
    fileFilter: fileFilter,
    // Yüklenen dosyanın maksimum boyutunu 5MB olarak sınırlar.
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});

// 'upload' middleware'ini dışa aktarır.
// Bu, diğer dosyalarda veya modüllerde kullanılmak üzere 'upload' fonksiyonunu sağlar.
module.exports.upload = upload;
