// Middleware işlevini tanımlar ve dışa aktarır.
// Bu middleware, kullanıcıların oturum açmış ve gerekli rollere sahip olup olmadığını kontrol eder.
module.exports = (req, res, next) => {
    // Oturum objesi mevcut değilse veya oturumda 'isAuth' özelliği bulunmuyorsa, kullanıcıyı giriş sayfasına yönlendirir.
    if (!req.session || !req.session.isAuth) {
        // Kullanıcının giriş yapması gerektiğini belirten bir URL ile yönlendirme yapar.
        // 'returnUrl', kullanıcının giriş yaptıktan sonra geri dönmesini istediğiniz sayfayı belirtir.
        return res.redirect("/account/login?returnUrl=" + encodeURIComponent(req.originalUrl));
    }

    // Oturumda 'roles' özelliği mevcut değilse veya 'roles' içinde "admin" veya "moderator" rolleri yoksa, kullanıcıyı giriş sayfasına yönlendirir.
    if (!req.session.roles || (!req.session.roles.includes("admin") && !req.session.roles.includes("moderator"))) {
        // 'req.session.message' içine bir hata mesajı ekler. Bu mesaj, kullanıcıya yetkili bir kullanıcı ile giriş yapması gerektiğini bildirir.
        req.session.message = { text: "Yetkili bir kullanıcı ile oturum açınız.", type: "error" };
        // Kullanıcının yetkili bir kullanıcı ile giriş yapması gerektiğini belirten bir URL ile yönlendirme yapar.
        return res.redirect("/account/login?returnUrl=" + encodeURIComponent(req.originalUrl));
    }
    
    // Kullanıcı geçerli oturuma ve gerekli rollere sahipse, bir sonraki middleware işlevine geçiş yapar.
    next();
};
