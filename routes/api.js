const express = require('express');
const verifyToken = require('../middlewares/verifyToken'); // Token doğrulama middleware'i

const router = express.Router();

// '/some-secure-route' URL'sine POST isteği yapıldığında, 'verifyToken' middleware'i çağrılır.
// Bu middleware, token'ı doğrular ve geçerli ise işlemi gerçekleştirir.
router.post('/some-secure-route', verifyToken, async (req, res) => {
    // Güvenli işlem burada yapılır
    res.status(200).send({ message: "Access granted." });
});

// Router'ı dışa aktarır, böylece başka dosyalarda kullanılabilir.
module.exports = router;
