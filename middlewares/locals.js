module.exports = function(req, res, next) {
    if (req.session) {
        // Kullanıcının oturum açıp açmadığını kontrol eder.
        res.locals.isAuth = req.session.isAuth || false;

        // Kullanıcı adı varsa şablonlara aktarır.
        res.locals.fullname = req.session.fullname || '';

        // Kullanıcı rolleri varsa şablonlara aktarır.
        if (req.session.roles && Array.isArray(req.session.roles)) {
            res.locals.isAdmin = req.session.roles.includes("admin");
            res.locals.isModerator = req.session.roles.includes("moderator");
        } else {
            res.locals.isAdmin = false;
            res.locals.isModerator = false;
        }
    } else {
        // Oturum yoksa varsayılan değerleri ayarlar.
        res.locals.isAuth = false;
        res.locals.fullname = '';
        res.locals.isAdmin = false;
        res.locals.isModerator = false;
    }

    // CSRF token'ı şablonlara ekler.
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }

    next();
};
