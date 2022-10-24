import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { RedisModule } from './redis/redis.module'
import { AuthModule } from './auth/auth.module'
import { LoggerModule } from './logger/logger.module'
import { ClientModule } from './modules/client/client.module'
import { AdminModule } from './modules/admin/admin.module'
import configuration from './config/configuration'
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core'
import { QiniuModule } from './modules/qiniu/qiniu.module'
import { ErrorInterceptor } from './interceptors/error.interceptor'

const environment = process.env.NODE_ENV || 'development'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${environment}.local`],
      load: [configuration],
    }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    LoggerModule,
    ClientModule,
    AdminModule,
    QiniuModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
      {
        path: 'client',
        module: ClientModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
