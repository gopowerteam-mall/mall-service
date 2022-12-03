import { Optional } from '@nestjs/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator'
import { WhereOperator } from 'src/config/enum.config'
import { Category } from 'src/entities/category.entity'
import { WhereOption } from 'src/shared/typeorm/decorators'
import { QueryInput } from 'src/shared/typeorm/query/inputs/query.input'

export class CreateCategoryInput {
  @ApiProperty({ description: '标题' })
  @IsString()
  title: string

  @ApiProperty({ description: '分类图片' })
  @ValidateIf((category) => !!category.recommended)
  @IsNotEmpty()
  image?: string

  @ApiProperty({ description: '是否推荐' })
  @IsBoolean()
  recommended: boolean

  @ApiProperty({ description: '父ID' })
  @Optional()
  parentId?: string
}

export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}

export class FindCategoryInput extends QueryInput<Category> {
  @ApiProperty({ description: '标题' })
  @Optional()
  @WhereOption({ type: WhereOperator.Like })
  title?: string

  @ApiProperty({ description: '是否推荐' })
  @Optional()
  @WhereOption({ type: WhereOperator.Equal })
  @Transform(({ obj, key }) => {
    return obj[key] === 'true'
  })
  recommended?: boolean

  @ApiProperty({
    description: '是否包含子元素',
  })
  @Optional()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true'
  })
  recursion?: boolean
}
