# BlogApp

## Projenin Temel Amacı
Bu proje, kullanıcılara blog yazılarını paylaşabilecekleri, diğer kullanıcıların bloglarını okuyabilecekleri, arama yapabilecekleri ve çeşitli etkileşimlerde bulunabilecekleri bir platform sunmayı amaçlayan bir blog uygulamasıdır.

## Kullanılan Teknolojiler
- **Frontend**: 
  - HTML, CSS, JavaScript
  - EJS (Embedded JavaScript)
- **Backend**: 
  - Node.js
  - Express.js
- **Veritabanı**: 
  - MongoDB
- **Diğer Araçlar**: 
  - dotenv (Ortam değişkenleri yönetimi)
  - Mongoose (MongoDB için ORM)
  - Winston (Loglama)

## Öne Çıkan Özellikler
- **Kullanıcı Kimlik Doğrulama**: Kullanıcılar kayıt olabilir, giriş yapabilir ve hesap bilgilerini yönetebilir.
- **Blog Yönetimi**: Kullanıcılar blog yazılarını oluşturabilir, güncelleyebilir, silebilir ve diğer blog yazılarını görüntüleyebilir.
- **Arama ve Filtreleme**: Kullanıcılar, belirli anahtar kelimelerle blog yazılarını arayabilir ve filtreleyebilir.

## Teknik Özellikler
- **Sunucu Ortamı**: 
  - Proje, Node.js ve Express.js ile yapılandırılmıştır.
  - `index.js` dosyası, uygulamanın ana giriş noktasıdır.
- **Yönlendirme**: 
  - Farklı rotaları yöneten `routes` klasörü bulunmaktadır.
- **Veri Yönetimi**: 
  - `models` klasörü altında MongoDB veritabanı ile iletişim kuran şemalar ve modeller bulunmaktadır.
- **Ortam Değişkenleri**: 
  - `dotenv` kullanılarak proje içinde güvenli bir şekilde gizli anahtarlar ve konfigürasyon ayarları saklanmaktadır.

## Projeyi Çalıştırma

### Gereksinimler
- Node.js (v14.x veya daha üstü)
- MongoDB (Yerel ya da bulut tabanlı bir MongoDB bağlantısı)

### Adımlar
1. **Projeyi Klonlayın**:
    ```bash
    git clone <repo-url>
    ```
2. **Proje Dizinine Gidin**:
    ```bash
    cd BlogApp
    ```
3. **Bağımlılıkları Yükleyin**:
    ```bash
    npm install
    ```
4. **Ortam Değişkenlerini Ayarlayın**:
    - Proje kök dizininde bir `.env` dosyası oluşturun ve aşağıdaki bilgileri ekleyin:
    ```env
    PORT=3000
    MONGO_URI=<MongoDB URI>
    SECRET_KEY=<Your Secret Key>
    ```
5. **Uygulamayı Çalıştırın**:
    ```bash
    npm start
    ```
6. **Tarayıcıda Görüntüleyin**:
    - Tarayıcınızı açın ve `http://localhost:3000` adresine gidin.

### Ek Notlar
- **Geliştirme Modu**: 
    - Geliştirme modunda çalıştırmak için `nodemon` kullanarak uygulamanın yeniden başlatılmasını sağlayabilirsiniz.
    ```bash
    npm run dev
    ```
- **Güvenlik**: 
    - `.env` dosyasının güvenliği sağlanmalı ve asla GitHub'da yayınlanmamalıdır.
 ## Projeyi Canlı Olarak Görüntüleyin

Projeyi canlı olarak görmek için aşağıdaki linke tıklayın:

[BlogApp Canlı Uygulama](https://blog-app1-0a08a34f581f.herokuapp.com/account/login)
