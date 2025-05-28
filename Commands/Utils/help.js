const generateHelpMessage = require('../Utils/generateHelpMessage');

module.exports = {
  name: 'help',
  description: 'Bantuan umum',
  category: 'Utils',
  async execute(quiet, msg) {
    const sender = msg.key.remoteJid;
    const helpMsg = generateHelpMessage();

    const imageUrl = "https://i.ibb.co/cXbYtLQY/profile.png";

    await quiet.sendMessage(sender, {
      image: { url: imageUrl },
    }, { quoted: msg });

    await quiet.sendMessage(sender, {
      text: 'Silakan pilih salah satu menu berikut:',
      title: `━━━ ⭑ QuietWhisper ⭑ ━━━`,
      buttonText: 'Pilih Menu',
      sections: [
        {
          title: '✉️ Fitur Confess',
          rows: [
            { title: 'Kirim Confess', rowId: 'l_confess', description: 'Kirim pesan anonim ke seseorang' },
            { title: 'Balas Confess', rowId: 'l_balas', description: 'Balas pesan anonim yang Anda terima' },
          ],
        },
        {
          title: '📁 Utils',
          rows: [
            {
              title: 'Help',
              rowId: 'l_help',
              description: 'Menampilkan seluruh command bot'
            },
            {
              title: 'Setbot',
              rowId: 'l_setbot',
              description: 'Ubah nama, bio, atau foto profil bot'
            }
          ]
        },
        {
          title: '🖥️ Developer',
          rows: [
            {
              title: 'GitHub',
              rowId: 'l_github',
              description: 'Prince | @ohmygod-king'
            },
            {
              title: 'Discord',
              rowId: 'l_discord',
              description: 'QuietxStore'
            }
          ]
        }
      ]
    }, { quoted: msg });
  }
};