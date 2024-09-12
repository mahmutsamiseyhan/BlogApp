// Express kütüphanesini ve Router'ı dahil et
const express = require("express");
// Yeni bir Express router nesnesi oluşturur
const router = express.Router();
// Modelleri dahil et
const Blog = require("../models/blog");
const Category = require("../models/category");

// Blogları listeleme ve filtreleme
router.get("/blogs", async (req, res) => {
    const query = req.query.search || ''; // Arama sorgusu
    const selectedCategory = req.query.category || ''; // Seçilen kategori

    let filter = {}; // Blogları filtrelemek için kullanılacak obje

    if (query) {
        filter.baslik = { $regex: query, $options: 'i' }; // Başlıkta arama (case-insensitive)
    }

    if (selectedCategory) {
        // Seçilen kategoriye göre blogları filtrele
        const category = await Category.findOne({ _id: selectedCategory }).populate('blogs').exec();
        filter._id = { $in: category.blogs.map(blog => blog._id) }; // Kategoriye ait blogların ID'lerini filtrele
    }

    try {
        // Blogları çek ve kategorilerle populate et
        const blogs = await Blog.find(filter).populate('categories').exec();
        // Mevcut kategorileri çek
        const categories = await Category.find({}).exec();

        // Sayfayı render et
        res.render('users/blogs', { 
            blogs, 
            categories, 
            query, 
            selectedCategory,
            title: 'Blog Listesi'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Belirli bir blog yazısının detaylarını gösteren endpoint
// URL: /blogs/:slug
// :slug, blog yazısının başlığını veya tanımlayıcısını temsil eder
// Örneğin: /blogs/my-first-post gibi bir URL, 'my-first-post' başlıklı blogun detaylarını gösterir
router.get("/blogs/:slug", async (req, res) => {
    try {
        const blog = await Blog.findOne({ url: req.params.slug }).populate('categories').exec();
        if (!blog) {
            return res.status(404).send('Blog bulunamadı');
        }
        res.render('users/blog-detail', { 
            blog, 
            title: blog.baslik 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Ana sayfa endpoint'i
// URL: /
// Bu endpoint, uygulamanın ana sayfasını render eder
router.get("/", (req, res) => {
    res.render('index', { title: 'Ana Sayfa' });
});

// Router'ı dışa aktar
// Bu, tanımlanan rotaların uygulamanın diğer bölümlerinde kullanılmasına olanak tanır
module.exports = router;
