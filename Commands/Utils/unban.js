const fs = require('fs');
const path = require('path');
const bannedPath = path.resolve(__dirname, '../../Data/banned.json');
if (!fs.existsSync(bannedPath)) fs.writeFileSync(bannedPath, '[]', 'utf-8');

module.exports = {
    name: 'unban',
    description: 'Unban pengguna dari bot.',
    category: 'Owner',
    ownerOnly: true,
    async execute(quiet, msg, args) {
        const sender = msg.key.remoteJid;
        const target = args[0];
        if (!target) {
            return quiet.sendMessage(sender, { text: '❌ Format salah!\nContoh: !unban 62xxxxxxxxxx' });
        }

        let formatted = target;
        if (target.startsWith('08')) {
            formatted = '62' + target.slice(1);
        } else if (target.endsWith('@s.whatsapp.net')) {
            formatted = target.replace('@s.whatsapp.net', '');
        }

        const banned = JSON.parse(fs.readFileSync(bannedPath));
        const index = banned.indexOf(`${formatted}@s.whatsapp.net`);
        if (index === -1) {
            return quiet.sendMessage(sender, { text: `❌ Nomor ${formatted} tidak ada di daftar ban.` });
        }

        banned.splice(index, 1);
        fs.writeFileSync(bannedPath, JSON.stringify(banned, null, 2));

        const bannedTagPath = '../../Data/bannedTag.json';
        if (fs.existsSync(bannedTagPath)) {
            const bannedTag = JSON.parse(fs.readFileSync(bannedTagPath));
            delete bannedTag[`${formatted}@s.whatsapp.net`];
            fs.writeFileSync(bannedTagPath, JSON.stringify(bannedTag, null, 2));
        }

        quiet.sendMessage(sender, { text: `✅ Nomor ${formatted} berhasil di-unban.` });
    }
};