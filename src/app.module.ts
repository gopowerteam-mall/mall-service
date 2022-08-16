import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { RedisModule } from './redis/redis.module'
import { AuthModule } from './auth/auth.module'
import { LoggerModule } from './logger/logger.module'
import { WeappModule } from './modules/weapp/weapp.module'
import { AdminModule } from './modules/admin/admin.module'
import configuration from './config/configuration'
import { RouterModule } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: ['production'].includes(process.env.NODE_ENV),
      envFilePath: ['.env.development.local'],
      load: [configuration],
    }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    LoggerModule,
    WeappModule,
    AdminModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
      {
        path: 'weapp',
        module: WeappModule,
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
