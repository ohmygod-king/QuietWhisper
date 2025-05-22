const fs = require('fs')
const path = require('path')
const c = require('../config.js')

const commands = new Map()

// MODIFIED: Baca semua file dari subfolder dalam Commands
function loadCommands(dir = './Commands') {
    const files = fs.readdirSync(dir)
    for (const file of files) {
        const fullPath = path.join(dir, file)
        if (fs.lstatSync(fullPath).isDirectory()) {
            loadCommands(fullPath) // Rekursi untuk folder dalam
        } else if (file.endsWith('.js')) {
            const command = require(path.resolve(fullPath))
            if (command?.name) {
                command.category = path.basename(path.dirname(fullPath)) // Tambahkan kategori
                commands.set(command.name, command)
            }
        }
    }
}
loadCommands() // Jalankan pemuatan command

const welcomePath = path.resolve(__dirname, '../Data/welcome.json')
let welcomedUsers = []
if (fs.existsSync(welcomePath)) {
    welcomedUsers = JSON.parse(fs.readFileSync(welcomePath))
}

const recentSenders = new Set()

module.exports = async (quiet, m) => {
    const msg = m.messages[0]
    if (!msg.message || msg.key.fromMe) return

    const sender = msg.key.remoteJid
    const senderID = sender.split('@')[0]
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
    const args = body.trim().split(/ +/)
    const commandName = args[0]?.startsWith('!') ? args.shift().slice(1).toLowerCase() : null

    if (!welcomedUsers.includes(sender)) {
        welcomedUsers.push(sender)
        fs.writeFileSync(welcomePath, JSON.stringify(welcomedUsers, null, 2))
        await quiet.sendMessage(sender, {
            text: typeof c.welcomeMessage === 'function' ? c.welcomeMessage(sender) : c.welcomeMessage
        })
    }

    if (!recentSenders.has(sender)) {
        recentSenders.add(sender)
        const shortBody = body.length > 100 ? body.slice(0, 100) + '...' : body
        console.log(`[Pesan Baru] Dari: ${msg.pushName || sender} >> ${shortBody}`)
        setTimeout(() => recentSenders.delete(sender), 10000)
    }

    if (!commandName) return
    const command = commands.get(commandName)
    if (!command) return

    if (command.ownerOnly && !c.owner.includes(senderID)) {
        await quiet.sendMessage(sender, { text: '❌ Perintah ini hanya untuk owner bot.' })
        return
    }

    try {
        await command.execute(quiet, msg, args)
    } catch (err) {
        console.error("❌ Error saat eksekusi command:", err)
        await quiet.sendMessage(sender, { text: '❌ Terjadi kesalahan saat menjalankan perintah.' })
    }
}