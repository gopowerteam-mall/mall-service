import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, Length } from 'class-validator'
import { pipe } from 'ramda'
import { WhereOperator } from 'src/config/enum.config'
import { Administrator } from 'src/entities/administrator.entity'
import { WhereOption } from 'src/shared/typeorm/decorators'
import { PageInput } from 'src/shared/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/shared/typeorm/query/inputs/query.input'
import { OrderInput } from 'src/shared/typeorm/query/inputs/order.input'

/**
 * 添加管理员
 */
export class CreateAdministratorInput {
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
export class UpdateAdministratorInput {
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

export class FindAdministratorInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<Administrator>) {
  @ApiProperty({ required: false, description: '姓名(模糊查询)' })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Like })
  realname?: string

  @ApiProperty({ required: false, description: '用户名(模糊查询)' })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Like })
  username?: string
}
