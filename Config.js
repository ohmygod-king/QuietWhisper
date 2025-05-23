const config = {
  owner: ["628xxxxxx"],
  prefix: "!",
  botName: "QuietWhisper",
};

config.welcomeMessage = (msg = {}) => {
  const name = msg.pushName || (msg.key?.participant || msg.key?.remoteJid || 'User').split('@')[0];
  return `
───  ${config.botName}  ───

Halo, *${name}*.
Selamat datang!

Kirim pesan rahasia secara anonim ke siapa pun, tanpa mengungkap identitasmu.

Pesanmu akan dikirim *anonim* ke nomor tujuan.
Silahkan pilih menu untuk melanjutkan.

──── Info Bot ────
• Bot : *${config.botName}*
• Owner : *${config.owner[0]}*

Terima kasih telah menggunakan ${config.botName}.
Jaga etika, gunakan fitur ini dengan bijak.
`};

module.exports = config;