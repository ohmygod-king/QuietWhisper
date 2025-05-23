const fs = require('fs');
const path = require('path');
const confessionsPath = path.resolve(__dirname, '../../Data/confessions.json');
const cooldownPath = path.resolve(__dirname, '../../Data/confessCooldown.json');
const c = require('../../Config.js');

if (!fs.existsSync(confessionsPath)) fs.writeFileSync(confessionsPath, '{}', 'utf-8');
if (!fs.existsSync(cooldownPath)) fs.writeFileSync(cooldownPath, '{}', 'utf-8');

function generateId(length = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

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
      return quiet.sendMessage(sender, { text: '❌ Format salah!\nContoh: !confess 628xxx Pesanmu (maks 500 karakter)' });
    }

    const cooldown = JSON.parse(fs.readFileSync(cooldownPath));
    const now = Date.now();
    if (cooldown[sender] && now - cooldown[sender] < 60000) {
      return quiet.sendMessage(sender, { text: '⏳ Tunggu 1 menit sebelum mengirim confess lagi.' });
    }

    const id = generateId();
    const data = JSON.parse(fs.readFileSync(confessionsPath));

    data[id] = {
      from: sender,
      to: `${target}@s.whatsapp.net`,
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
    
    const imagePath = path.resolve(__dirname, '../../.assets/banner.png');
    
    await quiet.sendMessage(`${target}@s.whatsapp.net`, {
      image: { url: imagePath },
      text:
`─────  Pesan Rahasia  ─────

*"${content}"*

Balas dengan perintah:
${prefix}balas ${id} Pesanmu

[!] Pesan ini ditulis oleh seseorang, bot hanya menyampaikan

> ID Confess: ${id}
────────────────────────`
    });

    await quiet.sendMessage(sender, {
      text: `✅ Confession terkirim secara anonim ke ${target}\nID: ${id}`
    });
  }
};