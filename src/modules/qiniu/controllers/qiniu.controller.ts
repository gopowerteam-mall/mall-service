import { Controller, Get } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { GetUploadTokenResponse } from '../responses/qiniu.response'
import { TokenService } from '../services/token.service'

@ApiTags('qiniu')
@Controller('qiniu')
@ApiSecurity('access-token')
export class QiniuController {
  constructor(private tokenService: TokenService) {}

  @ApiOperation({ operationId: 'getUploadToken', description: '获取存储Token' })
  @Get('upload-token')
  @ApiSecurity('access-token')
  @ApiOkResponse({ type: GetUploadTokenResponse })
  getUploadToken(): GetUploadTokenResponse {
    return {
      token: this.tokenService.getUploadToken(),
    }
  }
}
