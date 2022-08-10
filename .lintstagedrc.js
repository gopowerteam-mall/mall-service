module.exports = {
  '*.ts!*.d.ts': ['eslint  --fix', 'prettier --write', 'git add .'],
  '*.js': ['eslint  --fix', 'prettier --write', 'git add .'],
}
