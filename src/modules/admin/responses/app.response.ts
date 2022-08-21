import { TokenOrigin } from 'src/config/enum.config'
import { ApiProperty } from '@nestjs/swagger'

export class TokenResponse {
  @ApiProperty({ description: '授权Token' })
  access_token: string

  @ApiProperty({ description: '刷新Token' })
  refresh_token: string

  @ApiProperty({ description: '授权Token过期时间' })
  expires_in: number

  @ApiProperty({ description: 'Token来源' })
  token_origin: TokenOrigin
}

class QiniuConfig {
  @ApiProperty({ description: '域名' })
  domain: string
}

export class AppBaseResponse {
  @ApiProperty({ description: '授权Token' })
  base_time: number

  @ApiProperty({
    description: '七牛配置',
  })
  qiniu: QiniuConfig
}
