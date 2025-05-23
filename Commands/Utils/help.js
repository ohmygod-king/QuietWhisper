const generateHelpMessage = require('../Utils/generateHelpMessage');

module.exports = {
  name: 'help',
  description: 'Bantuan umum',
  category: 'Utils',
  async execute(quiet, msg) {
    const helpMsg = generateHelpMessage();
    const sender = msg.key.remoteJid;
    const imageUrl = "https://i.ibb.co/Jj6BtnMP/18718d99139f6b7c22328fa298d3679a.jpg";

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