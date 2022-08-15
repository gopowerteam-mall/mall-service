import { ApiProperty } from '@nestjs/swagger'
import { IsUUID, Length } from 'class-validator'

/**
 * 登录
 */
export class LoginDTO {
  @ApiProperty()
  @Length(5, 20)
  username: string

  @ApiProperty()
  @Length(6, 20)
  password: string
}

/**
 * 添加管理员
 */
export class AddAdminDTO {
  @ApiProperty()
  @Length(5, 20)
  username: string

  @ApiProperty()
  @Length(6, 20)
  password: string
}

/**
 * 删除管理员
 */
export class DeleteAdminDTO {
  @ApiProperty()
  @IsUUID()
  id: string
}

/**
 * 充值密码
 */
export class ResetPasswordDTO {
  @ApiProperty()
  @IsUUID()
  id: string
}
