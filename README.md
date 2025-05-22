
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
│ ├── Data/
│   └── confessions.json  # Menyimpan data Confess
│ ├── Handlers/
│   └── message.j
│ ├── Config.js     # Konfigurasi bot
├── Quiet.js
├── package.json
```

---

## ✦ Library & Tools

Proyek ini dibangun menggunakan:

- [Baileys Pro](https://github.com/WhiskeySockets/Baileys) - Multi-device WhatsApp Web API untuk Node.js.
- [Node.js](https://nodejs.org) - Runtime environment JavaScript.

---

## ✦ Kontribusi

Pull request terbuka untuk fitur baru, perbaikan bug, atau ide kreatif lainnya. Jangan ragu untuk fork & eksplorasi!

---

## ✦ Lisensi

MIT License © 2025 — [QuietArtx]

---

> **QuietWhisper** bukan bagian dari WhatsApp Inc. Gunakan dengan bijak dan hanya untuk tujuan edukasi atau eksperimen.
