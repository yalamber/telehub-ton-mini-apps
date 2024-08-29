module.exports = {
  apps: [
    {
      name: 'TeleHubListBot',
      script: './bot-server/index.ts',
      interpreter: 'bun',
      interpreter_args: '--env-file=.env',
      watch: true,
    },
  ],
};
