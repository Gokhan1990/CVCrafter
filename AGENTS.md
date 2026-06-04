# CV Creator App - AGENTS.md

## Proje Bilgisi
- **Proje**: Mükemmel CV Oluşturma Uygulaması
- **Stack**: React + Vite (JavaScript)
- **PDF Export**: html2canvas + jsPDF
- **Style**: Pure CSS (flexbox/grid)

## Özellikler
### Temel
- [x] Vite + React altyapısı
- [x] PDF export (html2canvas + jsPDF)
- [x] Canlı önizleme
- [x] Renk ve font ayarları
- [x] Profil fotoğrafı yükleme

### CV Oluşturma
- [x] Kişisel bilgiler (isim, email, telefon, adres, ünvan)
- [x] GitHub / Portföy linkleri (yazılımcı için kritik)
- [x] Profesyonel özet
- [x] İş deneyimi (STAR yöntemi desteği, madde işareti)
- [x] Eğitim bilgisi
- [x] Teknik yetenekler (kategorize edilmiş: dil/framework/araç/DB)
- [x] Yetenek seviyesi (başlangıç/orta/ileri/uzman)
- [x] Diller
- [x] Sertifikalar

### CV Şablonları
- [x] Modern (renkli, yan panelli)
- [x] Klasik (dengeli, iki sütunlu)
- [x] ATS Dostu (sade, siyah-beyaz, sistemler için optimize)

### CV Yükleme & Analiz
- [x] PDF yükleme (pdfjs-dist ile metin çıkarma)
- [x] AI analiz (eksik alan tespiti + öneriler)
- [x] Otomatik form doldurma

### İK Analizi
- [x] CV puanlama (0-100)
- [x] 16 kriterli İK değerlendirme
- [x] Güçlü / zayıf yön tespiti
- [x] İyileştirme önerileri
- [ ] Görsel CV (resim) yükleme desteği
- [ ] Gelişmiş AI analiz (LLM ile anlamsal çıkarım)

## İK Perspektifi (Yazılım Sektörü)
- ATS uyumluluğu kritik - başvuruların %75'i ATS sistemlerinden geçer
- GitHub/Portföy linki yazılımcı için olmazsa olmaz
- Sayısal veri içeren CV'ler 2x daha fazla geri dönüş alır
- Kategorize edilmiş yetenekler ATS puanını %40 artırır
- STAR yöntemi (Durum-Görev-Aksiyon-Sonuç) en etkili anlatım biçimidir

## Kullanım
```bash
node server/index.cjs     # Backend (port 3001)
npm run dev               # Frontend (port 5173)
# ya da:
start.bat                 # İkisini birden başlatır
npm run build             # Production build
```

## AI Analiz Flow
1. Kullanıcı frontend'den PDF yükler → backend `uploads/` dizinine kaydeder
2. Backend PDF'den metin çıkarır (pdf-parse) ve DeepSeek API'ye gönderir
3. DeepSeek analiz sonucunu doğrudan `analysis/result.json`'a yazar (senkron)
4. Frontend polling ile sonucu alır ve gösterir

## gstack
- Tasarım için gstack kullanılabilir
- /design-review ile görsel denetim yapılabilir

## Mimari
```
src/
  context/CVContext.jsx   - CV state management
  components/             - Form bileşenleri
  templates/              - CV şablonları
  utils/                  - PDF export vb. yardımcılar
  App.jsx                 - Ana layout (form + preview)
```

## Önemli Kararlar
- Tek sayfa uygulama (SPA)
- Context API ile state yönetimi
- Sol panel form, sağ panel önizleme
- html2canvas ile DOM'dan PDF render

## Kurallar
- CSS class naming: BEM benzeri (camelCase)
- Tüm metinler varsayılan olarak Türkçe
- Yeni bileşen eklerken mevcut pattern'ı takip et
