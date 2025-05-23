const fs = require('fs');
const path = require('path');
const c = require('../Config.js');

const commands = new Map();

function loadCommands(dir = './Commands') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            loadCommands(fullPath);
        } else if (file.endsWith('.js')) {
            const command = require(path.resolve(fullPath));
            if (command?.name) {
                command.category = path.basename(path.dirname(fullPath));
                commands.set(command.name, command);
            }
        }
    }
}
loadCommands();

const welcomePath = path.resolve(__dirname, '../Data/welcome.json');
let welcomedUsers = [];
if (fs.existsSync(welcomePath)) {
    welcomedUsers = JSON.parse(fs.readFileSync(welcomePath));
}

const recentSenders = new Set();

module.exports = async (quiet, m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const senderID = sender.split('@')[0];
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const args = body.trim().split(/ +/);
    const commandName = args[0]?.startsWith('!') ? args.shift().slice(1).toLowerCase() : null;

    if (msg.message?.listResponseMessage) {
      const rowId = msg.message.listResponseMessage.singleSelectReply.selectedRowId;

      switch (rowId) {
        case 'l_confess':
          await quiet.sendMessage(sender, { text: 'Ketik *!confess <nomor> <pesan>* untuk mengirim pesan rahasia.' });
          break;
        case 'l_balas':
          await quiet.sendMessage(sender, { text: 'Ketik *!balas <nomor> <pesan>* untuk membalas pesan rahasia.' });
          break;
        case 'l_github':
          await quiet.sendMessage(sender, { text: 'https://github.com/ohmygod-king' });
          break;
        case 'l_discord':
          await quiet.sendMessage(sender, { text: 'Coming Soon' });
          break;
        case 'l_help':
          const helpCommand = commands.get('help');
          if (helpCommand) {
            await helpCommand.execute(quiet, msg, []);
          } else {
            await quiet.sendMessage(sender, { text: '❌ Command help tidak ditemukan.' });
          }
          break;
        default:
          await quiet.sendMessage(sender, { text: '❌ Tombol tidak dikenal.' });
      }
    }

    if (!welcomedUsers.includes(sender)) {
        welcomedUsers.push(sender);
        fs.writeFileSync(welcomePath, JSON.stringify(welcomedUsers, null, 2));
        await quiet.sendMessage(sender, {
            text: typeof c.welcomeMessage === 'function' ? c.welcomeMessage(sender) : c.welcomeMessage,
            footer: 'QuietWhisper',
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

    if (!recentSenders.has(sender)) {
        recentSenders.add(sender);
        const shortBody = body.length > 100 ? body.slice(0, 100) + '...' : body;
        console.log(`[Pesan Baru] Dari: ${msg.pushName || sender} >> ${shortBody}`);
        setTimeout(() => recentSenders.delete(sender), 10000);
    }

    if (!commandName) return;
    const command = commands.get(commandName);
    if (!command) return;

    if (command.ownerOnly && !c.owner.includes(senderID)) {
        await quiet.sendMessage(sender, { text: '❌ Perintah ini hanya untuk owner bot.' });
        return;
    }

    try {
        await command.execute(quiet, msg, args);
    } catch (err) {
        console.error("❌ Error saat eksekusi command:", err);
        await quiet.sendMessage(sender, { text: '❌ Terjadi kesalahan saat menjalankan perintah.' });
    }
};