const axios = require('axios');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'setbot',
    description: 'Ganti foto profil, nama bot, atau bio (about me)',
    category: 'Owner',
    ownerOnly: true,
    async execute(quiet, msg, args) {
        const sender = msg.key.remoteJid;
        const subcommand = args[0]?.toLowerCase();
        const value = args.slice(1).join(' ');

        switch (subcommand) {
            case 'pp': {
                let imageBuffer;

                const quoted = msg.message?.extendedTextMessage?.contextInfo;
                const quotedMsg = quoted?.quotedMessage?.imageMessage;

                if (quotedMsg) {
                    try {
                        imageBuffer = await downloadMediaMessage(
                            {
                                message: { imageMessage: quotedMsg },
                                key: {
                                    remoteJid: sender,
                                    id: quoted.stanzaId,
                                    fromMe: false,
                                    participant: quoted.participant,
                                },
                            },
                            'buffer',
                            {},
                            { reuploadRequest: quiet.updateMediaMessage }
                        );
                    } catch (err) {
                        console.error('Gagal download media:', err);
                        return await quiet.sendMessage(sender, {
                            text: '❌ Gagal mengunduh gambar dari pesan yang di-reply.'
                        });
                    }
                } else if (value.startsWith('http')) {
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

                try {
                    await quiet.updateProfilePicture(quiet.user.id, imageBuffer);
                    await quiet.sendMessage(sender, { text: '✅ Foto profil bot berhasil diperbarui.' });
                } catch (err) {
                    console.error('Gagal update profil:', err);
                    await quiet.sendMessage(sender, {
                        text: '❌ Terjadi kesalahan saat mengubah foto profil.'
                    });
                }
                break;
            }

            case 'name':
                if (!value) {
                    return await quiet.sendMessage(sender, {
                        text: '❌ Masukkan nama bot. Contoh: `!setbot name QuietWhisper`'
                    });
                }
                await quiet.updateProfileName(value);
                await quiet.sendMessage(sender, {
                    text: `✅ Nama bot berhasil diubah ke: *${value}*`
                });
                break;

            case 'bio':
                if (!value) {
                    return await quiet.sendMessage(sender, {
                        text: '❌ Masukkan bio bot. Contoh: `!setbot bio Aku bot rahasia!`'
                    });
                }
                await quiet.updateProfileStatus(value);
                await quiet.sendMessage(sender, {
                    text: `✅ Bio berhasil diperbarui ke: *${value}*`
                });
                break;

            default:
                await quiet.sendMessage(sender, {
                    text:
`❌ Format salah!

Gunakan:
• *!setbot pp* (reply gambar)
• *!setbot pp <url>*
• *!setbot name <nama>*
• *!setbot bio <status>*`
                });
        }
    }
};