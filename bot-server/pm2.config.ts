module.exports = {
  apps: [
    {
      name: 'TeleHubListBot',
      script: './index.ts',
      interpreter: 'bun',
      interpreter_args: '--env-file=.env',
      watch: true,
      instances: 1,
    },
  ],
};
