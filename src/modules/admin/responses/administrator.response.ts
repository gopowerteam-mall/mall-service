import { ApiProperty } from '@nestjs/swagger'

export class AdministratorResetPasswordResponse {
  @ApiProperty({ description: '新生成随机密码' })
  password: string
}
