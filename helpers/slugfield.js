// 'slugify' modülünü yükler. Bu modül, bir dizeyi slug formatına dönüştürmek için kullanılır.
const slugify = require('slugify');

// 'slugify' fonksiyonuna geçirilecek olan seçenekleri belirler.
const options = {
    // Yerine koyma karakterini belirler. Boşluklar ve özel karakterler yerine '-' koyar.
    replacement: '-',  
    // Slug'a dönüştürülecek metinden hangi karakterlerin çıkarılacağını belirtir. 'undefined' ile varsayılan ayar kullanılır.
    remove: undefined, 
    // Sonuçta oluşacak slug'ın küçük harflerle olup olmayacağını belirler. 'true' olarak ayarlandığında, tüm karakterler küçük harfe dönüştürülür.
    lower: true,      
    // Sadece geçerli karakterlerin kullanılmasını sağlar. Özel karakterler ve diakritik işaretler çıkartılır.
    strict: true,    
    // Dil ayarını belirtir. 'tr' Türkçe karakterleri doğru bir şekilde işlemek için kullanılır.
    locale: 'tr',      
    // Başındaki ve sonundaki boşlukları temizler.
    trim: true         
}
// Slug oluşturma fonksiyonu
module.exports = function(input) {
    return input
        .toString()
        .toLowerCase()
        .trim()
        .replace(/&/g, '-and-') // '&' sembolünü '-and-' ile değiştir
        .replace(/[\s\W-]+/g, '-'); // Diğer sembolleri ve boşlukları '-' ile değiştir
};
// 'slugField' fonksiyonunu tanımlar.
// Bu fonksiyon, bir dizeyi alır ve 'slugify' fonksiyonunu kullanarak slug formatına dönüştürür.
function slugField(str) {
    // Parametrenin bir dize olup olmadığını kontrol eder. Eğer değilse, bir hata fırlatır.
    if (typeof str !== 'string') {
        throw new Error('slugField fonksiyonu bir string parametre bekliyor');
    }
    // 'slugify' fonksiyonunu kullanarak dizeyi slug formatına dönüştürür ve sonuç olarak döner.
    return slugify(str, options);
}

// 'slugField' fonksiyonunu dışa aktarır.
// Bu, diğer dosyalarda veya modüllerde kullanılmak üzere 'slugField' fonksiyonunu sağlar.
module.exports = slugField;
