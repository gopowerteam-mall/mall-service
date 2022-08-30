import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

/**
 * 登录
 */
export class LoginInput {
  @ApiProperty()
  @IsString()
  code: string
}
