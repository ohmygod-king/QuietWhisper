const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys'); // pastikan sudah di-setup

module.exports = {
    name: 'broadcast',
    description: 'Mengirim broadcast ke semua user bot',
    ownerOnly: true,
    async execute(quiet, msg, args) {
        const welcomePath = path.resolve(__dirname, '../../Data/welcome.json');
        if (!fs.existsSync(welcomePath)) {
            return await quiet.sendMessage(msg.key.remoteJid, { text: '❌ Tidak ada data pengguna.' });
        }

        const users = JSON.parse(fs.readFileSync(welcomePath));
        if (users.length === 0) {
            return await quiet.sendMessage(msg.key.remoteJid, { text: '❌ Tidak ada pengguna yang terdaftar.' });
        }

        const messageParts = args;
        const imageUrl = "";
        const textMessage = messageParts.join(' ');
        if (!textMessage) {
            return await quiet.sendMessage(msg.key.remoteJid, {
                text: '❌ Contoh penggunaan:\n!broadcastimg <pesan>\nContoh: !broadcastimg Halo semua!'
            });
        }

        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        let success = 0;
        let failed = 0;
        let idCounter = Math.floor(100 + Math.random() * 900); // bikin ID random #100-999

        await quiet.sendMessage(msg.key.remoteJid, { text: `✅ Memulai broadcast gambar ke ${users.length} pengguna...` });

        for (const user of users) {
            const confessId = `#${idCounter++}`;
            const broadcastText = `──────  Broadcast  ──────
Dari: *Owner*
Pesan:
*"${textMessage}"*

[!] Pesan ini ditulis oleh owner untuk menyampaikan pesan kepada seluruh pengguna bot
────────────────────────`;

            try {
                await quiet.sendMessage(user, {
                    image: { url: imageUrl },
                    caption: broadcastText
                });
                console.log(`✔️ Broadcast terkirim ke ${user}`);
                success++;
            } catch (err) {
                console.error(`❌ Gagal kirim ke ${user}:`, err);
                failed++;
            }

            await delay(5000); // delay 2 detik per pesan
        }

        await quiet.sendMessage(msg.key.remoteJid, {
            text: `✅ Broadcast selesai!\nSukses: ${success}\nGagal: ${failed}`
        });
    }
};