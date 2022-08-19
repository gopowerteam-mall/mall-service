import { Module } from '@nestjs/common'
import { TokenService } from './services/token.service'
import { QiniuController } from './controllers/qiniu.controller'
import { FileService } from './services/file.service'

@Module({
  controllers: [QiniuController],
  providers: [TokenService, FileService],
  exports: [TokenService, FileService],
})
export class QiniuModule {}
