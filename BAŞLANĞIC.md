# Qızıl Satış Platforması - Azərbaycan

## 🚀 5 Dəqiqədə Başlayın

### 1. Asılılıqları Quraşdırın

```bash
npm install
```

### 2. İlk Müştərini Quraşdırın

```bash
npm run setup:client -- \
  --name="Qızıl Sarayı" \
  --phone="+994501234567" \
  --whatsapp="+994501234567" \
  --primary="#D4AF37"
```

### 3. Konfiqurasiyanı Kopyalayın

```bash
cp .env.client-qizil-sarayi .env
```

### 4. MongoDB-ni Başladın

```bash
# macOS
brew services start mongodb-community

# və ya
mongod
```

### 5. Verilənlər Bazasını Doldurun

```bash
cd backend
npm run seed
```

**Standart Admin Girişi:**
- E-poçt: `admin@example.com`
- Şifrə: `admin123`

⚠️ **ÖNƏMLİ:** İlk girişdən sonra dərhal şifrəni dəyişdirin!

### 6. Serveri Başladın

```bash
# Əsas qovluqdan
npm run dev
```

Bu başladır:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin Panel: http://localhost:3000/admin

## 🎨 Xüsusiyyətlər

### ✅ Tam Hazır Funksiyalar

**Müştəri Tərəfi:**
- 🏠 Ana səhifə hero bölməsi ilə
- 📦 Məhsul kataloqu
- 🔍 Kateqoriya filtrləri
- 📱 Mobil-first dizayn
- 📞 Zəng və WhatsApp düymələri
- 🎨 Dinamik brend (rənglər, ad)
- 🌙 Qaranlıq rejim

**Admin Paneli:**
- 📊 İdarə paneli (statistika)
- ➕ Məhsul əlavə et/redaktə et/sil
- 🖼️ Şəkil yükləmə və optimallaşdırma
- 📈 Analitika
- 🔒 **GİZLİ BREND PARAMETRLƏRİ** - Yalnız sizin üçün!
  - Logo dəyişdirmə
  - Rəng dəyişdirmə
  - Biznes adı dəyişdirmə
  - Əlaqə məlumatları

### 🔒 Gizli Brend Səhifəsi

Admin panelində **yalnız sizin üçün** gizli səhifə var:

**URL:** http://localhost:3000/admin/secret-branding

Bu səhifədə siz:
- ✅ Biznes adını dəyişə bilərsiniz
- ✅ Əsas və vurğu rənglərini dəyişə bilərsiniz
- ✅ Telefon və WhatsApp nömrələrini yeniləyə bilərsiniz
- ✅ Sosial media linklərini əlavə edə bilərsiniz

**Heç kəs bu səhifədən xəbərdar olmamalıdır!**

## 💰 Azərbaycan Manatı (₼)

Bütün qiymətlər Azərbaycan manatı ilə göstərilir:
- Valyuta simvolu: ₼
- Format: 1.500 ₼
- Çəki: qram

## 📱 Mobil Prioritet

Vebsayt mobil telefonlar üçün optimallaşdırılıb:
- ✅ Toxunma düymələri (44px minimum)
- ✅ Sürüşdürmə jestləri
- ✅ Sürətli yükləmə
- ✅ Responsiv dizayn

## 🛠️ Məhsul Əlavə Etmək

### Admin Panel vasitəsilə:

1. http://localhost:3000/admin/login - Daxil olun
2. "Məhsullar" bölməsinə keçin
3. "Məhsul Əlavə Et" düyməsinə klikləyin
4. Formanı doldurun:
   - Ad (məsələn: "24K Qızıl Bilərzik")
   - Təsvir
   - Qiymət (₼)
   - Çəki (qram)
   - Təmizlik (99.99%)
   - Kateqoriya
   - Şəkillər yükləyin
5. "Yadda Saxla"

## 🎨 Brendi Dəyişdirmək

### Gizli Səhifə vasitəsilə (Tövsiyə edilir):

1. Admin panelə daxil olun
2. "🔒 Gizli Parametrlər" bölməsinə keçin
3. Parametrləri dəyişdirin
4. "Parametrləri Yadda Saxla"
5. Səhifə avtomatik yenilənəcək

### .env faylı vasitəsilə:

```env
BUSINESS_NAME=Sizin Biznes Adınız
PRIMARY_COLOR=#D4AF37
ACCENT_COLOR=#B48F40
PHONE_NUMBER=+994501234567
WHATSAPP_NUMBER=+994501234567
```

## 📂 Layihə Strukturu

```
gold-selling-platform/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Komponentlər
│   │   ├── pages/        # Səhifələr
│   │   │   ├── admin/    # Admin səhifələri
│   │   │   └── ...
│   │   ├── i18n/         # Azərbaycan dili
│   │   └── ...
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── models/       # Verilənlər bazası modelləri
│   │   ├── routes/       # API marşrutları
│   │   └── ...
├── uploads/               # Yüklənmiş şəkillər
└── ...
```

## 🔐 Təhlükəsizlik

- ✅ JWT autentifikasiya
- ✅ Bcrypt şifrə hash
- ✅ Rate limiting
- ✅ CORS qoruması
- ✅ Input validasiya

## 📊 Analitika

Admin paneldə görə bilərsiniz:
- 👥 Ümumi ziyarətçilər
- 👁️ Məhsul baxışları
- 📞 Sorğular
- 📈 Konversiya dərəcəsi

## 🌐 Dil

Bütün interfeys Azərbaycan dilindədir:
- ✅ Frontend (müştəri tərəfi)
- ✅ Admin paneli
- ✅ Xəta mesajları
- ✅ Düymələr və etiketlər

## 🚀 İstehsala Göndərmək

1. Layihəni build edin:
```bash
npm run build
```

2. MongoDB-ni konfiqurasiya edin
3. .env faylını yeniləyin (production)
4. Serveri başladın:
```bash
npm start
```

Ətraflı məlumat üçün `DEPLOYMENT.md` faylına baxın.

## 💡 Məsləhətlər

1. **Şəkilləri optimallaşdırın** - Sistem avtomatik optimallaşdırır
2. **Mobil testdən keçirin** - Əsas prioritet mobildir
3. **Gizli səhifəni qoruyun** - Heç kəsə deməyin
4. **Şifrəni dəyişdirin** - İlk girişdən sonra
5. **Yedəkləmə edin** - Verilənlər bazası və şəkilləri

## 🆘 Kömək

Problemlər:
- MongoDB bağlantı xətası → MongoDB işləyir?
- Şəkillər yüklənmir → `uploads/` qovluğu var?
- Admin girişi işləmir → Şifrə düzdür?

## 🎉 Hazırsınız!

Platformanız tam hazırdır və işləyir. İndi:
1. ✅ Məhsullar əlavə edin
2. ✅ Brendi fərdiləşdirin
3. ✅ Müştərilərə satın
4. ✅ Qazanc əldə edin!

**Uğurlar!** 🚀
