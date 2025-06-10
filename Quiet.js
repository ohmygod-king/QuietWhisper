const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const chalk = require("chalk");
const readline = require("readline");

const usePairingCode = true;

async function question(prompt) {
    process.stdout.write(prompt);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question("", ans => {
        rl.close();
        resolve(ans);
    }));
}

async function connectToWhatsApp() {
    console.clear();
    console.log(chalk.magentaBright("╔══════════════════════════════════════════════╗"));
    console.log(chalk.magentaBright("║") + chalk.cyan.bold("     🚀 QuietWhisper is Starting...    ") + chalk.magentaBright("║"));
    console.log(chalk.magentaBright("╚══════════════════════════════════════════════╝"))
;
    const { state, saveCreds } = await useMultiFileAuthState("./QuietWhisper-Sessions");

    const quiet = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: !usePairingCode,
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    if (usePairingCode && !quiet.authState.creds.registered) {
        console.log(chalk.green("☘ Masukkan Nomor Dengan Awalan 62"));
        const phoneNumber = await question("> ");
        const code = await quiet.requestPairingCode(phoneNumber.trim(), "QUIETART");
        console.log(chalk.cyan(`🧩 Pairing Code: ${code}`));
    }

    quiet.ev.on("creds.update", saveCreds);

    let isConnected = false;
    quiet.ev.on("connection.update", ({ connection, lastDisconnect }) => {
        if (connection === "open") {
            if (!isConnected) {
                console.log(chalk.greenBright("✅ Bot QuietArtx berhasil terhubung ke WhatsApp!"));
                isConnected = true;
            }
        } else if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode || "unknown";
            console.log(chalk.redBright(`⛔ Koneksi terputus (${reason}). Mencoba menyambung ulang...`));
            setTimeout(connectToWhatsApp, 3000);
        }
    });

    quiet.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe || msg.message.protocolMessage) return;

        require("./Handlers/message")(quiet, m);
    });
}

connectToWhatsApp();