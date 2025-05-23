const fs = require('fs');
const path = require('path');
const confessionsPath = path.resolve(__dirname, '../../Data/confessions.json');
const cooldownPath = path.resolve(__dirname, '../../Data/balasCooldown.json');

if (!fs.existsSync(cooldownPath)) fs.writeFileSync(cooldownPath, '{}', 'utf-8');

module.exports = {
  name: 'balas',
  description: 'Membalas pesan Confess.',
  category: 'Confession',
    async execute(quiet, msg, args) {
        const sender = msg.key.remoteJid;
        const id = args[0]?.toUpperCase();
        const content = args.slice(1).join(' ');

        if (!id || !content || content.length > 500) {
            return quiet.sendMessage(sender, { text: '❌ Format salah!\nContoh: !balas 8X2K1 Pesanmu (maks 500 karakter)' });
        }

        const cooldown = JSON.parse(fs.readFileSync(cooldownPath));
        const now = Date.now();
        if (cooldown[sender] && now - cooldown[sender] < 60000) {
            return quiet.sendMessage(sender, { text: '⏳ Tunggu 1 menit sebelum membalas confession lain.' });
        }

        if (!fs.existsSync(confessionsPath)) {
            return quiet.sendMessage(sender, { text: '❌ Tidak ditemukan data confession.' });
        }

        const data = JSON.parse(fs.readFileSync(confessionsPath));
        const entry = data[id];

        if (!entry || entry.to !== sender) {
            return quiet.sendMessage(sender, { text: '❌ ID tidak valid atau bukan milikmu.' });
        }

        cooldown[sender] = now;
        fs.writeFileSync(cooldownPath, JSON.stringify(cooldown, null, 2));

        await new Promise(r => setTimeout(r, 1200));

        await quiet.sendMessage(entry.from, {
            text: 
`📬 *Balasan dari confession ID ${id}:*

"${content}"`
        });

        await quiet.sendMessage(sender, {
            text: '✅ Balasan berhasil dikirim secara anonim.'
        });

        delete data[id];
        fs.writeFileSync(confessionsPath, JSON.stringify(data, null, 2));
    }
};