const config = {
  owner: ["628xxxxxx"],
  prefix: "!",
  botName: "QuietWhisper",
};

config.welcomeMessage = (sender) => `
───  ${config.botName}  ───

Halo, *${sender.split('@')[0]}*.
Selamat datang!

Kirim pesan rahasia secara anonim ke siapa pun, tanpa mengungkap identitasmu.

Pesanmu akan dikirim *anonim* ke nomor tujuan.
Silahkan pilih menu untuk melanjutkan.

──── Info Bot ────
• Bot : *${config.botName}*
• Owner : *${config.owner[0]}*

Terima kasih telah menggunakan ${config.botName}.
Jaga etika, gunakan fitur ini dengan bijak.
`;

module.exports = config;