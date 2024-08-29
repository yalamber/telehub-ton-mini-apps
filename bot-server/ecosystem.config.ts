module.exports = {
  apps: [
    {
      name: 'TeleHubListBot',
      script: './bot-server/index.ts',
      interpreter: 'node',
      interpreter_args: '--experimental-strip-types --env-file=.env',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
