module.exports = {
  apps: [
    {
      name: "sinjapanaisite-api",
      script: "/opt/sinjapanaisite/artifacts/api-server/dist/index.mjs",
      cwd: "/opt/sinjapanaisite",
      interpreter: "/root/.nvm/versions/node/v20.20.0/bin/node",
      interpreter_args: "--env-file=/opt/sinjapanaisite/.env",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "4000",
      },
      error_file: "/root/.pm2/logs/sinjapanaisite-api-error.log",
      out_file: "/root/.pm2/logs/sinjapanaisite-api-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
