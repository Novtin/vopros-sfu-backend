module.exports = {
  apps: [
    {
      name: 'vopros-sfu',
      script: './dist/main.js',
      instances: 5,
      exec_mode: 'cluster',
      // watch: true,
      // ignore_watch: ['node_modules'],
      // max_restarts: 5,
      // restart_delay: 5000,
    },
  ],
};
