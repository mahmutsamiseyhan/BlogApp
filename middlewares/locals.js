module.exports = function(req, res, next) {
    if (req.session) {
        // Kullanıcının oturum açıp açmadığını kontrol eder ve sonucu şablonlarda kullanılmak üzere 'res.locals.isAuth' içine aktarır.
        res.locals.isAuth = req.session.isAuth || false;

        // Kullanıcı adı varsa şablonlara 'res.locals.fullname' olarak aktarır, yoksa boş bir string olarak ayarlar.
        res.locals.fullname = req.session.fullname || '';

        // Kullanıcı rolleri varsa, bunları şablonlara aktarır.
        if (req.session.roles && Array.isArray(req.session.roles)) {
            // Kullanıcının "admin" rolüne sahip olup olmadığını kontrol eder ve sonucu 'res.locals.isAdmin' olarak aktarır.
            res.locals.isAdmin = req.session.roles.includes("admin");

            // Kullanıcının "moderator" rolüne sahip olup olmadığını kontrol eder ve sonucu 'res.locals.isModerator' olarak aktarır.
            res.locals.isModerator = req.session.roles.includes("moderator");
        } else {
            // Eğer kullanıcı rolleri yoksa veya geçerli bir rol dizisi değilse, varsayılan olarak 'isAdmin' ve 'isModerator' false olarak ayarlanır.
            res.locals.isAdmin = false;
            res.locals.isModerator = false;
        }
    } else {
        // Eğer oturum objesi mevcut değilse, tüm değerler varsayılan olarak false veya boş olarak ayarlanır.
        res.locals.isAuth = false;
        res.locals.fullname = '';
        res.locals.isAdmin = false;
        res.locals.isModerator = false;
    }

    // Eğer CSRF token fonksiyonu mevcutsa, CSRF token'ını 'res.locals.csrfToken' içine ekler.
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }

    // Bir sonraki middleware işlevine geçiş yapar.
    next();
};
