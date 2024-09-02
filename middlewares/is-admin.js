// Middleware işlevini tanımlar ve dışa aktarır.
// Bu middleware, kullanıcıların oturum açmış ve "admin" rolüne sahip olup olmadığını kontrol eder.
module.exports = (req, res, next) => {
    // Oturum objesi veya oturumda 'isAuth' özelliği mevcut değilse, kullanıcıyı giriş sayfasına yönlendirir.
    if (!req.session || !req.session.isAuth) {
        // Kullanıcının giriş yapması gerektiğini belirten bir URL ile yönlendirme yapar.
        // 'returnUrl', kullanıcıların giriş yaptıktan sonra geri dönmelerini istediğiniz sayfayı belirtir.
        return res.redirect("/account/login?returnUrl=" + encodeURIComponent(req.originalUrl));
    }

    // Oturumda 'roles' özelliği mevcut değilse veya 'roles' içinde "admin" rolü yoksa, kullanıcıyı giriş sayfasına yönlendirir.
    if (!req.session.roles || !req.session.roles.includes("admin")) {
        // 'req.session.message' içine bir hata mesajı ekler. Bu mesaj, kullanıcıya yetkili bir kullanıcı ile giriş yapması gerektiğini bildirir.
        req.session.message = {text: "Yetkili bir kullanıcı ile oturum açınız.", type: "error"};
        // Kullanıcının yetkili bir kullanıcı ile giriş yapması gerektiğini belirten bir URL ile yönlendirme yapar.
        return res.redirect("/account/login?returnUrl=" + encodeURIComponent(req.originalUrl));
    }
    
    // Kullanıcı geçerli oturuma ve gerekli role sahipse, bir sonraki middleware işlevine geçiş yapar.
    next();
}
