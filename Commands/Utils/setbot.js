const axios = require('axios');

module.exports = {
    name: 'setbot',
    description: 'Ganti foto profil, nama bot, atau bio (about me)',
    category: 'Utils',
    ownerOnly: true,
    async execute(quiet, msg, args) {
        const sender = msg.key.remoteJid;
        const subcommand = args[0]?.toLowerCase();
        const value = args.slice(1).join(' ');

        switch (subcommand) {
            case 'pp':
                let imageBuffer;

                if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                    // Jika reply gambar
                    const quoted = msg.message.extendedTextMessage.contextInfo;
                    const media = await quiet.downloadMediaMessage(quoted);
                    imageBuffer = media;
                } else if (value.startsWith('http')) {
                    // Jika dari link
                    try {
                        const response = await axios.get(value, { responseType: 'arraybuffer' });
                        imageBuffer = Buffer.from(response.data, 'binary');
                    } catch {
                        return await quiet.sendMessage(sender, {
                            text: '❌ Gagal mengunduh gambar dari URL.'
                        });
                    }
                } else {
                    return await quiet.sendMessage(sender, {
                        text: '❌ Harap reply ke gambar *atau* kirim `!setbot pp <url>`.'
                    });
                }

                await quiet.updateProfilePicture(quiet.user.id, imageBuffer);
                await quiet.sendMessage(sender, { text: '✅ Foto profil bot berhasil diperbarui.' });
                break;

            case 'name':
                if (!value) return await quiet.sendMessage(sender, {
                    text: '❌ Masukkan nama bot. Contoh: `!setbot name QuietWhisper`'
                });

                await quiet.updateProfileName(value);
                await quiet.sendMessage(sender, { text: `✅ Nama bot berhasil diubah ke: *${value}*` });
                break;

            case 'bio':
                if (!value) return await quiet.sendMessage(sender, {
                    text: '❌ Masukkan bio bot. Contoh: `!setbot bio Aku bot rahasia!`'
                });

                await quiet.updateProfileStatus(value);
                await quiet.sendMessage(sender, { text: `✅ Bio berhasil diperbarui ke: *${value}*` });
                break;

            default:
                await quiet.sendMessage(sender, {
                    text: '❌ Format salah.\n\nGunakan:\n• `!setbot pp` (reply gambar)\n• `!setbot pp <url>`\n• `!setbot name <nama>`\n• `!setbot bio <status>`'
                });
        }
    }
};