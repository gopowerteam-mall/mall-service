import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

class AdministratorInput {
  @ApiProperty({ description: '用户名' })
  @Length(5, 20)
  username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 20)
  password: string
}

/**
 * 设置初始化管理员
 */
export class AppInitInput {
  administrator: AdministratorInput
}

export class AppBaseInput {
  @ApiProperty({ description: '基础时间' })
  basetime: number
}

/**
 * 登录
 */
export class LoginInput {
  @ApiProperty({ description: '用户名' })
  @Length(5, 20)
  username: string

  @ApiProperty({ description: '密码' })
  @Length(6, 20)
  password: string
}
