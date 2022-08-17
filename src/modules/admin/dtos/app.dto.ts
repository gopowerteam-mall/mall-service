import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

class Admin {
  @ApiProperty()
  @Length(5, 20)
  username: string

  @ApiProperty()
  @Length(6, 20)
  password: string
}

/**
 * 设置初始化管理员
 */
export class AppInitInput {
  @ApiProperty()
  admin: Admin
}
