// Middleware işlevini tanımlar ve dışa aktarır.
// Bu middleware, CSRF token'ını her istek için yerel değişkenlere ekler.
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true }); // CSRF korumasını etkinleştirir

module.exports = (req, res, next) => {
    // Eğer 'req.csrfToken' fonksiyonu mevcutsa, CSRF token'ını oluşturur ve 'res.locals' içinde saklar.
    if (req.csrfToken) {
        // 'req.csrfToken()' fonksiyonu çağrılarak CSRF token'ı elde edilir.
        // Token, şablonlarda kullanılmak üzere 'res.locals.csrfToken' içinde saklanır.
        res.locals.csrfToken = req.csrfToken();
    } else {
        // 'req.csrfToken' fonksiyonu mevcut değilse, konsola hata mesajı yazdırır.
        console.error('CSRF token function is not available');
    }
    // Bir sonraki middleware işlevine geçiş yapar.
    next();
}
