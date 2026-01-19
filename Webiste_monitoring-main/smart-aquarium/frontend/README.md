# 🐟 Smart Aquarium Monitoring Dashboard

Dashboard monitoring IoT lengkap untuk akuarium ikan Comet Goldfish dengan data realtime dari sensor IoT. Dibangun menggunakan **React.js**, **TailwindCSS**, dan **Recharts**.

![Dashboard Preview](https://img.shields.io/badge/Status-Ready%20to%20Deploy-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-06B6D4)
![Recharts](https://img.shields.io/badge/Recharts-2.7.2-8B5CF6)

---

## 🎯 Fitur Utama

### 📊 Ringkasan Statistik (Status Cards)
- **Kekeruhan Air (Turbidity)** - Status: Baik / Warning / Bahaya (Ideal < 10 NTU)
- **Suhu Air** - Status Ideal/Not Ideal (20-25°C)
- **pH Air** - Status monitoring (7.0-8.0)
- **Level Air** - Status overflow/low (70-90%)
- **Habitat Score** - Persentase kesehatan ikan berdasarkan parameter

### 📈 Realtime Charts (Update setiap 5 detik)
| Grafik | Tipe Chart | Warna |
|--------|-----------|-------|
| Turbidity vs Time | Line Chart | Cyan |
| Suhu vs Time | Line Chart | Orange |
| pH vs Time | Line Chart | Purple |

### 🔧 Pump Control & Status
- **Status Pompa**: Buang Air / Isi Air / OFF
- **Mode Kontrol**:
  - **AUTO** (default) - Otomatis buang air saat turbidity > 10 NTU
  - **MANUAL** - Kontrol manual dengan tombol ON/OFF
- **Indikator Warna**:
  - 🟢 Hijau - Normal
  - 🟡 Kuning - Warning
  - 🔴 Merah - Danger

### 📝 Logs & Notifikasi
- Riwayat pergantian air otomatis (timestamp + durasi)
- Alert realtime bila air keruh > 10 NTU
- Notifikasi suhu dan pH tidak ideal
- Activity logs untuk semua aksi sistem

---

## 📁 Struktur Proyek

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Header dengan profil user
│   │   ├── StatusCard.jsx          # Card untuk menampilkan status sensor
│   │   ├── RealtimeChart.jsx       # Grafik realtime dengan Recharts
│   │   ├── PumpControl.jsx         # Kontrol pompa AUTO/Manual
│   │   └── LogsNotification.jsx    # Logs dan notifikasi alerts
│   │
│   ├── hooks/
│   │   └── useSensorSimulation.js  # Custom hook untuk simulasi sensor
│   │
│   ├── pages/
│   │   └── Dashboard.jsx           # Main dashboard page
│   │
│   ├── App.jsx                     # Root component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles + Tailwind
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🚀 Instalasi & Menjalankan Proyek

### Prerequisites
- Node.js (v16 atau lebih baru)
- npm atau yarn

### Langkah 1: Masuk ke Folder Frontend
```bash
cd frontend
```

### Langkah 2: Install Dependencies
```bash
npm install
```

### Langkah 3: Jalankan Development Server
```bash
npm run dev
```

### Langkah 4: Buka Browser
Aplikasi akan berjalan di: **http://localhost:5173**

### Build untuk Production
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

---

## 🧩 Parameter Sensor

| Parameter | Satuan | Range Ideal | Deskripsi |
|-----------|--------|-------------|-----------|
| **Turbidity** | NTU | < 10 NTU | Tingkat kekeruhan air |
| **Suhu Air** | °C | 20-25°C | Suhu optimal untuk Comet Goldfish |
| **pH Air** | - | 7.0-8.0 | Tingkat keasaman air |
| **Level Air** | % | 70-90% | Persentase volume air |
| **Habitat Score** | % | 80-100% | Skor kesehatan habitat ikan |

---

## 🎨 Teknologi yang Digunakan

- **React 18.2.0** - UI Library dengan Functional Components & Hooks
- **TailwindCSS 3.3.3** - Utility-first CSS framework
- **Recharts 2.7.2** - Charting library untuk visualisasi data
- **Vite 4.4.9** - Build tool dan development server
- **Axios 1.6.0** - HTTP client (siap untuk integrasi API real)

---

## 💡 Cara Kerja Sistem

### 1. Simulasi Data Realtime
- Data sensor diupdate otomatis setiap **5 detik**
- Menggunakan custom hook `useSensorSimulation`
- Data disimulasikan dengan variasi realistis

### 2. Klasifikasi Status Otomatis
```javascript
// Contoh logika klasifikasi
Turbidity < 5 NTU      → Status: Baik
Turbidity 5-10 NTU     → Status: Warning  
Turbidity > 10 NTU     → Status: Bahaya
```

### 3. Mode AUTO Pump
- Sistem otomatis memantau turbidity
- Jika turbidity > 10 NTU:
  1. Pompa buang air keruh (15 detik)
  2. Pompa isi air bersih (10 detik)
  3. Turbidity kembali normal (~5 NTU)
  4. Alert dibuat dan dicatat di logs

### 4. Mode MANUAL Pump
- User dapat kontrol pompa secara manual
- Tombol ON/OFF tersedia
- Semua aksi tercatat di activity logs

---

## 📱 Responsiveness

Dashboard fully responsive untuk:
- 📱 **Mobile** (< 768px)
- 💻 **Tablet** (768px - 1024px)
- 🖥️ **Desktop** (> 1024px)

Grid layout otomatis adjust dengan Tailwind breakpoints:
- `md:` untuk tablet
- `lg:` untuk desktop

---

## 🎯 Highlights & Best Practices

✅ **Modular Components** - Setiap komponen reusable dan independent  
✅ **Custom Hooks** - Logic terpisah dari UI untuk maintainability  
✅ **Real-time Updates** - Data refresh otomatis tanpa reload  
✅ **Color-coded Status** - Visual feedback jelas untuk setiap kondisi  
✅ **Smooth Animations** - Transisi dan hover effects dengan Tailwind  
✅ **Clean Code** - Readable, well-structured, dan terdokumentasi  
✅ **Production Ready** - Siap deploy dengan optimisasi Vite  

---

## 🔮 Fitur Tambahan yang Bisa Dikembangkan

- [ ] Integrasi dengan backend API real (Node.js/Django)
- [ ] WebSocket untuk real-time data streaming
- [ ] Export data ke CSV/Excel
- [ ] Historical data analysis dengan date range picker
- [ ] Push notifications untuk mobile devices
- [ ] Multi-aquarium support
- [ ] User authentication & role management
- [ ] Dark mode toggle
- [ ] Internationalization (i18n) - Multi-language support

---

## 📞 Support & Kontribusi

Jika menemukan bug atau ingin berkontribusi:
1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

Project ini dibuat untuk keperluan monitoring Smart Aquarium IoT.

---

## 👨‍💻 Developer Notes

### Konfigurasi Penting

**Vite Config** (`vite.config.js`):
```javascript
export default {
  server: {
    port: 5173,
    host: true
  }
}
```

**Tailwind Config** (`tailwind.config.js`):
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {}
  }
}
```

### Troubleshooting

**Problem**: Port 5173 sudah digunakan  
**Solution**: Edit `vite.config.js` dan ubah port number

**Problem**: Tailwind styles tidak muncul  
**Solution**: Pastikan `@tailwind` directives ada di `index.css`

**Problem**: Chart tidak rendering  
**Solution**: Pastikan data memiliki struktur yang benar dengan property `time` dan value

---

## 🌟 Showcase

Dashboard ini menampilkan:
- ✨ **Modern UI/UX** dengan gradients dan shadows
- 🎨 **Color-coded indicators** untuk quick status recognition
- 📊 **Interactive charts** dengan hover tooltips
- 🔄 **Live data updates** dengan smooth transitions
- 📱 **Mobile-first design** yang fully responsive
- ⚡ **Lightning-fast performance** dengan Vite

---

**Made with ❤️ for Comet Goldfish Lovers** 🐟

Dashboard ini siap digunakan dan dapat langsung dihubungkan dengan sensor IoT real atau backend API sesuai kebutuhan!
