// Gerekli modellerin içe aktarılması
const Blog = require('../models/blog'); // Blog modeli
const Category = require('../models/category'); // Kategori modeli

// Tüm blogları listeleyen fonksiyon
exports.blog_list = async function(req, res) {
    const size = 3; // Sayfa başına gösterilecek blog sayısı
    const { page = 0 } = req.query; // Mevcut sayfa numarası; varsayılan olarak 0 (ilk sayfa)
    const slug = req.params.slug; // URL'den kategori slug'ını alır

    try {
        let query = { onay: true }; // Onaylanmış bloglar için sorgu oluşturuluyor
        if (slug) {
            // Eğer bir kategori slug'ı verilmişse, o kategoriye ait bloglar filtreleniyor
            const category = await Category.findOne({ url: slug });
            if (category) {
                query.categories = category._id; // Sorguya kategori filtresi ekleniyor
            }
        }

        // Toplam blog sayısını hesaplar
        const totalItems = await Blog.countDocuments(query);
        
        // Belirli sayfa için blogları getirir
        const blogs = await Blog.find(query)
            .skip(page * size) // Sayfa kaydırma için skip kullanılır
            .limit(size) // Sayfa başına belirli bir sayıda blog getirir
            .populate('categories') // Kategorileri dahil eder
            .lean(); // Veriyi JavaScript objesi olarak döner

        // Tüm kategorileri getirir
        const categories = await Category.find().lean();

        // Blog listeleme sayfasını render eder
        res.render("users/blogs", {
            title: "Tüm Kurslar", // Sayfa başlığı
            blogs: blogs, // Blog listesi
            totalItems: totalItems, // Toplam blog sayısı
            totalPages: Math.ceil(totalItems / size), // Toplam sayfa sayısı
            currentPage: page, // Mevcut sayfa numarası
            categories: categories, // Kategori listesi
            selectedCategory: slug // Seçili kategori slug'ı
        });
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
        res.status(500).send('Bir hata oluştu'); // Hata durumunda hata mesajı gönderilir
    }
};

// Belirli bir blogun detaylarını gösteren fonksiyon
exports.blogs_details = async function(req, res) {
    const slug = req.params.slug; // URL'den blog slug'ını alır
    try {
        // Slug ve onay durumu eşleşen blogu bulur ve kategorilerini dahil eder
        const blog = await Blog.findOne({ url: slug, onay: true }).populate('categories').lean();

        if(blog) {
            // Blog bulunduysa detay sayfasını render eder
            return res.render("users/blog-details", {
                title: blog.baslik, // Blog başlığını sayfa başlığı olarak ayarlar
                blog: blog // Blog detayları
            });
        }
        // Blog bulunamazsa 404 hata sayfasını render eder
        res.status(404).render("error/404", { title: "Sayfa bulunamadı" });
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
        res.status(500).send('Bir hata oluştu'); // Hata durumunda hata mesajı gönderilir
    }
};

// Ana sayfayı gösteren fonksiyon
exports.index = async function(req, res) {
    try {
        // Anasayfada gösterilmesi gereken ve onaylanmış blogları getirir
        const blogs = await Blog.find({ anasayfa: true, onay: true }).populate('categories').lean();
        const categories = await Category.find().lean(); // Tüm kategorileri getirir

        // Ana sayfayı render eder
        res.render("users/index", {
            title: "Popüler Kurslar", // Sayfa başlığı
            blogs: blogs, // Anasayfa blog listesi
            categories: categories, // Kategori listesi
            selectedCategory: null // Seçili kategori yok
        });
    }
    catch(err) {
        console.log(err); // Hata konsola yazdırılır
        res.status(500).send('Bir hata oluştu'); // Hata durumunda hata mesajı gönderilir
    }
};
