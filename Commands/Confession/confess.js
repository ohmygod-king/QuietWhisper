const fs = require('fs');
const path = require('path');
const axios = require('axios');
const confessionsPath = path.resolve(__dirname, '../../Data/confessions.json');
const cooldownPath = path.resolve(__dirname, '../../Data/confessCooldown.json');
const c = require('../../Config.js');

if (!fs.existsSync(confessionsPath)) fs.writeFileSync(confessionsPath, '{}', 'utf-8');
if (!fs.existsSync(cooldownPath)) fs.writeFileSync(cooldownPath, '{}', 'utf-8');

module.exports = {
  name: 'confess',
  description: 'Mengirimkan pesan Confess.',
  category: 'Confession',
  async execute(quiet, msg, args) {
    const sender = msg.key.remoteJid;
    const target = args[0];
    const content = args.slice(1).join(' ');
    const prefix = c.prefix;

    if (!target || !content || content.length > 500) {
      return quiet.sendMessage(sender, { text: '❌ Format salah!\nContoh: !confess 08xxx Pesanmu (maks 500 karakter)' });
    }

    let formattedTarget = target;
    if (target.startsWith('08')) {
      formattedTarget = '62' + target.slice(1);
    } else if (target.startsWith('62')) {
      formattedTarget = target;
    } else if (target.endsWith('@s.whatsapp.net')) {
      formattedTarget = target.replace('@s.whatsapp.net', '');
    }

    const cooldown = JSON.parse(fs.readFileSync(cooldownPath));
    const now = Date.now();
    if (cooldown[sender] && now - cooldown[sender] < 60000) {
      return quiet.sendMessage(sender, { text: '⏳ Tunggu 1 menit sebelum mengirim confess lagi.' });
    }

    let lastId = 0;
    const data = JSON.parse(fs.readFileSync(confessionsPath));
    const numericIds = Object.keys(data)
      .map(key => parseInt(key.replace('#', '')))
      .filter(num => !isNaN(num));
    lastId = numericIds.length > 0 ? Math.max(...numericIds) : 0;

    const id = `#${lastId + 1}`;

    data[id] = {
      from: sender,
      to: `${formattedTarget}@s.whatsapp.net`,
      messages: [
        {
          sender: 'from',
          text: content,
          timestamp: new Date().toISOString()
        }
      ]
    };

    fs.writeFileSync(confessionsPath, JSON.stringify(data, null, 2));
    cooldown[sender] = now;
    fs.writeFileSync(cooldownPath, JSON.stringify(cooldown, null, 2));

    await new Promise(r => setTimeout(r, 1200));

    const imageUrl = 'https://i.ibb.co/KxPHTyXs/incoming.png';
    
    await quiet.sendMessage(sender, { text: `Sedang mengirim...`}, { quoted: msg });

    try {
      const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(res.data, 'binary');

      await quiet.sendMessage(`${formattedTarget}@s.whatsapp.net`, {
        image: buffer,
        mimetype: 'image/jpeg',
        caption:
`──────  Pesan Rahasia  ──────

Dari: *Sesorang*
Pesan: 
*"${content}"*

> Balas dengan perintah:
> ${prefix}balas ${id} Pesanmu

> [!] Pesan ini ditulis oleh seseorang, bot hanya menyampaikan
> ID Confess: ${id}
────────────────────────`
      });
    } catch (err) {
      await quiet.sendMessage(sender, { text: `❌ Gagal mengirim gambar: ${err.message}` });
      return;
    }

    await quiet.sendMessage(sender, {
      text: `✅ Confession terkirim secara anonim ke ${formattedTarget}\nID: ${id}`
    });
  }
};