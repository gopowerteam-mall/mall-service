import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { AppController } from './controllers/app.controller'
import { AppService } from './services/app.service'
import { BannerController } from './controllers/banner.controller'
import { BannerService } from './services/banner.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Banner } from 'src/entities/banner.entity'

@Module({
  imports: [HttpModule, AuthModule, TypeOrmModule.forFeature([Banner])],
  controllers: [AppController, BannerController],
  providers: [AppService, BannerService],
})
export class WeappModule {}
