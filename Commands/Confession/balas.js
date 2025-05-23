const fs = require('fs');
const path = require('path');
const confessionsPath = path.resolve(__dirname, '../../Data/confessions.json');
const cooldownPath = path.resolve(__dirname, '../../Data/balasCooldown.json');
const c = require("../../Config.js");

if (!fs.existsSync(cooldownPath)) fs.writeFileSync(cooldownPath, '{}', 'utf-8');

module.exports = {
  name: 'balas',
  description: 'Membalas pesan Confess.',
  category: 'Confession',
  async execute(quiet, msg, args) {
    const sender = msg.key.remoteJid;
    const id = args[0]?.toUpperCase();
    const content = args.slice(1).join(' ');
    const prefix = c.prefix;
    const banner = "https://i.ibb.co/RTrTGdW1/banner.png"

    if (!id || !content || content.length > 500) {
      return quiet.sendMessage(sender, { text: '❌ Format salah!\nContoh: !balas ABC12 Pesanmu (maks 500 karakter)' });
    }

    const cooldown = JSON.parse(fs.readFileSync(cooldownPath));
    const now = Date.now();
    if (cooldown[sender] && now - cooldown[sender] < 60000) {
      return quiet.sendMessage(sender, { text: '⏳ Tunggu 30 detik sebelum membalas lagi.' });
    }

    if (!fs.existsSync(confessionsPath)) {
      return quiet.sendMessage(sender, { text: '❌ Tidak ditemukan data confession.' });
    }

    const data = JSON.parse(fs.readFileSync(confessionsPath));
    const entry = data[id];

    if (!entry || (entry.from !== sender && entry.to !== sender)) {
      return quiet.sendMessage(sender, { text: '❌ ID tidak valid atau kamu bukan bagian dari percakapan ini.' });
    }

    const recipient = sender === entry.from ? entry.to : entry.from;

    const replyMsg = 
`───── Balasan ─────

"${content}"

> ID Confess : ${id}
Untuk saling balas, ketik:
${prefix}balas ${id} aku sayang kamu

[!] Pesan ini ditulis oleh seseorang, bot hanya menyampaikan
────────────────────────`;

    await quiet.sendMessage(recipient, {
      image: { url: banner },
      text: replyMsg
    });

    if (!entry.messages) entry.messages = [];
    entry.messages.push({
      sender: sender === entry.from ? 'from' : 'to',
      text: content,
      timestamp: new Date().toISOString()
    });

    data[id] = entry;
    fs.writeFileSync(confessionsPath, JSON.stringify(data, null, 2));

    cooldown[sender] = now;
    fs.writeFileSync(cooldownPath, JSON.stringify(cooldown, null, 2));

    await quiet.sendMessage(sender, { text: '✅ Balasanmu telah dikirim secara anonim.' });
  }
};