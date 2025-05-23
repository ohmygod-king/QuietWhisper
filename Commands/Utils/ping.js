const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: 'ping',
  description: 'Cek status bot',
  category: 'Utils',
  async execute(quiet, msg) {
    const sender = msg.key?.remoteJid || "unknown@s.whatsapp.net";

    const start = process.hrtime();

    const sentMsg = await quiet.sendMessage(sender, { text: "Ping..." });

    const diff = process.hrtime(start);
    const latency = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

    const uptime = moment.duration(process.uptime(), "seconds").format("d [hari], h [jam], m [menit], s [detik]");

    await quiet.sendMessage(sender, {
      text: `
〘 *QuietWhisper Status* 〙

⏱️ *Uptime:* ${uptime}
📡 *Ping:* ${latency} ms

Bot berjalan dengan baik.
`.trim()
    }, { quoted: sentMsg });
  }
};