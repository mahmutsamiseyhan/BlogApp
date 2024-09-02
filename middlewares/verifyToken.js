// 'jsonwebtoken' modülünü yükler. Bu modül, JWT'leri oluşturmak ve doğrulamak için kullanılır.
const jwt = require('jsonwebtoken');
// 'config' modülünü yükler. Bu modül, uygulamanın yapılandırma ayarlarını içerir.
const config = require('../config');

// JWT token'ını doğrulamak için kullanılan middleware işlevini tanımlar.
// Bu middleware, gelen isteklerdeki token'ı kontrol eder ve doğrular.
function verifyToken(req, res, next) {
    // İstek başlıklarından 'authorization' başlığını alır.
    const token = req.headers['authorization'];

    // Token mevcut değilse, 403 (Yasak) durumu ile bir yanıt döner.
    // Yanıt, token'ın sağlanmadığını belirten bir mesaj içerir.
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    // Token'ı doğrular. Token, 'Bearer <token>' formatında gönderildiğinden, 'split' metodu ile token'ı ayırır.
    jwt.verify(token.split(' ')[1], config.sessionSecret, function(err, decoded) {
        // Eğer token doğrulama sırasında bir hata oluşursa, 500 (İç Sunucu Hatası) durumu ile bir yanıt döner.
        // Yanıt, token'ın doğrulanamadığını belirten bir mesaj içerir.
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        // Token doğrulandıysa, 'decoded' nesnesinden kullanıcı ID'sini alır ve 'req.userId' içine ekler.
        req.userId = decoded.id;
        // Bir sonraki middleware işlevine geçiş yapar.
        next();
    });
}

// 'verifyToken' işlevini dışa aktarır, böylece diğer dosyalarda kullanılabilir.
module.exports = verifyToken;
