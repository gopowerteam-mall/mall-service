import { ApiProperty } from '@nestjs/swagger'

export class AdminResetPasswordResponse {
  @ApiProperty({ description: '新生成随机密码' })
  password: string
}
