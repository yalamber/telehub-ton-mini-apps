import TelegramBot from 'node-telegram-bot-api';

(async function main() {
  const bot = new TelegramBot(process.env.TG_BOT_TOKEN, {
    polling: false,
  });

  const message = 'List your telegram channels on our mini app!';
  const websiteUrl = 'https://t.me/TeleHubListBot/start?startapp=channel';

  await bot.sendMessage('@TeleHubList', message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[{ text: 'Browse Channels', url: websiteUrl }]],
    },
  });
})();
