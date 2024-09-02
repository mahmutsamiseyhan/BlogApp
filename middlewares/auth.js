
// Middleware işlevini tanımlar ve dışa aktarır.
// Bu middleware, kullanıcı oturumunu kontrol eder ve oturum açmamış kullanıcıları giriş sayfasına yönlendirir.
module.exports = (req, res, next) => {
    // Oturum objesi ve oturumun geçerli olup olmadığını kontrol eder.
    if (!req.session || !req.session.isAuth) {
        // Eğer oturum objesi mevcut değilse veya 'isAuth' özelliği 'true' değilse, kullanıcıyı giriş sayfasına yönlendirir.
        // 'returnUrl' parametresi, kullanıcının giriş yaptıktan sonra yönlendirileceği sayfayı belirler.
        return res.redirect("/account/login?returnUrl=" + encodeURIComponent(req.originalUrl));
    }
    // Eğer oturum geçerliyse, bir sonraki middleware işlevine geçiş yapar.
    next();
}
exports.checkRole = function (requiredRole) {
    return function (req, res, next) {
        if (req.session.roles && req.session.roles.includes(requiredRole)) {
            return next(); // Rol eşleşirse devam et
        } else {
            return res.status(403).send('Bu sayfaya erişim izniniz yok.');
        }
    };
};
