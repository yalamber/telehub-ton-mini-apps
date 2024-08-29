module.exports = {
  apps: [
    {
      name: 'TeleHubListBot',
      script: './index.ts',
      interpreter: 'bun',
      interpreter_args: '--env-file=.env',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      output: './logs/out.log',
      error: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
