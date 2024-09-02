const express = require('express');
const router = express.Router();
const { checkRole } = require('../middlewares/auth');

router.get('/', checkRole('moderator'), (req, res) => {
    res.render('moderator/dashboard', { title: 'Moderator Paneli' });
});

module.exports = router;
