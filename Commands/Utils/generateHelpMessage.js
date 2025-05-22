const fs = require('fs');
const path = require('path');

function generateHelpMessage(commandsDir = path.join(__dirname, '..', '..', 'Commands')) {
  const categories = {};

  fs.readdirSync(commandsDir).forEach(categoryFolder => {
    const categoryPath = path.join(commandsDir, categoryFolder);
    const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(path.join(categoryPath, file));
      const category = command.category || 'Others';

      if (!categories[category]) categories[category] = [];
      categories[category].push({
        name: command.name,
        description: command.description || '-'
      });
    }
  });

  // Format help message
  let message = `*┏━━ ⭑ QuietWhisper Menu ⭑━━┓*\n`;

  for (const [category, cmds] of Object.entries(categories)) {
    message += `*┃✦ 𖤐 ${category}*\n`;
    cmds.forEach(cmd => {
      message += `┃┗❖ \`!${cmd.name}\` - ${cmd.description}\n`;
    });
    message += `\n`;
  }

  message += `*┗━━ ⭑ Bot by QuietArtx ⭑━━┛*`;

  return message;
}

module.exports = generateHelpMessage;