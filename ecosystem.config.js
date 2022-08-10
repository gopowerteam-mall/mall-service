module.exports = {
  apps: [
    {
      name: 'mall-service',
      script: './dist/main.js',
      env_development: {
        NODE_ENV: 'local',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      log: './output.log',
    },
  ],
  deploy: {
    production: {
      user: 'root', //ssh 登陆服务器用户名
      host: '', //ssh 地址服务器domain/IP
      ref: 'origin/master', //Git远程/分支
      repo: '', //git地址使用ssh地址
      path: '', //项目存放服务器文件路径
      ssh_options: 'StrictHostKeyChecking=no',
      'pre-deploy': 'git fetch --all',
      'post-deploy': 'yarn && yarn build && pm2 reload ecosystem.config.js', //部署后的动作
      env: {
        NODE_ENV: 'production',
      },
    },
  },
}
