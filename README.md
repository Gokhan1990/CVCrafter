<div align="center">
  <h1>CVCrafter</h1>
  <p><strong>AI Destekli Profesyonel CV Oluşturma ve İK Analiz Aracı</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19">
    <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" alt="Vite 8">
    <img src="https://img.shields.io/badge/Express-5-000000?logo=express" alt="Express 5">
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PostgreSQL 16">
    <img src="https://img.shields.io/badge/Gemini-2.5--flash-8E75B2?logo=googlegemini" alt="Gemini API">
    <img src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker" alt="Docker">
  </p>

  <p>
    <strong>
      <a href="#ozellikler">Özellikler</a> •
      <a href="#teknik-mimari">Mimari</a> •
      <a href="#baslarken">Başlarken</a> •
      <a href="#api">API</a> •
      <a href="#docker">Docker</a> •
      <a href="#ai-analiz">AI Analiz</a>
    </strong>
  </p>
</div>

---

CVCrafter, PDF olarak yüklediğiniz CV'yi yapay zeka ile analiz eden, 16 farklı İK kriterinde puanlayan ve 8 profesyonel şablonla yeniden oluşturmanızı sağlayan bir web uygulamasıdır. Yazılım sektörüne yönelik ATS uyumluluğu, STAR yöntemi desteği ve akıllı önerilerle CV'nizi bir üst seviyeye taşır.

---

## Özellikler

| Özellik | Detay |
|---|---|
| **AI Analiz** | Gemini 2.5-flash ile 16 kriterli İK değerlendirmesi (0-100 puan) |
| **PDF Yükleme** | PDF'ten metin çıkarma, eksik alan tespiti, otomatik form doldurma |
| **8 Şablon** | Premium, Modern, NovaTech, JakesResume, DeedyResume, Developer, Elegant, TechResume |
| **Canlı Önizleme** | Sol panel form, sağ panel anlık önizleme |
| **PDF Export** | html2canvas + jsPDF ile tek tıkla PDF dışa aktarım |
| **STAR Yöntemi** | Deneyimleriniz AI ile Durum-Görev-Aksiyon-Sonuç formatında iyileştirilir |
| **Profil Fotoğrafı** | Fotoğraf yükleme ve PDF'ten otomatik çıkarma |
| **Özelleştirme** | Renk, font, dil ayarları, yetenek seviyesi (Başlangıç/Orta/İleri/Uzman) |
| **CV Kaydetme** | PostgreSQL ile kalıcı kayıt, localStorage ile otomatik yedekleme |
| **Güçlü / Zayıf Yön** | İyileştirme önerileri, template önerisi, ATS uyumluluk raporu |

## Teknik Mimari

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL  │
│  React+Vite  │     │   Express    │     │   (cv-db)    │
│   :5173      │     │   :3001      │     │   :5432      │
└──────┬───────┘     └──────┬───────┘     └──────────────┘
       │                    │
       │                    ▼
       │           ┌──────────────┐
       └───────────│  Gemini AI   │
                   │  (External)  │
                   └──────────────┘
```

- **Frontend:** React 19 + Vite 8 (JavaScript SPA)
- **Backend:** Express 5 (REST API, port 3001)
- **Veritabanı:** PostgreSQL 16 (cv_saves tablosu)
- **AI:** Google Gemini 2.5-flash API
- **PDF Export:** html2canvas + jsPDF
- **Container:** Docker Compose (3 servis)

### Dizin Yapısı

```
CVCrafter/
├── src/                          # Frontend kaynak kodu
│   ├── context/CVContext.jsx     # Merkezi state yönetimi
│   ├── components/               # Form ve UI bileşenleri
│   ├── templates/                # 8 CV şablonu (JSX)
│   ├── utils/
│   │   ├── pdfExport.js          # PDF dışa aktarım
│   │   └── dateFormat.js         # Tarih formatlama
│   ├── App.jsx                   # Ana layout (form + önizleme)
│   ├── main.jsx                  # Giriş noktası
│   └── index.css                 # Global stiller
├── server/
│   ├── index.cjs                 # Express API (upload, analiz, kayıt)
│   └── db.cjs                    # PostgreSQL bağlantısı
├── compose.yml                   # Docker Compose (3 servis)
├── Dockerfile                    # Frontend container
├── Dockerfile.backend            # Backend container
├── nginx.conf                    # Nginx yapılandırması
├── start.bat                     # Yerel geliştirme başlatıcı
└── vite.config.js                # Vite yapılandırması (proxy: /api → :3001)
```

---

## Başlarken

### Gereksinimler

- Node.js 20+
- npm
- PostgreSQL 16 (yerel geliştirme için)
- Gemini API anahtarı ([Google AI Studio](https://aistudio.google.com/) — ücretsiz)

### Yerel Geliştirme

```bash
# 1. Bağımlılıkları yükle
cd CVCrafter
npm install

# 2. Ortam değişkenlerini ayarla
set GEMINI_API_KEY=your-api-key-here

# 3. Backend'i başlat (port 3001)
node server/index.cjs

# 4. Yeni bir terminalde frontend'i başlat (port 5173)
npm run dev

# 5. Tarayıcıda aç: http://localhost:5173
```

> Vite geliştirme sunucusu, `/api` ve `/uploads` yollarını otomatik olarak `localhost:3001`'e yönlendirir (`vite.config.js`).

### Docker ile

```bash
# 1. Ortam değişkenlerini ayarla
set GEMINI_API_KEY=your-api-key-here

# 2. Tüm servisleri başlat
docker compose up -d

# 3. Tarayıcıda aç: http://localhost:8080

# 4. Logları izle
docker compose logs -f

# 5. Durdur
docker compose down
```

Docker ile çalıştırıldığında:
- **Frontend:** nginx üzerinden `http://localhost:8080`
- **Backend:** `http://localhost:3001`
- **PostgreSQL:** `localhost:5433` (Docker içi: `cv-db:5432`)

### Ortam Değişkenleri

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|
| `GEMINI_API_KEY` | Evet | — | Google Gemini API anahtarı |
| `GEMINI_MODEL` | Hayır | `gemini-2.5-flash` | AI model adı |
| `DB_HOST` | Hayır | `localhost` | PostgreSQL host |
| `DB_PORT` | Hayır | `5433` (yerel) / `5432` (Docker) | PostgreSQL port |
| `DB_USER` | Hayır | `cvuser` | PostgreSQL kullanıcı |
| `DB_PASS` | Hayır | `cvpass` | PostgreSQL şifre |
| `DB_NAME` | Hayır | `cvapp` | PostgreSQL veritabanı |

---

## API

### `POST /api/upload`
CV PDF'si yükler, metin çıkarır, Gemini ile analiz eder.

- **Body:** `multipart/form-data` — `cv` alanına PDF dosyası
- **Response:**
  ```json
  { "success": true, "filename": "cv-123456789.pdf", "cached": false }
  ```

### `GET /api/analysis`
Son analiz sonucunu döndürür.

- **Response:** Analiz JSON'ı veya `{ "status": "waiting" }`
- İçerik: skor, not, kriter bazlı değerlendirme, ayrıştırılmış CV verisi

### `DELETE /api/upload`
Tüm yüklenmiş PDF'leri ve analiz sonuçlarını temizler.

- **Response:** `{ "success": true }`

### `POST /api/save-cv`
CV verisini PostgreSQL'e kaydeder.

- **Body:** `{ "cvData": { ... } }`
- **Response:** `{ "success": true }`

### `GET /api/save-cv`
Kaydedilmiş CV verisini yükler.

- **Response:** CV verisi veya `{}`

---

## AI Analiz

CVCrafter'ın kalbi Gemini 2.5-flash API'dir. Yüklenen PDF'den metin çıkarılır ve aşağıdaki analiz adımları uygulanır:

### Değerlendirme Kriterleri (16 Kriter, 100 Puan)

| # | Kriter | Puan |
|---|---|---|
| 1 | Kişisel bilgiler (isim, iletişim) | 5 |
| 2 | Profesyonel özet / amaç | 10 |
| 3 | İş deneyimi (ters kronolojik, tarihler) | 15 |
| 4 | Başarı odaklı anlatım (STAR, sayısal veri) | 10 |
| 5 | Eğitim bilgisi | 8 |
| 6 | Teknik yetenekler (kategorize edilmiş) | 10 |
| 7 | Sektörle ilgili anahtar kelimeler | 7 |
| 8 | Dil becerileri | 5 |
| 9 | Sertifikalar / eğitimler | 5 |
| 10 | GitHub / portföy linki | 5 |
| 11 | ATS uyumluluğu (sade format) | 5 |
| 12 | Yazım / dil bilgisi doğruluğu | 5 |
| 13 | CV uzunluğu (ideal 1-2 sayfa) | 3 |
| 14 | Profesyonel görünüm / tutarlılık | 3 |
| 15 | Gönüllü çalışmalar / ekstra aktiviteler | 2 |
| 16 | Referanslar / mevcut durum | 2 |

### Analiz Akışı

```
PDF Yükle → Metin Çıkar (pdf-parse) → Gemini API
                                         ↓
    Kullanıcı ← Polling ← result.json ← Analiz JSON
       ↓
  "Veriyi Şablona Uygula" → Form Otomatik Dolar
```

- Aynı PDF (MD5 hash) tekrar yüklendiğinde cache'ten gelir
- Tüm çıktılar Türkçe üretilir
- İngilizce metinler (kurum adı, ünvan vb.) otomatik Türkçeleştirilir
- İş deneyimleri ters kronolojik sıralanır

---

## CV Şablonları

| Şablon | Stil |
|---|---|
| **Premium** | Gösterişli, renkli, fotoğraflı, çok sütunlu |
| **Modern** | Renkli, yan panelli, modern |
| **NovaTech** | Teknoloji odaklı, koyu tema |
| **JakesResume** | Sade, ATS dostu, minimalist |
| **DeedyResume** | İki sütunlu, akademik |
| **Developer** | Yazılımcı odaklı, GitHub linki vurgulu |
| **Elegant** | Şık, dengeli, klasik |
| **TechResume** | Teknik, yetenek odaklı |

---

## Geliştirme

```bash
npm run dev      # Geliştirme sunucusu (Vite HMR)
npm run build    # Production build → dist/
npm run preview  # Build'i önizle
npm run lint     # ESLint ile kod kalitesi
```

---

## Lisans

MIT
