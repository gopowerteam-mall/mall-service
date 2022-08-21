export default () => ({
  app: {
    port: process.env.APP_PORT,
    secret: process.env.APP_SECRET,
    saltRounds: process.env.APP_SALT_ROUNDS,
  },
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  },
  qiniu: {
    storage: {
      main: {
        bucket: process.env.QINIU_MAIN_BUCKET,
        domain: process.env.QINIU_MAIN_DOMAIN,
      },
      temp: {
        bucket: process.env.QINIU_TEMP_BUCKET,
        domain: process.env.QINIU_TEMP_DOMAIN,
      },
    },
    accessKey: process.env.QINIU_ACCESS_KEY,
    secretKey: process.env.QINIU_SECRET_KEY,
  },
})
