import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

class AdministratorInput {
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
  administrator: AdministratorInput
}

export class AppBaseInput {
  @ApiProperty()
  basetime: number
}

/**
 * 登录
 */
export class LoginInput {
  @ApiProperty()
  @Length(5, 20)
  username: string

  @ApiProperty()
  @Length(6, 20)
  password: string
}
