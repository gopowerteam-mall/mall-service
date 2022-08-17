import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, Length } from 'class-validator'

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

/**
 * 添加管理员
 */
export class CreateAdminInput {
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
export class UpdateAdminInput {
  @ApiProperty()
  @Length(2, 20)
  @IsString()
  @IsOptional()
  realname: string
}

/**
 * 添加管理员
 */
export class UpdatePasswordInput {
  @ApiProperty()
  @Length(6, 20)
  @IsString()
  oldPassword: string

  @ApiProperty()
  @Length(6, 20)
  @IsString()
  newPassword: string
}
