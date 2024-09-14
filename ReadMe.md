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

## Kayıt Ol
![Ekran görüntüsü 2024-09-14 160552](https://github.com/user-attachments/assets/a3b5c36a-e55b-4d5d-98dc-ea3804994f7f)
## Giriş Yap
![Ekran görüntüsü 2024-09-14 160615](https://github.com/user-attachments/assets/dc234f23-8689-4479-be32-036c3e85d6eb)
## Ana Sayfa (Aydınlık Mod)
![Ekran görüntüsü 2024-09-14 160712](https://github.com/user-attachments/assets/e941534e-5b41-47a4-960b-cd6af6730c0a)
## Ana Sayfa (Karanlık Mod)
![Ekran görüntüsü 2024-09-14 162929](https://github.com/user-attachments/assets/967a6c4d-42c4-49c2-a349-a87855d3485f)
## Tüm Bloglar
![Ekran görüntüsü 2024-09-14 160819](https://github.com/user-attachments/assets/1613d6be-5865-4f92-a570-6f0ec0e7ce1e)
![Ekran görüntüsü 2024-09-14 160845](https://github.com/user-attachments/assets/53b583db-3786-40e9-93f1-ab80b9d29633)
## Admin Bloglar
![Ekran görüntüsü 2024-09-14 160851](https://github.com/user-attachments/assets/812fe672-7137-4546-a3a0-8d22aec35cb1)
## Blog Ekle
![Ekran görüntüsü 2024-09-14 160900](https://github.com/user-attachments/assets/5fd1820f-8dc6-4411-bc24-7559b174278f)
## Blog Düzenleme
![Ekran görüntüsü 2024-09-14 160908](https://github.com/user-attachments/assets/6f89dce3-1223-4f22-af4f-1ceb0ad5204f)
## Admin Kategoriler
![Ekran görüntüsü 2024-09-14 160927](https://github.com/user-attachments/assets/b828e3fb-1972-4eed-b807-b02ba6a3bb3f)
## Kategori Ekle
![Ekran görüntüsü 2024-09-14 160932](https://github.com/user-attachments/assets/11148b27-9e53-4772-9bed-968d88ae4771)
## Roller
![Ekran görüntüsü 2024-09-14 160938](https://github.com/user-attachments/assets/6aef17f9-b57a-4a29-9332-8324d5c43a8e)


  
 ## Projeyi Canlı Olarak Görüntüleyin

Projeyi canlı olarak görmek için aşağıdaki linke tıklayın:

[BlogApp Canlı Uygulama](https://blog-app1-0a08a34f581f.herokuapp.com/account/login)


