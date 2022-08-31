import { Optional } from '@nestjs/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator'
import { Category } from 'src/entities/category.entity'
import { QueryInput } from 'src/shared/typeorm/query/inputs/query.input'

export class CreateCategoryInput {
  @ApiProperty({ description: '标题', required: true })
  @IsString()
  title: string

  @ApiProperty({ description: '分类图片', required: false })
  @ValidateIf((category) => !!category.recommended)
  @IsNotEmpty()
  image: string

  @ApiProperty({ description: '是否推荐', required: true })
  @IsBoolean()
  recommended: boolean

  @ApiProperty({ description: '父ID', required: false })
  @Optional()
  parentId: string
}

export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}

export class FindCategoryInput extends QueryInput<Category> {
  @ApiProperty({ description: '标题', required: false })
  @Optional()
  title: string

  @ApiProperty({ description: '是否推荐', required: false })
  @Optional()
  recommended: boolean
}
