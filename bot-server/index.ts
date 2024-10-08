import { Bot } from 'grammy';

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.TG_BOT_TOKEN);

console.log('Starting bot...');

// Handle the /start command.
bot.command('start', (ctx) => {
  console.log('start commant received', ctx.from);
  const message = 'Open our mini app to browse interesting channels';
  const websiteUrl = 'https://t.me/TeleHubListBot/start?startapp=TeleHubList';
  ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[{ text: 'Browse Channels', url: websiteUrl }]],
    },
  });
});

// Handle other messages.
bot.on('message', (ctx) => ctx.reply('Yo visit our mini app!'));

// Start the bot.
bot.start();
