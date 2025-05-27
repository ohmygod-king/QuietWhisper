const fs = require('fs');
const path = require('path');
const bannedPath = path.resolve(__dirname, '../../Data/banned.json');
if (!fs.existsSync(bannedPath)) fs.writeFileSync(bannedPath, '[]', 'utf-8');

module.exports = {
    name: 'ban',
    description: 'Ban pengguna dari bot.',
    category: 'Owner',
    ownerOnly: true,
    async execute(quiet, msg, args) {
        const sender = msg.key.remoteJid;
        const target = args[0];
        if (!target) {
            return quiet.sendMessage(sender, { text: '❌ Format salah!\nContoh: !ban 62xxxxxxxxxx' });
        }

        let formatted = target;
        if (target.startsWith('08')) {
            formatted = '62' + target.slice(1);
        } else if (target.endsWith('@s.whatsapp.net')) {
            formatted = target.replace('@s.whatsapp.net', '');
        }

        const banned = JSON.parse(fs.readFileSync(bannedPath));
        if (banned.includes(`${formatted}@s.whatsapp.net`)) {
            return quiet.sendMessage(sender, { text: `❌ Nomor ${formatted} sudah dibanned.` });
        }

        banned.push(`${formatted}@s.whatsapp.net`);
        fs.writeFileSync(bannedPath, JSON.stringify(banned, null, 2));
        quiet.sendMessage(sender, { text: `✅ Nomor ${formatted} berhasil dibanned.` });
    }
};