// Hata yönetimi middleware işlevini tanımlar ve dışa aktarır.
// Bu middleware, uygulamada bir hata oluştuğunda çalışır ve hatayı kullanıcıya bildirir.
module.exports = (err, req, res, next) => {
    // Hata yığını (stack) bilgilerini konsola yazdırır.
    // Bu, hata ayıklama sırasında hatanın nerede oluştuğunu anlamaya yardımcı olur.
    console.error(err.stack);
    
    // HTTP durum kodunu 500 (İç Sunucu Hatası) olarak ayarlar.
    // Bu, sunucuda beklenmeyen bir hata meydana geldiğini belirtir.
    res.status(500).render("error/500", { 
        title: "Bir hata oluştu", // Hata sayfası başlığı
        errorMessage: "Sunucuda bir hata oluştu, lütfen daha sonra tekrar deneyiniz." // Kullanıcıya gösterilecek genel hata mesajı
    });
    // 'error/500' şablonunu render eder. Bu şablon, hata mesajını kullanıcıya göstermek için kullanılır.
};
