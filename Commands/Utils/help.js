const generateHelpMessage = require('../Utils/generateHelpMessage');

module.exports = {
  name: 'help',
  description: 'Bantuan umum',
  category: 'Utils',
  async execute(quiet, msg) {
    const helpMsg = generateHelpMessage();
    const sender = msg.key.remoteJid;
    const imageUrl = "https://i.ibb.co/PZmp4jZ0/Red-And-Beige-Handdrawn-Illustration-Valentine-s-Day-Facebook-Post-20250523-095231-0000.png";

    await quiet.sendMessage(sender, {
      image: { url: imageUrl },
      caption: helpMsg,
      footer: "Pilih opsi di bawah",
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
              description: 'Menampilkan pesam bantuan seluruh Command'
            },
            {
              title: 'Setbot',
              rowId: 'l_setbot',
              description: 'Mengatur Nama, Bio, Profle Picture'
            }
          ]
        },
        {
          title: '🖥️ Developer',
          rows: [
            {
              title: 'Github',
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
      ],
      headerType: 1
    });
  }
};