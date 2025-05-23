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
      buttons: [
        { buttonId: 'b_confess', buttonText: { displayText: 'Kirim Confess' }, type: 1 },
        { buttonId: 'b_balas', buttonText: { displayText: 'Balas Rahasia' }, type: 1 }
      ],
      headerType: 4
    });
  }
};