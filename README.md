
<p align="center">
  <img src=".assets/banner.png" alt="Banner" width="100%" />
</p>

# ❖ QuietWhisper ┋ WhatsApp Confession Bot

**QuietWhisper** adalah bot WhatsApp berbasis Node.js menggunakan Baileys Library yang memungkinkan pengguna mengirim _confession_ atau pesan rahasia secara anonim ke pengguna WhatsApp lainnya.

> **Where secrets speak softly.**

---

## ✦ Fitur Unggulan

- **Welcome Message Elegan**  
  Menyambut pengguna baru dengan pesan stylish dan informatif.

- **Kirim Confession Anonim**  
  Perintah `!confess <nomor> <pesan>` untuk mengirim pesan rahasia ke siapa pun tanpa mengungkap identitas pengirim.

- **Balasan Confession**  
  Penerima dapat membalas pesan dengan ID unik.

- **Anti-Spam & Rate Limiting**  
  Mencegah spam & menjaga performa dengan logika delay & deteksi pengulangan.

- **Multi-file Config**  
  Pengaturan seperti owner, pesan welcome, dan lainnya disimpan dalam `config.js` agar mudah dikustomisasi.

- **Configurasi Bot**  
  Mengubah Nama, Profile dan About me dengan sangat mudah hanya dengan menggunakan command yang tersedia

---

## ✦ Instalasi

```bash
git clone https://github.com/username/QuietWhisper
cd QuietWhisper
npm install
```

---

## ✦ Jalankan Bot

```bash
node Quiet.js
npm start
```

Bot akan menampilkan Pairing Code untuk login WhatsApp.

---

## ✦ Struktur

```
## Struktur Folder

QuietWhisper/ 
├── Commands/ 
│   └── Confession/ 
│       ├── balas.js  # Membalas pesan Confess 
│       └── confess.js  # Mengirim pesan Confess
│   └── Utils/
│       ├── help.js  # Menampilkan semua command
│       └── setbot.js  # Mengatur tampilan bot
├── Data/
│   └── confessions.json  # Menyimpan data Confess
├── Handlers/
│   └── message.js
├── Config.js     # Konfigurasi bot
├── Quiet.js
├── package.json
```

---

## ✦ Library & Tools

Proyek ini dibangun menggunakan:

- [Baileys Pro](https://www.npmjs.com/package/@fizzxydev/baileys-pro) - Multi-device WhatsApp Web API untuk Node.js.
- [Node.js](https://nodejs.org) - Runtime environment JavaScript.

---

## ✦ Kontribusi

Pull request terbuka untuk fitur baru, perbaikan bug, atau ide kreatif lainnya. Jangan ragu untuk fork & eksplorasi!

---

## ✦ Lisensi

MIT License © 2025 — [QuietArtx].

---

> **QuietWhisper** bukan bagian dari WhatsApp Inc. Gunakan dengan bijak dan hanya untuk tujuan edukasi atau eksperimen.
