const generateHelpMessage = require('../Utils/generateHelpMessage');

module.exports = {
  name: 'help',
  description: 'Bantuan umum',
  category: 'Utils',
  async execute(quiet, msg) {
    const sender = msg.key.remoteJid;
    const helpMsg = generateHelpMessage();

    const imageUrl = "https://i.ibb.co/PZmp4jZ0/Red-And-Beige-Handdrawn-Illustration-Valentine-s-Day-Facebook-Post-20250523-095231-0000.png";

    // 1. Kirim banner image terlebih dahulu
    await quiet.sendMessage(sender, {
      image: { url: imageUrl },
      caption: `━━ ⭑ QuietWhisper Menu ⭑━━`
    }, { quoted: msg });

    // 2. Kirim list menu
    await quiet.sendMessage(sender, {
      text: 'Silakan pilih salah satu menu berikut:',
      footer: 'QuietWhisper Bot',
      title: '📖 Daftar Menu',
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