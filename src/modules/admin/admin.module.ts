import { Module } from '@nestjs/common'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Admin } from 'src/entities/admin.entity'
import { AdminService } from './services/admin.service'
import { AdminController } from './controllers/admin.controller'
import { AppController } from './controllers/app.controller'
import { User } from 'src/entities/user.entity'
import { AuthModule } from 'src/auth/auth.module'
import { BannerController } from './controllers/banner.controller'
import { BannerService } from './services/banner.service'
import { Banner } from 'src/entities/banner.entity'
import { QiniuModule } from '../qiniu/qiniu.module'

@Module({
  imports: [
    AuthModule,
    QiniuModule,
    TypeOrmModule.forFeature([Admin, User, Banner]),
  ],
  providers: [UserService, AdminService, BannerService],
  controllers: [
    UserController,
    AdminController,
    AppController,
    BannerController,
  ],
})
export class AdminModule {}
