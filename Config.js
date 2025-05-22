const config = {
  owner: ["6285872099349"],
  prefix: "!",
  botName: "QuietWhisper",
}

config.welcomeMessage = (sender) => `
───  ${config.botName}  ───

Halo, *${sender.split('@')[0]}*.
Selamat datang!

Kirim pesan rahasia secara anonim ke siapa pun, tanpa mengungkap identitasmu.

Contoh penggunaan:
• ${config.prefix}confess 628xxxxxxx Hai... aku suka kamu sejak lama.

Pesanmu akan dikirim *anonim* ke nomor tujuan.

──── Info Bot ────
• Bot : *${config.botName}*
• Owner : *${config.owner[0]}*

Terima kasih telah menggunakan ${config.botName}.
Jaga etika, gunakan fitur ini dengan bijak.
`

module.exports = config