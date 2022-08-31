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
import { CategoryController } from './controllers/category.controller'
import { Category } from 'src/entities/category.entity'
import { CategoryService } from './services/category.service'

@Module({
  imports: [
    AuthModule,
    QiniuModule,
    TypeOrmModule.forFeature([Administrator, User, Banner, Category]),
  ],
  providers: [
    UserService,
    BannerService,
    AdministratorService,
    CategoryService,
  ],
  controllers: [
    AdministratorController,
    UserController,
    AppController,
    BannerController,
    CategoryController,
  ],
})
export class AdminModule {}
