# 🧿 WADP Zoomer

> 🔧 Alat ringan untuk membuat foto profil WhatsApp tampil penuh layar — tanpa crop, tanpa batas putih, langsung pas dan maksimal!

---

## 🎈 Kelebihan

- 🖼️ Menyesuaikan ukuran foto otomatis agar memenuhi layar DP WhatsApp
- 📐 Posisi dan rasio disetel agar tetap proporsional
- 🤖 Koneksi langsung ke WhatsApp Web dengan bantuan Baileys
- 🔄 Cocok untuk diintegrasikan ke aplikasi lain lewat endpoint API
- 🧳 Tidak menyimpan file pengguna — proses langsung & aman

---

## 🧪 Komponen Teknologi

| Komponen     | Fungsi                              |
|--------------|--------------------------------------|
| Node.js      | Server utama backend                 |
| Fastify      | Framework ringan untuk routing       |
| Baileys      | Library koneksi WhatsApp             |
| Sharp        | Pemrosesan dan resize gambar         |
| Formidable   | Menangani upload gambar              |
| Deta Space   | Alternatif deployment ringan         |

---

## ⚙️ Instalasi & Jalankan

```bash
git clone https://github.com/kamu/wadp-zoomer.git
cd wadp-zoomer
npm install
npm start
