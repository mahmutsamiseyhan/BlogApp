const nodemailer = require('nodemailer');

// Nodemailer transporter'ını yapılandırma
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Örneğin 'smtp.gmail.com'
    port: process.env.EMAIL_PORT || 587, // Genellikle 587 veya 465 kullanılır
    secure: process.env.EMAIL_PORT === '465', // Port 465 ise true, değilse false
    auth: {
        user: process.env.EMAIL_USER, // Gönderici e-posta adresi
        pass: process.env.EMAIL_PASS, // Gönderici e-posta şifresi
    },
});

// sendMail fonksiyonunu tanımlama ve dışa aktarma
async function sendMail(to, subject, text) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER_G, // Gönderici
            to: to, // Alıcı
            subject: subject, // Konu
            text: text, // Mesaj içeriği
        };

        // E-postayı gönderme
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log('Error sending email:', error);
    }
}

module.exports = sendMail;
