import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { TokenService } from '../services/token.service'

@ApiTags('qiniu')
@Controller('qiniu')
@ApiSecurity('access-token')
export class QiniuController {
  constructor(private tokenService: TokenService) {}

  @ApiOperation({ operationId: 'getUploadToken', description: '获取存储Token' })
  @Get('upload-token')
  @ApiSecurity('access-token')
  getUploadToken() {
    return this.tokenService.getUploadToken()
  }
}
