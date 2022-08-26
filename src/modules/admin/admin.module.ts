import { Module } from '@nestjs/common'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './controllers/app.controller'
import { User } from 'src/entities/user.entity'
import { AuthModule } from 'src/auth/auth.module'
import { BannerController } from './controllers/banner.controller'
import { BannerService } from './services/banner.service'
import { Banner } from 'src/entities/banner.entity'
import { QiniuModule } from '../qiniu/qiniu.module'
import { AdministratorController } from './controllers/administrator.controller'
import { AdministratorService } from './services/administrator.service'
import { Administrator } from 'src/entities/administrator.entity'

@Module({
  imports: [
    AuthModule,
    QiniuModule,
    TypeOrmModule.forFeature([Administrator, User, Banner]),
  ],
  providers: [UserService, BannerService, AdministratorService],
  controllers: [
    AdministratorController,
    UserController,
    AppController,
    BannerController,
  ],
})
export class AdminModule {}
