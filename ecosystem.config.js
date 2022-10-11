module.exports = {
  apps: [
    {
      name: 'mall-service',
      script: './dist/main.js',
      log: './output.log',
    },
  ],
  deploy: {
    production: {
      user: 'root', //ssh 登陆服务器用户名
      host: '121.5.165.149', //ssh 地址服务器domain/IP
      ref: 'origin/master', //Git远程/分支
      repo: 'git@github.com:gopowerteam-mall/mall-service.git', //git地址使用ssh地址
      path: '/home/apps/mall-service', //项目存放服务器文件路径
      ssh_options: 'StrictHostKeyChecking=no',
      'pre-deploy': 'git fetch --all',
      'post-deploy':
        'pnpm install \
        && npm run build \
        && pm2 reload ecosystem.config.js', //部署后的动作
    },
  },
}
