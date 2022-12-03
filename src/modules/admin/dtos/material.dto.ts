import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { pipe } from 'ramda'
import { WhereOperator } from 'src/config/enum.config'
import { Material } from 'src/entities/material.entity'
import { WhereOption } from 'src/shared/typeorm/decorators'
import { OrderInput } from 'src/shared/typeorm/query/inputs/order.input'
import { PageInput } from 'src/shared/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/shared/typeorm/query/inputs/query.input'

/**
 * 添加Material
 */
export class CreateMaterialInput {
  @ApiProperty()
  @IsString({ each: true })
  keys: string[]

  @ApiProperty({ required: false })
  @Optional()
  group: string
}

/**
 * 查询Material
 */
export class FindMaterialInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<Material>) {
  @ApiProperty({ description: '分组ID' })
  @Optional()
  @WhereOption({ name: 'group_id', type: WhereOperator.Equal })
  group?: string
}

/**
 * 查询MaterialGroup
 */
export class CreateMaterialGroupInput {
  @ApiProperty({ description: '素材名称' })
  @IsString()
  name: string
}

/**
 * 更新MaterialGroup
 */
export class UpdateMaterialGroupInput {
  @ApiProperty({ description: '素材名称' })
  @IsString()
  name: string
}

/**
 * 更新MaterialGroup
 */
export class DeleteMaterialGroupInput {
  @ApiProperty({ description: '删除后移动到的目标分组ID' })
  @Optional()
  target?: string
}
